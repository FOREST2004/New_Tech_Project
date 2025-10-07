import express from "express";
import { authMiddleware, requireRole } from "../../middleware/auth.js";
import { NotificationController } from "../../controllers/common/notification.controller.js";

const router = express.Router();

router.use(authMiddleware);
router.use(requireRole(["ADMIN", "MEMBER"]));

// Lấy danh sách notifications
router.get("/", NotificationController.getUserNotifications);

// Lấy số lượng notifications chưa đọc
router.get("/unread-count", NotificationController.getUnreadCount);

// Đánh dấu notification đã đọc
router.put("/:id/read", NotificationController.markAsRead);

// Đánh dấu tất cả notifications đã đọc
router.put("/mark-all-read", NotificationController.markAllAsRead);

export default router;