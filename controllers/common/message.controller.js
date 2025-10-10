import messageService from '../../services/common/message/message.service.js';

class MessageController {
  // Gửi tin nhắn mới
  async sendMessage(req, res) {
    try {
      const { receiverId, content } = req.body;
      const senderId = req.user.id;

      if (!receiverId || !content) {
        return res.status(400).json({
          success: false,
          message: 'Thiếu thông tin người nhận hoặc nội dung tin nhắn',
        });
      }

      // Trong sendMessage method
      const message = await messageService.sendMessage(senderId, receiverId, content);
      
      // Emit socket event cho real-time messaging
      if (req.io) {
      // Emit message.data thay vì message
      const messageToEmit = message.data;
      
      // Emit cho người nhận
      req.io.to(`user-${receiverId}`).emit('new_message', messageToEmit);
      // Emit cho người gửi (để sync trên nhiều device)
      req.io.to(`user-${senderId}`).emit('new_message', messageToEmit);
      }

      res.status(201).json({
        success: true,
        data: message,
        message: 'Tin nhắn đã được gửi thành công',
      });
    } catch (error) {
      console.error('Lỗi khi gửi tin nhắn:', error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Lấy cuộc trò chuyện giữa hai người dùng
  async getConversation(req, res) {
    try {
      const { userId } = req.params;
      const currentUserId = req.user.id;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 50;
  
      const messages = await messageService.getConversation(currentUserId, parseInt(userId), page, limit);
  
      res.json({
        success: true,
        data: messages,
        pagination: {
          page,
          limit,
          total: messages.length,
        },
      });
    } catch (error) {
      console.error('Lỗi khi lấy cuộc trò chuyện:', error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Lấy danh sách cuộc trò chuyện
  async getConversations(req, res) {
    try {
      const userId = req.user.id;
      const conversations = await messageService.getUserConversations(userId);

      res.json({
        success: true,
        data: conversations,
      });
    } catch (error) {
      console.error('Lỗi khi lấy danh sách cuộc trò chuyện:', error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Đánh dấu tin nhắn đã đọc
  async markAsRead(req, res) {
    try {
      const { messageId } = req.params;
      const userId = req.user.id;

      await messageService.markAsRead(parseInt(messageId), userId);

      res.json({
        success: true,
        message: 'Đã đánh dấu tin nhắn đã đọc',
      });
    } catch (error) {
      console.error('Lỗi khi đánh dấu tin nhắn đã đọc:', error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Đánh dấu cuộc trò chuyện đã đọc
  async markConversationAsRead(req, res) {
    try {
      const { userId } = req.params;
      const currentUserId = req.user.id;

      await messageService.markConversationAsRead(currentUserId, parseInt(userId));

      res.json({
        success: true,
        message: 'Đã đánh dấu cuộc trò chuyện đã đọc',
      });
    } catch (error) {
      console.error('Lỗi khi đánh dấu cuộc trò chuyện đã đọc:', error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Lấy số tin nhắn chưa đọc
  async getUnreadCount(req, res) {
    try {
      const userId = req.user.id;
      const count = await messageService.getUnreadCount(userId);

      res.json({
        success: true,
        data: { count },
      });
    } catch (error) {
      console.error('Lỗi khi lấy số tin nhắn chưa đọc:', error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Tìm kiếm người dùng
  async searchUsers(req, res) {
    try {
      const { q } = req.query;
      const currentUserId = req.user.id;

      if (!q || q.trim().length < 2) {
        return res.status(400).json({
          success: false,
          message: 'Từ khóa tìm kiếm phải có ít nhất 2 ký tự',
        });
      }

      const users = await messageService.searchUsers(q.trim(), currentUserId);

      res.json({
        success: true,
        data: users,
      });
    } catch (error) {
      console.error('Lỗi khi tìm kiếm người dùng:', error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

export default new MessageController();