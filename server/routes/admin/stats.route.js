import express from "express";
import { authMiddleware, requireRole } from "../../middleware/auth.js";
import { AdminStatsController } from "../../controllers/admin/stats.controller.js";

const router = express.Router();


router.use(authMiddleware);
router.use(requireRole('ADMIN'));


router.get("/dashboard", AdminStatsController.getDashboardStats);

export default router;