import express from 'express';
import { authMiddleware, requireRole } from '../../middleware/auth.js';
import * as eventController from '../../controllers/common/event.controller.js';

const router = express.Router();

router.use(authMiddleware);
router.use(requireRole(['ADMIN', 'MEMBER']));

router.get('/', eventController.getMyEvents);
router.get('/upcoming', eventController.getUpcomingEvents);
router.post('/:eventId/register', eventController.registerEvent);
router.delete('/:eventId/register', eventController.cancelEventRegistration);

export default router;