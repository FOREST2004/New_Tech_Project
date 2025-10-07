import express from 'express';
import { authMiddleware, requireRole } from '../../middleware/auth.js';
import * as MemberController from '../../controllers/member/member.controller.js';
import statsRoute from './stats.route.js';

const router = express.Router();

router.use(authMiddleware);
router.use(requireRole('MEMBER'));

router.get('/members', MemberController.getMembers);


router.use('/stats', statsRoute);

export default router;