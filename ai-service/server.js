import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// Logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});

// Root endpoint - Health check
app.get('/', (req, res) => {
  console.log('Health check requested');
  res.json({
    status: 'AI Service is running! 🤖',
    timestamp: new Date().toISOString(),
    port: PORT,
    version: '2.0.0'
  });
});

// Chat endpoint with streaming support
app.post('/chat', (req, res) => {
  try {
    const { messages, message } = req.body;
    
    // Support both formats
    const userMessage = message || (messages && messages[messages.length - 1]?.content) || '';
    
    if (!userMessage) {
      return res.status(400).json({ 
        error: 'Message is required' 
      });
    }

    console.log(`Chat request: "${userMessage}"`);

    // Set headers for streaming
    res.writeHead(200, {
      'Content-Type': 'text/plain; charset=utf-8',
      'Transfer-Encoding': 'chunked',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type'
    });

    // Simple AI responses
    const responses = [
      `Xin chào! Bạn vừa nói: "${userMessage}". Tôi là AI assistant của bạn.`,
      `Cảm ơn bạn đã gửi: "${userMessage}". Tôi hiểu và sẵn sàng giúp đỡ.`,
      `Thú vị! Về "${userMessage}", tôi nghĩ đây là một chủ đề hay.`,
      `Tôi đã nhận được tin nhắn: "${userMessage}". Còn gì khác tôi có thể giúp không?`
    ];

    const response = responses[Math.floor(Math.random() * responses.length)];
    
    // Stream the response word by word
    const words = response.split(' ');
    let index = 0;

    const streamInterval = setInterval(() => {
      if (index < words.length) {
        const token = words[index] + ' ';
        res.write(`data: ${JSON.stringify({ token, done: false })}\n\n`);
        index++;
      } else {
        res.write(`data: ${JSON.stringify({ token: '', done: true })}\n\n`);
        res.end();
        clearInterval(streamInterval);
      }
    }, 100); // Send a word every 100ms

  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
});

// Health endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'AI Chat Service',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.originalUrl,
    method: req.method
  });
});

// Error handler
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    error: 'Internal server error',
    message: error.message
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 AI Service started successfully on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/`);
  console.log(`💬 Chat endpoint: POST http://localhost:${PORT}/chat`);
});
