// middleware/aiRateLimit.js
import rateLimit from 'express-rate-limit';

export const aiRateLimit = rateLimit({
  windowMs: 60 * 1000,
  max: 30, // 30 req/phút mỗi IP
  standardHeaders: true,
  legacyHeaders: false,
});
