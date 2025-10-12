import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    status: '🤖 AI Service running',
    model: process.env.OLLAMA_MODEL,
    host: process.env.OLLAMA_HOST,
    timestamp: new Date().toISOString()
  });
});

// Check Ollama connection
app.get('/health', async (req, res) => {
  try {
    const response = await fetch(`${process.env.OLLAMA_HOST}/api/tags`);
    if (response.ok) {
      const data = await response.json();
      res.json({
        status: 'healthy',
        ollama: 'connected',
        models: data.models?.map(m => m.name) || []
      });
    } else {
      throw new Error('Ollama not responding');
    }
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      ollama: 'disconnected',
      error: error.message
    });
  }
});

// Chat endpoint
app.post('/chat', async (req, res) => {
  try {
    const { message, model, context } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const ollamaModel = model || process.env.OLLAMA_MODEL;
    
    console.log(`💬 Processing chat: "${message}" with model: ${ollamaModel}`);

    // Call Ollama API
    const response = await fetch(`${process.env.OLLAMA_HOST}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: ollamaModel,
        prompt: message,
        context: context || undefined,
        options: {
          temperature: parseFloat(process.env.OLLAMA_TEMP) || 0.7,
          top_p: parseFloat(process.env.OLLAMA_TOP_P) || 0.9,
          top_k: parseInt(process.env.OLLAMA_TOP_K) || 40,
        },
        stream: false
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Ollama API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    console.log(`✅ Chat response generated successfully`);
    
    res.json({ 
      response: data.response,
      model: ollamaModel,
      done: data.done,
      context: data.context,
      eval_count: data.eval_count,
      eval_duration: data.eval_duration
    });

  } catch (error) {
    console.error('❌ AI Chat error:', error);
    res.status(500).json({ 
      error: 'Failed to process chat request',
      details: error.message 
    });
  }
});

// Stream chat endpoint cho real-time response
app.post('/chat/stream', async (req, res) => {
  try {
    const { message, model, context } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const ollamaModel = model || process.env.OLLAMA_MODEL;
    
    console.log(`🔄 Processing stream chat: "${message}"`);

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');

    const response = await fetch(`${process.env.OLLAMA_HOST}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: ollamaModel,
        prompt: message,
        context: context || undefined,
        options: {
          temperature: parseFloat(process.env.OLLAMA_TEMP) || 0.7,
          top_p: parseFloat(process.env.OLLAMA_TOP_P) || 0.9,
          top_k: parseInt(process.env.OLLAMA_TOP_K) || 40,
        },
        stream: true
      })
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status}`);
    }

    // Handle streaming response
    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n').filter(line => line.trim());
      
      for (const line of lines) {
        try {
          const data = JSON.parse(line);
          res.write(`data: ${JSON.stringify(data)}\n\n`);
        } catch (e) {
          // Skip invalid JSON
        }
      }
    }

    res.write('data: [DONE]\n\n');
    res.end();

  } catch (error) {
    console.error('❌ AI Stream error:', error);
    res.status(500).json({ 
      error: 'Failed to process stream request',
      details: error.message 
    });
  }
});

// Pull model endpoint
app.post('/pull-model', async (req, res) => {
  try {
    const { model } = req.body;
    const modelName = model || process.env.OLLAMA_MODEL;

    console.log(`📥 Pulling model: ${modelName}`);

    const response = await fetch(`${process.env.OLLAMA_HOST}/api/pull`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: modelName
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to pull model: ${response.status}`);
    }

    res.json({ 
      message: `Model ${modelName} pull initiated`,
      model: modelName 
    });

  } catch (error) {
    console.error('❌ Model pull error:', error);
    res.status(500).json({ 
      error: 'Failed to pull model',
      details: error.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(`🤖 AI Service running on port ${PORT}`);
  console.log(`📡 Ollama Host: ${process.env.OLLAMA_HOST}`);
  console.log(`🧠 Model: ${process.env.OLLAMA_MODEL}`);
});