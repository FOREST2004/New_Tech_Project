import express from 'express';
import fetch from 'node-fetch';

const router = express.Router();

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'https://thuan-ai-service.herokuapp.com';

// Health check AI service
router.get('/health', async (req, res) => {
  try {
    const response = await fetch(`${AI_SERVICE_URL}/health`);
    
    if (!response.ok) {
      throw new Error(`AI Service health check failed: ${response.status}`);
    }
    
    const data = await response.json();
    res.json(data);

  } catch (error) {
    console.error('AI Health check error:', error);
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

    console.log(`Forwarding chat to AI service: "${message}"`);
    
    const response = await fetch(`${AI_SERVICE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message, model, context }),
    });

    if (!response.ok) {
      throw new Error(`AI Service error: ${response.status}`);
    }

    const data = await response.json();
    res.json(data);

  } catch (error) {
    console.error('AI Route error:', error);
    res.status(500).json({ 
      error: 'AI service unavailable',
      details: error.message 
    });
  }
});

export default router;