import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Helper function để convert BigInt thành Number
const convertBigIntToNumber = (obj) => {
  if (obj === null || obj === undefined) return obj;
  
  if (typeof obj === 'bigint') {
    return Number(obj);
  }
  
  if (Array.isArray(obj)) {
    return obj.map(convertBigIntToNumber);
  }
  
  if (typeof obj === 'object') {
    const converted = {};
    for (const [key, value] of Object.entries(obj)) {
      converted[key] = convertBigIntToNumber(value);
    }
    return converted;
  }
  
  return obj;
};

class MessageService {
  // Gửi tin nhắn
  async sendMessage(senderId, receiverId, content) {
    try {
      const message = await prisma.message.create({
        data: {
          senderId,
          receiverId,
          content,
        },
        include: {
          sender: {
            select: {
              id: true,
              fullName: true,
              email: true,
              avatarUrl: true,
            },
          },
          receiver: {
            select: {
              id: true,
              fullName: true,
              email: true,
              avatarUrl: true,
            },
          },
        },
      });

      return {
        success: true,
        data: message,
      };
    } catch (error) {
      throw new Error(`Lỗi khi gửi tin nhắn: ${error.message}`);
    }
  }

  // Lấy cuộc trò chuyện giữa 2 người
  async getConversation(userId1, userId2, page = 1, limit = 50) {
    try {
      const offset = (page - 1) * limit;
  
      const messages = await prisma.message.findMany({
        where: {
          OR: [
            { senderId: userId1, receiverId: userId2 },
            { senderId: userId2, receiverId: userId1 },
          ],
        },
        include: {
          sender: {
            select: {
              id: true,
              fullName: true,
              email: true,
              avatarUrl: true,
            },
          },
          receiver: {
            select: {
              id: true,
              fullName: true,
              email: true,
              avatarUrl: true,
            },
          },
        },
        orderBy: {
          createdAt: 'asc',
        },
        skip: offset,
        take: limit,
      });
  
      return messages; // Trả về trực tiếp array messages
    } catch (error) {
      throw new Error(`Lỗi khi lấy cuộc trò chuyện: ${error.message}`);
    }
  }

  // Lấy danh sách cuộc trò chuyện của user
  async getUserConversations(userId) {
    try {
      // Lấy tất cả tin nhắn liên quan đến user
      const messages = await prisma.message.findMany({
        where: {
          OR: [
            { senderId: userId },
            { receiverId: userId }
          ]
        },
        include: {
          sender: {
            select: {
              id: true,
              fullName: true,
              email: true,
              avatarUrl: true
            }
          },
          receiver: {
            select: {
              id: true,
              fullName: true,
              email: true,
              avatarUrl: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      // Xử lý để lấy cuộc trò chuyện gần nhất với mỗi người
      const conversationsMap = new Map();
      
      for (const message of messages) {
        const otherUserId = message.senderId === userId ? message.receiverId : message.senderId;
        const otherUser = message.senderId === userId ? message.receiver : message.sender;
        
        if (!conversationsMap.has(otherUserId)) {
          // Đếm tin nhắn chưa đọc từ người này
          const unreadCount = await prisma.message.count({
            where: {
              senderId: otherUserId,
              receiverId: userId,
              isRead: false
            }
          });

          conversationsMap.set(otherUserId, {
            other_user_id: otherUserId,
            full_name: otherUser.fullName,
            email: otherUser.email,
            avatar_url: otherUser.avatarUrl,
            last_message: message.content,
            last_message_time: message.createdAt,
            unread_count: unreadCount
          });
        }
      }

      const conversations = Array.from(conversationsMap.values());
      
      // Convert BigInt to Number để tránh lỗi JSON serialization
      return convertBigIntToNumber(conversations);
    } catch (error) {
      throw new Error(`Lỗi khi lấy danh sách cuộc trò chuyện: ${error.message}`);
    }
  }

  // Đánh dấu tin nhắn đã đọc
  async markAsRead(messageId, userId) {
    try {
      const message = await prisma.message.updateMany({
        where: {
          id: messageId,
          receiverId: userId,
        },
        data: {
          isRead: true,
        },
      });
      return message;
    } catch (error) {
      throw new Error(`Lỗi khi đánh dấu tin nhắn đã đọc: ${error.message}`);
    }
  }

  // Đánh dấu tất cả tin nhắn trong cuộc trò chuyện đã đọc
  async markConversationAsRead(userId, otherUserId) {
    try {
      const result = await prisma.message.updateMany({
        where: {
          senderId: otherUserId,
          receiverId: userId,
          isRead: false,
        },
        data: {
          isRead: true,
        },
      });
      return result;
    } catch (error) {
      throw new Error(`Lỗi khi đánh dấu cuộc trò chuyện đã đọc: ${error.message}`);
    }
  }

  // Lấy số tin nhắn chưa đọc
  async getUnreadCount(userId) {
    try {
      const count = await prisma.message.count({
        where: {
          receiverId: userId,
          isRead: false,
        },
      });
      return count;
    } catch (error) {
      throw new Error(`Lỗi khi lấy số tin nhắn chưa đọc: ${error.message}`);
    }
  }

  // Tìm kiếm người dùng
  async searchUsers(query, currentUserId) {
    try {
      const users = await prisma.user.findMany({
        where: {
          AND: [
            {
              id: {
                not: currentUserId,
              },
            },
            {
              OR: [
                {
                  fullName: {
                    contains: query,
                    mode: 'insensitive',
                  },
                },
                {
                  email: {
                    contains: query,
                    mode: 'insensitive',
                  },
                },
              ],
            },
          ],
        },
        select: {
          id: true,
          fullName: true,
          email: true,
          avatarUrl: true,
        },
        take: 10,
      });

      return {
        success: true,
        data: users,
      };
    } catch (error) {
      throw new Error(`Lỗi khi tìm kiếm người dùng: ${error.message}`);
    }
  }
}

export default new MessageService();