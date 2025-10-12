import express from 'express';
import fetch from 'node-fetch';

const router = express.Router();

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'https://thuan-ai-service.herokuapp.com';

// Chat with AI - streaming support
router.post('/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    console.log(`Forwarding to AI service: ${messages.length} messages`);
    
    const response = await fetch(`${AI_SERVICE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ messages })
    });

    if (!response.ok) {
      throw new Error(`AI Service error: ${response.status}`);
    }

    // Forward the streaming response
    res.writeHead(200, {
      'Content-Type': 'text/plain; charset=utf-8',
      'Transfer-Encoding': 'chunked',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    });

    response.body.pipe(res);

  } catch (error) {
    console.error('AI Route error:', error);
    res.status(500).json({ 
      error: 'AI service unavailable',
      details: error.message 
    });
  }
});

export default router;