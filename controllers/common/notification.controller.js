import { NotificationService } from "../../services/common/notification/notification.service.js";

export class NotificationController {
  /**
   * Lấy danh sách notifications của user
   */
  static async getUserNotifications(req, res) {
    try {
      const userId = req.user.id;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const result = await NotificationService.getUserNotifications(userId, page, limit);
      
      res.json({
        success: true,
        ...result,
      });
    } catch (error) {
      console.error("Get notifications error:", error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * Đánh dấu notification đã đọc
   */
  static async markAsRead(req, res) {
    try {
      const userId = req.user.id;
      const notificationId = parseInt(req.params.id);

      const notification = await NotificationService.markAsRead(notificationId, userId);
      
      res.json({
        success: true,
        notification,
      });
    } catch (error) {
      console.error("Mark as read error:", error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * Đánh dấu tất cả notifications đã đọc
   */
  static async markAllAsRead(req, res) {
    try {
      const userId = req.user.id;

      const result = await NotificationService.markAllAsRead(userId);
      
      res.json({
        success: true,
        updatedCount: result.count,
      });
    } catch (error) {
      console.error("Mark all as read error:", error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * Lấy số lượng notifications chưa đọc
   */
  static async getUnreadCount(req, res) {
    try {
      const userId = req.user.id;

      const count = await NotificationService.getUnreadCount(userId);
      
      res.json({
        success: true,
        unreadCount: count,
      });
    } catch (error) {
      console.error("Get unread count error:", error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}