import api from './common/axios';

const messageService = {
  // Gửi tin nhắn
  async sendMessage(receiverId, content) {
    try {
      const response = await api.post('/messages', {
        receiverId,
        content
      });
      return response.data;
    } catch (error) {
      console.error('Lỗi khi gửi tin nhắn:', error);
      throw error;
    }
  },

  // Lấy cuộc trò chuyện với một người dùng
  async getConversation(userId, page = 1, limit = 50) {
    try {
      const response = await api.get(`/messages/conversations/${userId}?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy cuộc trò chuyện:', error);
      throw error;
    }
  },

  // Lấy danh sách tất cả cuộc trò chuyện
  async getConversations() {
    try {
      const response = await api.get('/messages/conversations');
      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy danh sách cuộc trò chuyện:', error);
      throw error;
    }
  },

  // Đánh dấu tin nhắn đã đọc
  async markAsRead(messageId) {
    try {
      const response = await api.put(`/messages/${messageId}/read`);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi đánh dấu tin nhắn đã đọc:', error);
      throw error;
    }
  },

  // Đánh dấu toàn bộ cuộc trò chuyện đã đọc
  async markConversationAsRead(userId) {
    try {
      const response = await api.put(`/messages/conversations/${userId}/read`);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi đánh dấu cuộc trò chuyện đã đọc:', error);
      throw error;
    }
  },

  // Lấy số lượng tin nhắn chưa đọc
  async getUnreadCount() {
    try {
      const response = await api.get('/messages/unread-count');
      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy số tin nhắn chưa đọc:', error);
      throw error;
    }
  },

  // Tìm kiếm người dùng
  async searchUsers(query) {
    try {
      const response = await api.get(`/messages/search-users?q=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi tìm kiếm người dùng:', error);
      throw error;
    }
  },

  // Lấy danh sách members cùng tổ chức
  async getOrganizationMembers() {
    try {
      // Lấy thông tin user hiện tại để xác định role
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      
      let endpoint;
      if (currentUser.role === 'ADMIN') {
        endpoint = '/admin/members/list?limit=100';
      } else {
        endpoint = '/member/members?limit=100';
      }
      
      const response = await api.get(endpoint);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy danh sách members:', error);
      throw error;
    }
  }
};

export default messageService;