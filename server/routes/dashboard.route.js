import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import { DashboardController } from "../controllers/common/dashboard.controller.js";

const router = express.Router();


router.get("/", authMiddleware, DashboardController.getDashboard);

export default router;
