import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

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

      return {
        success: true,
        data: messages,
      };
    } catch (error) {
      throw new Error(`Lỗi khi lấy cuộc trò chuyện: ${error.message}`);
    }
  }

  // Lấy danh sách cuộc trò chuyện của user
  async getUserConversations(userId) {
    try {
      const conversations = await prisma.$queryRaw`
        SELECT DISTINCT
          CASE 
            WHEN m."senderId" = ${userId} THEN m."receiverId"
            ELSE m."senderId"
          END as other_user_id,
          u."fullName" as full_name,
          u.email,
          u."avatarUrl" as avatar_url,
          m.content as last_message,
          m."createdAt" as last_message_time,
          COUNT(CASE WHEN m."receiverId" = ${userId} AND m."isRead" = false THEN 1 END) as unread_count
        FROM "Message" m
        JOIN "User" u ON (
          CASE 
            WHEN m."senderId" = ${userId} THEN u.id = m."receiverId"
            ELSE u.id = m."senderId"
          END
        )
        WHERE m."senderId" = ${userId} OR m."receiverId" = ${userId}
        GROUP BY other_user_id, u."fullName", u.email, u."avatarUrl", m.content, m."createdAt"
        ORDER BY m."createdAt" DESC
      `;

      return conversations;
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