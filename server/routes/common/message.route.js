import express from 'express';
import messageController from '../../controllers/common/message.controller.js';
import { authMiddleware, requireRole } from '../../middleware/auth.js';

const router = express.Router();

// Tất cả routes đều yêu cầu authentication
router.use(authMiddleware);
router.use(requireRole(['ADMIN', 'MEMBER']));

// POST /api/messages - Gửi tin nhắn mới
router.post('/', messageController.sendMessage);

// GET /api/messages/conversations - Lấy danh sách cuộc trò chuyện
router.get('/conversations', messageController.getConversations);

// GET /api/messages/conversations/:userId - Lấy cuộc trò chuyện với một người dùng cụ thể
router.get('/conversations/:userId', messageController.getConversation);

// PUT /api/messages/:messageId/read - Đánh dấu tin nhắn đã đọc
router.put('/:messageId/read', messageController.markAsRead);

// PUT /api/messages/conversations/:userId/read - Đánh dấu cuộc trò chuyện đã đọc
router.put('/conversations/:userId/read', messageController.markConversationAsRead);

// GET /api/messages/unread-count - Lấy số tin nhắn chưa đọc
router.get('/unread-count', messageController.getUnreadCount);

// GET /api/messages/search-users - Tìm kiếm người dùng để nhắn tin
router.get('/search-users', messageController.searchUsers);

export default router;