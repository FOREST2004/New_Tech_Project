import express from 'express';
import fetch from 'node-fetch';

const router = express.Router();

// URL của AI service
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:3001';

// Middleware để log requests
router.use((req, res, next) => {
  console.log(`🤖 AI Route: ${req.method} ${req.path}`);
  next();
});

// Health check AI service
router.get('/health', async (req, res) => {
  try {
    const response = await fetch(`${AI_SERVICE_URL}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`AI Service health check failed: ${response.status}`);
    }

    const data = await response.json();
    res.json(data);

  } catch (error) {
    console.error('❌ AI Health check error:', error);
    res.status(503).json({ 
      error: 'AI service unavailable',
      details: error.message 
    });
  }
});

// Chat with AI
router.post('/chat', async (req, res) => {
  try {
    const { message, model, context } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    console.log(`💬 Forwarding chat request to AI service: "${message}"`);
    
    // Forward request to AI service
    const response = await fetch(`${AI_SERVICE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message, model, context }),
      timeout: 60000 // 60 second timeout
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`AI Service error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    console.log(`✅ AI response received successfully`);
    res.json(data);

  } catch (error) {
    console.error('❌ AI Route error:', error);
    res.status(500).json({ 
      error: 'AI service unavailable',
      details: error.message 
    });
  }
});

// Stream chat
router.post('/chat/stream', async (req, res) => {
  try {
    const { message, model, context } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    console.log(`🔄 Forwarding stream request to AI service`);

    const response = await fetch(`${AI_SERVICE_URL}/chat/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message, model, context })
    });

    if (!response.ok) {
      throw new Error(`AI Service error: ${response.status}`);
    }

    // Set appropriate headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Pipe the stream
    response.body.pipe(res);

  } catch (error) {
    console.error('❌ AI Stream error:', error);
    res.status(500).json({ 
      error: 'AI stream unavailable',
      details: error.message 
    });
  }
});

export default router;