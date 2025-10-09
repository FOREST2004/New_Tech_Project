// routes/ai.routes.js
import { Router } from 'express';
import auth from '../middleware/auth.js';
import { aiRateLimit } from '../middleware/aiRateLimit.js';
import {
  chatStream, generateOnce, getModels,
  aiEventDescription, aiSuggestTags, aiSummarizeRegistration,
} from '../controllers/ai.controller.js';

const router = Router();

router.get('/models', auth, getModels);
router.post('/chat', auth, aiRateLimit, chatStream);             // SSE stream
router.post('/generate', auth, aiRateLimit, generateOnce);       // non-stream

router.post('/event/description', auth, aiRateLimit, aiEventDescription);
router.post('/event/suggest-tags', auth, aiRateLimit, aiSuggestTags);
router.post('/registration/summarize', auth, aiRateLimit, aiSummarizeRegistration);

export default router;
