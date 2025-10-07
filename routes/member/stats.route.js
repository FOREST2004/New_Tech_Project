import express from 'express';
import * as MemberStatsController from '../../controllers/member/stats.controller.js';
import { authMiddleware, requireRole } from '../../middleware/auth.js';

const router = express.Router();

router.use(authMiddleware);
router.use(requireRole('MEMBER'));


router.get('/dashboard', MemberStatsController.getMemberStats);

export default router;