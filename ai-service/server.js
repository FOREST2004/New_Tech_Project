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

// Chat endpoint
app.post('/chat', (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ 
        error: 'Message is required' 
      });
    }

    console.log(`Chat request: "${message}"`);

    // Simple AI response
    const responses = [
      `Xin chào! Bạn vừa nói: "${message}". Tôi là AI assistant của bạn.`,
      `Cảm ơn bạn đã gửi: "${message}". Tôi hiểu và sẵn sàng giúp đỡ.`,
      `Thú vị! Về "${message}", tôi nghĩ đây là một chủ đề hay.`,
      `Tôi đã nhận được tin nhắn: "${message}". Còn gì khác tôi có thể giúp không?`
    ];

    const response = responses[Math.floor(Math.random() * responses.length)];

    res.json({
      response: response,
      model: 'simple-ai',
      timestamp: new Date().toISOString(),
      status: 'success'
    });

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
