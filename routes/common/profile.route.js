import express from 'express';
import { authMiddleware, requireRole } from '../../middleware/auth.js';
import * as profileController from '../../controllers/common/profile.controller.js'; 

const router = express.Router();

router.use(authMiddleware);
router.use(requireRole(['ADMIN', 'MEMBER']));


router.get('/', profileController.getProfile);


router.put('/', profileController.updateProfile);


router.put('/password', profileController.changePassword);

export default router;