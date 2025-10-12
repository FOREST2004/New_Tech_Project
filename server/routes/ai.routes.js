import express from 'express';
import fetch from 'node-fetch';

const router = express.Router();

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'https://thuan-ai-service.herokuapp.com';

// Chat with AI
router.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    console.log(`Forwarding to AI service: "${message}"`);
    
    const response = await fetch(`${AI_SERVICE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message })
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