// routes/ai.routes.js
import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { aiRateLimit } from '../middleware/aiRateLimit.js';
import {
  chatStream, generateOnce, getModels,
  aiEventDescription, aiSuggestTags, aiSummarizeRegistration,
} from '../controllers/ai.controller.js';

const router = Router();

router.get('/models', authMiddleware, getModels);
router.post('/chat', authMiddleware, aiRateLimit, chatStream);             // SSE stream
router.post('/generate', authMiddleware, aiRateLimit, generateOnce);       // non-stream

router.post('/event/description', authMiddleware, aiRateLimit, aiEventDescription);
router.post('/event/suggest-tags', authMiddleware, aiRateLimit, aiSuggestTags);
router.post('/registration/summarize', authMiddleware, aiRateLimit, aiSummarizeRegistration);

export default router;
