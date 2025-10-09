import fetch from 'node-fetch';

class VectorEmbeddingService {
  constructor() {
    // Using a simple TF-IDF approach for now, can be enhanced with actual embedding models
    this.vocabulary = new Map();
    this.documentFrequency = new Map();
    this.totalDocuments = 0;
    this.stopWords = new Set([
      'và', 'của', 'trong', 'với', 'là', 'có', 'được', 'để', 'một', 'các',
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
      'of', 'with', 'by', 'from', 'up', 'about', 'into', 'through', 'during'
    ]);
  }

  // Preprocess text for embedding
  preprocessText(text) {
    if (!text) return [];
    
    return text
      .toLowerCase()
      .replace(/[^\w\s\u00C0-\u024F\u1E00-\u1EFF]/g, ' ') // Keep Vietnamese characters
      .split(/\s+/)
      .filter(word => word.length > 2 && !this.stopWords.has(word));
  }

  // Calculate TF-IDF vector for a document
  calculateTFIDF(document) {
    const words = this.preprocessText(document);
    const termFreq = new Map();
    
    // Calculate term frequency
    words.forEach(word => {
      termFreq.set(word, (termFreq.get(word) || 0) + 1);
    });

    const vector = {};
    
    // Calculate TF-IDF for each term
    termFreq.forEach((tf, term) => {
      const df = this.documentFrequency.get(term) || 1;
      const idf = Math.log(this.totalDocuments / df);
      vector[term] = (tf / words.length) * idf;
    });

    return vector;
  }

  // Build vocabulary from a collection of documents
  buildVocabulary(documents) {
    this.vocabulary.clear();
    this.documentFrequency.clear();
    this.totalDocuments = documents.length;

    // Count document frequency for each term
    documents.forEach(doc => {
      const words = new Set(this.preprocessText(doc));
      words.forEach(word => {
        this.documentFrequency.set(word, (this.documentFrequency.get(word) || 0) + 1);
        this.vocabulary.set(word, true);
      });
    });
  }

  // Calculate cosine similarity between two vectors
  cosineSimilarity(vector1, vector2) {
    const keys1 = Object.keys(vector1);
    const keys2 = Object.keys(vector2);
    const allKeys = new Set([...keys1, ...keys2]);

    let dotProduct = 0;
    let norm1 = 0;
    let norm2 = 0;

    allKeys.forEach(key => {
      const val1 = vector1[key] || 0;
      const val2 = vector2[key] || 0;
      
      dotProduct += val1 * val2;
      norm1 += val1 * val1;
      norm2 += val2 * val2;
    });

    if (norm1 === 0 || norm2 === 0) return 0;
    return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
  }

  // Generate semantic embedding for text
  generateEmbedding(text) {
    return this.calculateTFIDF(text);
  }

  // Find semantically similar documents
  findSimilarDocuments(queryText, documents, threshold = 0.1) {
    if (!documents || documents.length === 0) return [];

    // Build vocabulary if not already built
    if (this.vocabulary.size === 0) {
      const allTexts = documents.map(doc => 
        typeof doc === 'string' ? doc : 
        `${doc.title || ''} ${doc.description || ''} ${doc.content || ''}`
      );
      this.buildVocabulary(allTexts);
    }

    const queryVector = this.generateEmbedding(queryText);
    const similarities = [];

    documents.forEach((doc, index) => {
      const docText = typeof doc === 'string' ? doc : 
        `${doc.title || ''} ${doc.description || ''} ${doc.content || ''}`;
      
      const docVector = this.generateEmbedding(docText);
      const similarity = this.cosineSimilarity(queryVector, docVector);
      
      if (similarity > threshold) {
        similarities.push({
          document: doc,
          similarity,
          index
        });
      }
    });

    return similarities.sort((a, b) => b.similarity - a.similarity);
  }

  // Enhanced semantic search with entity and keyword boosting
  semanticSearch(query, documents, options = {}) {
    const {
      threshold = 0.1,
      maxResults = 10,
      entityBoost = 1.5,
      keywordBoost = 1.2,
      entities = [],
      keywords = []
    } = options;

    const similarities = this.findSimilarDocuments(query, documents, threshold);
    
    // Apply boosting for entities and keywords
    similarities.forEach(item => {
      const docText = typeof item.document === 'string' ? item.document : 
        `${item.document.title || ''} ${item.document.description || ''} ${item.document.content || ''}`;
      
      const lowerDocText = docText.toLowerCase();
      
      // Boost for entities
      entities.forEach(entity => {
        if (lowerDocText.includes(entity.toLowerCase())) {
          item.similarity *= entityBoost;
        }
      });
      
      // Boost for keywords
      keywords.forEach(keyword => {
        if (lowerDocText.includes(keyword.toLowerCase())) {
          item.similarity *= keywordBoost;
        }
      });
    });

    // Re-sort after boosting and limit results
    return similarities
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, maxResults);
  }

  // Generate query expansion suggestions
  generateQueryExpansion(query, documents) {
    const queryWords = this.preprocessText(query);
    const relatedTerms = new Map();

    // Find documents similar to the query
    const similarDocs = this.findSimilarDocuments(query, documents, 0.05);
    
    // Extract terms from similar documents
    similarDocs.slice(0, 5).forEach(item => {
      const docText = typeof item.document === 'string' ? item.document : 
        `${item.document.title || ''} ${item.document.description || ''} ${item.document.content || ''}`;
      
      const docWords = this.preprocessText(docText);
      docWords.forEach(word => {
        if (!queryWords.includes(word)) {
          relatedTerms.set(word, (relatedTerms.get(word) || 0) + item.similarity);
        }
      });
    });

    // Return top related terms
    return Array.from(relatedTerms.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([term]) => term);
  }

  // Calculate semantic relevance score
  calculateRelevanceScore(query, document, context = {}) {
    const baseScore = this.findSimilarDocuments(query, [document])[0]?.similarity || 0;
    
    let relevanceScore = baseScore;
    
    // Boost based on document type
    if (document.type === 'event' && context.needsEvents) {
      relevanceScore *= 1.3;
    }
    if (document.type === 'user' && context.needsUsers) {
      relevanceScore *= 1.3;
    }
    
    // Boost based on recency for time-based queries
    if (context.isTimeBasedQuery && document.createdAt) {
      const daysSinceCreated = (Date.now() - new Date(document.createdAt)) / (1000 * 60 * 60 * 24);
      if (daysSinceCreated < 7) relevanceScore *= 1.2;
      else if (daysSinceCreated < 30) relevanceScore *= 1.1;
    }
    
    return Math.min(relevanceScore, 1.0); // Cap at 1.0
  }
}

export default VectorEmbeddingService;