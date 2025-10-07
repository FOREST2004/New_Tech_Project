import axios from '../axios.js';

export const notificationService = {
  // Lấy danh sách notifications
  async getNotifications(page = 1, limit = 10) {
    try {
      const response = await axios.get(`/notifications?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  },

  // Lấy số lượng notifications chưa đọc
  async getUnreadCount() {
    try {
      const response = await axios.get('/notifications/unread-count');
      return response.data;
    } catch (error) {
      console.error('Error fetching unread count:', error);
      throw error;
    }
  },

  // Đánh dấu notification đã đọc
  async markAsRead(notificationId) {
    try {
      const response = await axios.put(`/notifications/${notificationId}/read`);
      return response.data;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  },

  // Đánh dấu tất cả notifications đã đọc
  async markAllAsRead() {
    try {
      const response = await axios.put('/notifications/mark-all-read');
      return response.data;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }
};