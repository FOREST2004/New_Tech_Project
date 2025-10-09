import ContextService from './contextService.js';
import { generateContextualPrompt, DOMAIN_KNOWLEDGE } from '../prompts/domainKnowledge.js';

class AIContextService {
  constructor() {
    this.contextService = new ContextService();
  }

  async enhancePromptWithContext(userPrompt, organizationId = null) {
    try {
      // Get relevant context based on user prompt
      const contextData = await this.contextService.getRelevantContext(userPrompt, organizationId);
      
      if (!contextData.hasRelevantData) {
        return {
          enhancedPrompt: this.buildBasicPrompt(userPrompt),
          context: null,
          hasContext: false,
          suggestions: this.getBasicSuggestions()
        };
      }

      // Format context for AI consumption
      const formattedContext = this.contextService.formatContextForAI(contextData.context);
      
      // Create enhanced prompt with domain knowledge
      const enhancedPrompt = generateContextualPrompt(userPrompt, {
        formattedContext,
        ...contextData.context
      }, contextData.analysis);

      return {
        enhancedPrompt,
        context: contextData.context,
        analysis: contextData.analysis,
        hasContext: true,
        summary: contextData.context.summary,
        insights: contextData.insights || [],
        suggestions: contextData.suggestions || []
      };
    } catch (error) {
      console.error('Error enhancing prompt with context:', error);
      return {
        enhancedPrompt: this.buildBasicPrompt(userPrompt),
        context: null,
        hasContext: false,
        error: error.message
      };
    }
  }

  // Create a basic prompt without context (fallback)
  buildBasicPrompt(userPrompt) {
    return `${DOMAIN_KNOWLEDGE.SYSTEM_CONTEXT}

CÂU HỎI CỦA NGƯỜI DÙNG: "${userPrompt}"

HƯỚNG DẪN TRẢ LỜI:
1. Trả lời bằng tiếng Việt tự nhiên và thân thiện
2. Giải thích các tính năng của hệ thống quản lý sự kiện
3. Đưa ra gợi ý về cách sử dụng hệ thống
4. Nếu cần dữ liệu cụ thể, hướng dẫn cách tìm kiếm

Hãy trả lời một cách hữu ích và thân thiện.`;
  }

  // Get basic suggestions when no context is available
  getBasicSuggestions() {
    return [
      "Hiển thị danh sách sự kiện",
      "Thống kê tổng quan hệ thống", 
      "Sự kiện sắp tới",
      "Người dùng hoạt động",
      "Tỷ lệ tham dự sự kiện"
    ];
  }

  // Analyze if query needs specific organization context
  needsOrganizationContext(userMessage) {
    const orgKeywords = ['tổ chức', 'công ty', 'organization', 'org', 'của chúng tôi', 'của tôi'];
    const lowerMessage = userMessage.toLowerCase();
    return orgKeywords.some(keyword => lowerMessage.includes(keyword));
  }

  // Get context summary for logging/debugging
  getContextSummary(contextData) {
    if (!contextData || !contextData.context) return 'No context available';
    
    const { context, analysis, insights } = contextData;
    let summary = `Context Summary:\n`;
    
    if (context.events?.length > 0) {
      summary += `- Events: ${context.events.length}\n`;
    }
    if (context.users?.length > 0) {
      summary += `- Users: ${context.users.length}\n`;
    }
    if (context.registrations?.length > 0) {
      summary += `- Registrations: ${context.registrations.length}\n`;
    }
    if (context.statistics) {
      summary += `- Has statistics: Yes\n`;
    }
    if (insights?.length > 0) {
      summary += `- Insights: ${insights.length}\n`;
    }
    
    summary += `Query type: ${analysis?.queryType || 'general'}`;
    
    return summary;
  }

  // Get suggested follow-up questions based on context and analysis
  getSuggestedQuestions(contextData) {
    if (!contextData || !contextData.context) {
      return this.getBasicSuggestions();
    }

    const { context, analysis, suggestions } = contextData;
    
    // Use suggestions from context service if available
    if (suggestions && suggestions.length > 0) {
      return suggestions.slice(0, 5);
    }

    // Generate suggestions based on available data
    const dynamicSuggestions = [];

    if (context.events?.length > 0) {
      dynamicSuggestions.push("Sự kiện nào có nhiều người đăng ký nhất?");
      dynamicSuggestions.push("Thống kê sự kiện theo trạng thái");
    }

    if (context.users?.length > 0) {
      dynamicSuggestions.push("Ai là người tạo nhiều sự kiện nhất?");
      dynamicSuggestions.push("Tỷ lệ người dùng hoạt động");
    }

    if (context.registrations?.length > 0) {
      dynamicSuggestions.push("Tỷ lệ tham dự trung bình");
      dynamicSuggestions.push("Xu hướng đăng ký theo thời gian");
    }

    if (analysis?.entities?.length > 0) {
      analysis.entities.forEach(entity => {
        switch (entity) {
          case 'cybersecurity':
            dynamicSuggestions.push("Sự kiện về cybersecurity");
            break;
          case 'ai_ml':
            dynamicSuggestions.push("Workshop về AI và Machine Learning");
            break;
          case 'blockchain':
            dynamicSuggestions.push("Hội thảo blockchain và Web3");
            break;
        }
      });
    }

    // Return suggestions or fallback to basic ones
    return dynamicSuggestions.length > 0 ? 
      dynamicSuggestions.slice(0, 5) : 
      this.getBasicSuggestions();
  }

  async analyzeQuery(query, organizationId = null, options = {}) {
    try {
      const { useSemanticSearch = true } = options;
      
      const analysis = this.contextService.analyzeQuery(query);
      
      // Use enhanced context retrieval with semantic search
      const context = useSemanticSearch 
        ? await this.contextService.getEnhancedContext(query, organizationId, options)
        : await this.contextService.getRelevantContext(query, organizationId);
      
      // Generate suggestions using semantic analysis if available
      const suggestions = context.semanticEnhanced 
        ? this.contextService.generateSemanticSuggestions(query, context)
        : this.contextService.generateSuggestions(context, analysis);
      
      return {
        analysis,
        context,
        insights: this.contextService.generateInsights(context, analysis),
        suggestions,
        semanticEnhanced: context.semanticEnhanced || false
      };
    } catch (error) {
      console.error('Query analysis error:', error);
      return {
        analysis: { queryType: 'general', error: error.message },
        context: { hasContext: false },
        insights: [],
        suggestions: [],
        semanticEnhanced: false
      };
    }
  }

  // Generate training data for AI improvement
  generateTrainingData(userQuery, contextData, aiResponse) {
    return {
      timestamp: new Date().toISOString(),
      query: userQuery,
      queryType: contextData?.analysis?.queryType || 'general',
      hasContext: contextData?.hasContext || false,
      contextSummary: this.getContextSummary(contextData),
      response: aiResponse,
      insights: contextData?.insights || [],
      suggestions: contextData?.suggestions || [],
      // This can be used for future model training
      trainingMetadata: {
        keywords: contextData?.analysis?.keywords || [],
        entities: contextData?.analysis?.entities || [],
        intent: contextData?.analysis?.intent || 'unknown'
      }
    };
  }
}

export default AIContextService;