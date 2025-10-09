import { PrismaClient } from '@prisma/client';
import VectorEmbeddingService from './vectorEmbeddingService.js';

const prisma = new PrismaClient();

class ContextService {
  constructor() {
    this.prisma = prisma;
    this.vectorService = new VectorEmbeddingService();
    this.keywordMappings = {
      // Event related keywords
      'event': ['events', 'sự kiện', 'hoạt động', 'chương trình'],
      'registration': ['đăng ký', 'tham gia', 'registration'],
      'user': ['người dùng', 'thành viên', 'user', 'member'],
      'organization': ['tổ chức', 'công ty', 'organization'],
      'notification': ['thông báo', 'notification'],
      'message': ['tin nhắn', 'message', 'chat'],
      'attendance': ['tham dự', 'có mặt', 'attendance'],
      'status': ['trạng thái', 'status', 'tình trạng']
    };
  }

  // Analyze user query to determine what data to retrieve
  analyzeQuery(query) {
    const lowerQuery = query.toLowerCase();
    
    const analysis = {
      needsEvents: false,
      needsUsers: false,
      needsRegistrations: false,
      needsNotifications: false,
      needsMessages: false,
      needsOrganization: false,
      isStatistical: false,
      isComparative: false,
      isTimeBasedQuery: false,
      isInstructional: false,
      queryType: 'general', // general, statistical, comparative, trend, specific, instructional
      timeframe: null,
      keywords: [],
      intent: null, // count, list, compare, trend, detail, get_statistics, get_instructions
      entities: [] // specific entities mentioned
    };

    // Enhanced statistical keywords
    const statisticalKeywords = [
      'thống kê', 'statistics', 'số lượng', 'count', 'bao nhiêu', 'how many',
      'tổng cộng', 'total', 'phần trăm', 'percent', 'tỷ lệ', 'rate',
      'có', 'đang có', 'hiện có', 'trung bình', 'average', 'cao nhất', 'thấp nhất',
      'nhiều nhất', 'ít nhất', 'max', 'min', 'sum'
    ];

    // Comparative keywords
    const comparativeKeywords = [
      'so sánh', 'compare', 'nhiều nhất', 'most', 'ít nhất', 'least',
      'cao nhất', 'highest', 'thấp nhất', 'lowest', 'tốt nhất', 'best',
      'khác nhau', 'difference', 'vs', 'versus', 'hơn', 'kém', 'tốt hơn',
      'xấu hơn', 'nhiều hơn', 'ít hơn'
    ];

    // Time-based keywords
    const timeKeywords = [
      'hôm nay', 'today', 'ngày mai', 'tomorrow', 'tuần này', 'this week',
      'tháng này', 'this month', 'năm nay', 'this year', 'sắp tới', 'upcoming',
      'đã qua', 'past', 'trước đây', 'previous', 'gần đây', 'recent',
      'trong', 'từ', 'đến', 'before', 'after', 'since'
    ];

    // Instructional keywords
    const instructionalKeywords = [
      'làm sao', 'làm thế nào', 'how to', 'cách', 'hướng dẫn', 'guide',
      'tạo', 'create', 'xóa', 'delete', 'sửa', 'edit', 'update'
    ];

    // Entity keywords
    const entityKeywords = {
      'cybersecurity': ['cybersecurity', 'an toàn', 'bảo mật', 'security', 'hack'],
      'ai_ml': ['ai', 'machine learning', 'ml', 'trí tuệ', 'học máy', 'artificial'],
      'blockchain': ['blockchain', 'web3', 'crypto', 'bitcoin', 'ethereum'],
      'web_dev': ['web', 'frontend', 'backend', 'javascript', 'react', 'node'],
      'mobile': ['mobile', 'android', 'ios', 'app', 'ứng dụng'],
      'devops': ['devops', 'docker', 'kubernetes', 'ci/cd', 'deployment']
    };

    // Event-related keywords with more variations
    if (this.containsKeywords(lowerQuery, [
      'sự kiện', 'event', 'hội thảo', 'workshop', 'conference', 'seminar',
      'buổi học', 'khóa học', 'training', 'meetup', 'hackathon'
    ])) {
      analysis.needsEvents = true;
      analysis.keywords.push('events');
    }

    // User-related keywords with roles
    if (this.containsKeywords(lowerQuery, [
      'người dùng', 'user', 'thành viên', 'member', 'admin', 'quản trị',
      'sinh viên', 'student', 'giảng viên', 'teacher', 'người tham gia'
    ])) {
      analysis.needsUsers = true;
      analysis.keywords.push('users');
    }

    // Registration-related keywords
    if (this.containsKeywords(lowerQuery, [
      'đăng ký', 'registration', 'tham gia', 'attend', 'checkin',
      'có mặt', 'attendance', 'vắng mặt', 'absent'
    ])) {
      analysis.needsRegistrations = true;
      analysis.keywords.push('registrations');
    }

    // Notification-related keywords
    if (this.containsKeywords(lowerQuery, [
      'thông báo', 'notification', 'tin nhắn', 'message', 'nhắc nhở',
      'reminder', 'cảnh báo', 'alert'
    ])) {
      analysis.needsNotifications = true;
      analysis.keywords.push('notifications');
    }

    // Check for message-related queries
    if (this.containsKeywords(lowerQuery, this.keywordMappings.message)) {
      analysis.needsMessages = true;
      analysis.keywords.push('messages');
    }

    // Check for organization-related queries
    if (this.containsKeywords(lowerQuery, this.keywordMappings.organization)) {
      analysis.needsOrganization = true;
      analysis.keywords.push('organization');
    }

    // Statistical intent detection with enhanced keywords
    if (this.containsKeywords(lowerQuery, statisticalKeywords)) {
      analysis.isStatistical = true;
      analysis.queryType = 'statistical';
      analysis.intent = 'get_statistics';
      analysis.keywords.push('statistics');
    }

    // Comparative intent detection with enhanced keywords
    if (this.containsKeywords(lowerQuery, comparativeKeywords)) {
      analysis.isComparative = true;
      analysis.queryType = 'comparative';
      analysis.intent = 'compare_data';
      analysis.keywords.push('comparison');
    }

    // Time-based queries with enhanced keywords
    if (this.containsKeywords(lowerQuery, timeKeywords)) {
      analysis.isTimeBasedQuery = true;
      analysis.queryType = 'trend';
    }

    // Instructional queries detection
    if (this.containsKeywords(lowerQuery, instructionalKeywords)) {
      analysis.isInstructional = true;
      analysis.queryType = 'instructional';
      analysis.intent = 'get_instructions';
    }

    // List intent detection
    if (this.containsKeywords(lowerQuery, [
      'danh sách', 'list', 'hiển thị', 'show', 'liệt kê', 'enumerate',
      'tất cả', 'all', 'các', 'những'
    ])) {
      analysis.intent = 'list';
      analysis.queryType = 'specific';
    }

    // Enhanced entity detection
    Object.keys(entityKeywords).forEach(entity => {
      if (this.containsKeywords(lowerQuery, entityKeywords[entity])) {
        analysis.entities.push(entity);
      }
    });

    // Enhanced timeframe extraction
    if (lowerQuery.includes('hôm nay') || lowerQuery.includes('today')) analysis.timeframe = 'today';
    else if (lowerQuery.includes('tuần') || lowerQuery.includes('week')) analysis.timeframe = 'week';
    else if (lowerQuery.includes('tháng') || lowerQuery.includes('month')) analysis.timeframe = 'month';
    else if (lowerQuery.includes('năm') || lowerQuery.includes('year')) analysis.timeframe = 'year';
    else if (lowerQuery.includes('sắp tới') || lowerQuery.includes('upcoming')) analysis.timeframe = 'upcoming';
    else if (lowerQuery.includes('gần đây') || lowerQuery.includes('recent')) analysis.timeframe = 'recent';

    // Enhanced intent determination
    if (analysis.needsEvents && analysis.timeframe === 'upcoming') {
      analysis.intent = 'find_upcoming_events';
    } else if (analysis.needsEvents) {
      analysis.intent = 'find_events';
    } else if (analysis.needsUsers) {
      analysis.intent = 'find_users';
    }

    return analysis;
  }

  containsKeywords(text, keywords) {
    return keywords.some(keyword => text.includes(keyword));
  }

  // Retrieve relevant data based on analysis
  async getRelevantContext(query, organizationId = null, limit = 10) {
    const analysis = this.analyzeQuery(query);
    const context = {
      events: [],
      users: [],
      registrations: [],
      notifications: [],
      messages: [],
      organization: null,
      summary: ''
    };

    try {
      // Get organization info if needed
      if (analysis.needsOrganization && organizationId) {
        context.organization = await prisma.organization.findUnique({
          where: { id: organizationId },
          include: {
            _count: {
              select: {
                events: true,
                users: true
              }
            }
          }
        });
      }

      // Get events if needed
      if (analysis.needsEvents) {
        const whereClause = organizationId ? { organizationId } : {};
        context.events = await prisma.event.findMany({
          where: whereClause,
          include: {
            createdBy: {
              select: { fullName: true, email: true }
            },
            organization: {
              select: { name: true }
            },
            _count: {
              select: {
                registrations: true,
                attachments: true
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: limit
        });
      }

      // Get users if needed
      if (analysis.needsUsers) {
        const whereClause = organizationId ? { organizationId } : {};
        context.users = await prisma.user.findMany({
          where: whereClause,
          select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
            isActive: true,
            createdAt: true,
            _count: {
              select: {
                createdEvents: true,
                registrations: true
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: limit
        });
      }

      // Get registrations if needed
      if (analysis.needsRegistrations) {
        const whereClause = organizationId ? { event: { organizationId } } : {};
        context.registrations = await prisma.registration.findMany({
          where: whereClause,
          include: {
            event: {
              select: { title: true, startAt: true, status: true }
            },
            user: {
              select: { fullName: true, email: true }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: limit
        });
      }

      // Get notifications if needed
      if (analysis.needsNotifications) {
        context.notifications = await prisma.notification.findMany({
          include: {
            recipient: {
              select: { fullName: true, email: true }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: limit
        });
      }

      // Get messages if needed
      if (analysis.needsMessages) {
        context.messages = await prisma.message.findMany({
          include: {
            sender: {
              select: { fullName: true, email: true }
            },
            receiver: {
              select: { fullName: true, email: true }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: limit
        });
      }

      // Add statistical insights based on query type
      if (analysis.isStatistical || analysis.isComparative) {
        context.statistics = await this.getStatisticalInsights(organizationId, analysis);
      }

      // Add trend analysis for time-based queries
      if (analysis.isTimeBasedQuery) {
        context.trends = await this.getTrendAnalysis(organizationId, analysis);
      }

      // Add entity-specific data
      if (analysis.entities.length > 0) {
        context.entityData = await this.getEntitySpecificData(organizationId, analysis.entities);
      }

      // Generate summary
      context.summary = this.generateContextSummary(context, analysis);

      const hasRelevantData = Object.keys(context).filter(key => key !== 'summary' && context[key] && 
        (Array.isArray(context[key]) ? context[key].length > 0 : true)).length > 0;
      
      return {
        hasRelevantData,
        hasContext: hasRelevantData, // For compatibility
        context,
        analysis,
        insights: this.generateInsights(context, analysis),
        suggestions: this.generateSuggestions(context, analysis)
      };
    } catch (error) {
      console.error('Error retrieving context:', error);
      return {
        hasRelevantData: false,
        hasContext: false, // For compatibility
        context: { summary: 'Không thể lấy dữ liệu từ hệ thống.' },
        analysis,
        error: error.message
      };
    }
  }

  generateContextSummary(context, analysis) {
    const summaryParts = [];

    if (context.organization) {
      summaryParts.push(`Organization: ${context.organization.name} (${context.organization._count.events} events, ${context.organization._count.users} users)`);
    }

    if (context.events.length > 0) {
      summaryParts.push(`Found ${context.events.length} events`);
    }

    if (context.users.length > 0) {
      summaryParts.push(`Found ${context.users.length} users`);
    }

    if (context.registrations.length > 0) {
      summaryParts.push(`Found ${context.registrations.length} registrations`);
    }

    if (context.notifications.length > 0) {
      summaryParts.push(`Found ${context.notifications.length} notifications`);
    }

    if (context.messages.length > 0) {
      summaryParts.push(`Found ${context.messages.length} messages`);
    }

    return summaryParts.join('. ');
  }

  // Format context for AI prompt
  formatContextForAI(context) {
    let formattedContext = "Dữ liệu hệ thống hiện tại:\n\n";

    if (context.organization) {
      formattedContext += `Tổ chức: ${context.organization.name}\n`;
      formattedContext += `- Số sự kiện: ${context.organization._count.events}\n`;
      formattedContext += `- Số thành viên: ${context.organization._count.users}\n\n`;
    }

    if (context.events.length > 0) {
      formattedContext += "Sự kiện:\n";
      context.events.forEach(event => {
        formattedContext += `- ${event.title} (${event.status})\n`;
        formattedContext += `  Mô tả: ${event.description || 'Không có mô tả'}\n`;
        formattedContext += `  Địa điểm: ${event.location || 'Chưa xác định'}\n`;
        formattedContext += `  Thời gian: ${event.startAt ? new Date(event.startAt).toLocaleString('vi-VN') : 'Chưa xác định'}\n`;
        formattedContext += `  Người tạo: ${event.createdBy.fullName || event.createdBy.email}\n`;
        formattedContext += `  Số người đăng ký: ${event._count.registrations}\n\n`;
      });
    }

    if (context.users.length > 0) {
      formattedContext += "Người dùng:\n";
      context.users.forEach(user => {
        formattedContext += `- ${user.fullName || user.email} (${user.role})\n`;
        formattedContext += `  Trạng thái: ${user.isActive ? 'Hoạt động' : 'Không hoạt động'}\n`;
        formattedContext += `  Số sự kiện đã tạo: ${user._count.createdEvents}\n`;
        formattedContext += `  Số sự kiện đã đăng ký: ${user._count.registrations}\n\n`;
      });
    }

    if (context.registrations.length > 0) {
      formattedContext += "Đăng ký sự kiện:\n";
      context.registrations.forEach(reg => {
        formattedContext += `- ${reg.user.fullName || reg.user.email} đăng ký "${reg.event.title}"\n`;
        formattedContext += `  Trạng thái: ${reg.status}\n`;
        formattedContext += `  Tham dự: ${reg.attendance ? 'Có' : 'Chưa'}\n`;
        formattedContext += `  Đã đóng cọc: ${reg.depositPaid ? 'Có' : 'Chưa'}\n\n`;
      });
    }

    if (context.notifications.length > 0) {
      formattedContext += "Thông báo gần đây:\n";
      context.notifications.forEach(notif => {
        formattedContext += `- ${notif.title}: ${notif.message}\n`;
        formattedContext += `  Loại: ${notif.type}\n`;
        formattedContext += `  Đã đọc: ${notif.isRead ? 'Có' : 'Chưa'}\n\n`;
      });
    }

    // Add statistical insights if available
    if (context.statistics) {
      formattedContext += this.formatStatistics(context.statistics);
    }

    // Add trend analysis if available
    if (context.trends) {
      formattedContext += this.formatTrends(context.trends);
    }

    return formattedContext;
  }

  // Statistical analysis methods
  async getStatisticalInsights(organizationId = null, analysis) {
    const insights = {};

    try {
      // Event statistics
      if (analysis.needsEvents) {
        const eventStats = await prisma.event.groupBy({
          by: ['status'],
          where: organizationId ? { organizationId } : {},
          _count: { id: true }
        });

        const totalEvents = await prisma.event.count({
          where: organizationId ? { organizationId } : {}
        });

        insights.events = {
          total: totalEvents,
          byStatus: eventStats,
          avgAttendeesPerEvent: await this.getAverageAttendees(organizationId)
        };
      }

      // User statistics
      if (analysis.needsUsers) {
        const userStats = await prisma.user.groupBy({
          by: ['role'],
          where: organizationId ? { organizationId } : {},
          _count: { id: true }
        });

        insights.users = {
          total: await prisma.user.count({
            where: organizationId ? { organizationId } : {}
          }),
          byRole: userStats,
          activeUsers: await this.getActiveUsersCount(organizationId)
        };
      }

      // Registration statistics
      if (analysis.needsRegistrations) {
        const regStats = await prisma.registration.groupBy({
          by: ['status'],
          _count: { id: true },
          where: organizationId ? {
            event: { organizationId }
          } : {}
        });

        insights.registrations = {
          total: await prisma.registration.count({
            where: organizationId ? {
              event: { organizationId }
            } : {}
          }),
          byStatus: regStats,
          attendanceRate: await this.getAttendanceRate(organizationId)
        };
      }

      return insights;
    } catch (error) {
      console.error('Error getting statistical insights:', error);
      return {};
    }
  }

  async getTrendAnalysis(organizationId = null, analysis) {
    const trends = {};

    try {
      // Event trends over time
      if (analysis.needsEvents) {
        const recentEvents = await prisma.event.findMany({
          where: {
            ...(organizationId && { organizationId }),
            startAt: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
            }
          },
          orderBy: { startAt: 'desc' },
          take: 10
        });

        trends.recentEvents = recentEvents;
        trends.upcomingEvents = await prisma.event.findMany({
          where: {
            ...(organizationId && { organizationId }),
            startAt: {
              gte: new Date()
            }
          },
          orderBy: { startAt: 'asc' },
          take: 5
        });
      }

      return trends;
    } catch (error) {
      console.error('Error getting trend analysis:', error);
      return {};
    }
  }

  async getEntitySpecificData(organizationId = null, entities) {
    const entityData = {};

    try {
      for (const entity of entities) {
        switch (entity) {
          case 'cybersecurity':
            entityData.cybersecurity = await prisma.event.findMany({
              where: {
                ...(organizationId && { organizationId }),
                OR: [
                  { title: { contains: 'an toàn', mode: 'insensitive' } },
                  { title: { contains: 'bảo mật', mode: 'insensitive' } },
                  { title: { contains: 'security', mode: 'insensitive' } },
                  { description: { contains: 'cybersecurity', mode: 'insensitive' } }
                ]
              },
              include: {
                registrations: true,
                createdBy: { select: { fullName: true } }
              }
            });
            break;

          case 'ai_ml':
            entityData.ai_ml = await prisma.event.findMany({
              where: {
                ...(organizationId && { organizationId }),
                OR: [
                  { title: { contains: 'AI', mode: 'insensitive' } },
                  { title: { contains: 'Machine Learning', mode: 'insensitive' } },
                  { title: { contains: 'trí tuệ nhân tạo', mode: 'insensitive' } },
                  { description: { contains: 'machine learning', mode: 'insensitive' } }
                ]
              },
              include: {
                registrations: true,
                createdBy: { select: { fullName: true } }
              }
            });
            break;

          case 'blockchain':
            entityData.blockchain = await prisma.event.findMany({
              where: {
                ...(organizationId && { organizationId }),
                OR: [
                  { title: { contains: 'blockchain', mode: 'insensitive' } },
                  { title: { contains: 'web3', mode: 'insensitive' } },
                  { description: { contains: 'smart contract', mode: 'insensitive' } }
                ]
              },
              include: {
                registrations: true,
                createdBy: { select: { fullName: true } }
              }
            });
            break;
        }
      }

      return entityData;
    } catch (error) {
      console.error('Error getting entity-specific data:', error);
      return {};
    }
  }

  async getAverageAttendees(organizationId = null) {
    try {
      const result = await prisma.event.aggregate({
        where: organizationId ? { organizationId } : {},
        _avg: { maxAttendees: true }
      });
      return Math.round(result._avg.maxAttendees || 0);
    } catch (error) {
      return 0;
    }
  }

  async getActiveUsersCount(organizationId = null) {
    try {
      // Users who have registered for events in the last 30 days
      const activeUsers = await prisma.user.count({
        where: {
          ...(organizationId && { organizationId }),
          registrations: {
            some: {
              createdAt: {
                gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
              }
            }
          }
        }
      });
      return activeUsers;
    } catch (error) {
      return 0;
    }
  }

  async getAttendanceRate(organizationId = null) {
    try {
      const totalRegistrations = await prisma.registration.count({
        where: organizationId ? {
          event: { organizationId }
        } : {}
      });

      const attendedRegistrations = await prisma.registration.count({
        where: {
          ...(organizationId ? { event: { organizationId } } : {}),
          attendance: true
        }
      });

      return totalRegistrations > 0 ? 
        Math.round((attendedRegistrations / totalRegistrations) * 100) : 0;
    } catch (error) {
      return 0;
    }
  }

  formatStatistics(statistics) {
    let formatted = '\n=== THỐNG KÊ ===\n';
    
    if (statistics.events) {
      formatted += `Sự kiện:\n`;
      formatted += `- Tổng số: ${statistics.events.total}\n`;
      formatted += `- Trung bình số người tham gia: ${statistics.events.avgAttendeesPerEvent}\n`;
      statistics.events.byStatus.forEach(stat => {
        formatted += `- ${stat.status}: ${stat._count.id} sự kiện\n`;
      });
    }

    if (statistics.users) {
      formatted += `\nNgười dùng:\n`;
      formatted += `- Tổng số: ${statistics.users.total}\n`;
      formatted += `- Người dùng hoạt động: ${statistics.users.activeUsers}\n`;
      statistics.users.byRole.forEach(stat => {
        formatted += `- ${stat.role}: ${stat._count.id} người\n`;
      });
    }

    if (statistics.registrations) {
      formatted += `\nĐăng ký:\n`;
      formatted += `- Tổng số: ${statistics.registrations.total}\n`;
      formatted += `- Tỷ lệ tham dự: ${statistics.registrations.attendanceRate}%\n`;
      statistics.registrations.byStatus.forEach(stat => {
        formatted += `- ${stat.status}: ${stat._count.id} đăng ký\n`;
      });
    }

    return formatted + '\n';
  }

  formatTrends(trends) {
    let formatted = '\n=== XU HƯỚNG ===\n';
    
    if (trends.recentEvents && trends.recentEvents.length > 0) {
      formatted += `Sự kiện gần đây (${trends.recentEvents.length}):\n`;
      trends.recentEvents.forEach(event => {
        formatted += `- ${event.title} (${new Date(event.startAt).toLocaleDateString('vi-VN')})\n`;
      });
    }

    if (trends.upcomingEvents && trends.upcomingEvents.length > 0) {
      formatted += `\nSự kiện sắp tới (${trends.upcomingEvents.length}):\n`;
      trends.upcomingEvents.forEach(event => {
        formatted += `- ${event.title} (${new Date(event.startAt).toLocaleDateString('vi-VN')})\n`;
      });
    }

    return formatted + '\n';
  }

  generateInsights(context, analysis) {
    const insights = [];

    // Generate insights based on data patterns
    if (context.events && context.events.length > 0) {
      const activeEvents = context.events.filter(e => e.status === 'ACTIVE').length;
      const completedEvents = context.events.filter(e => e.status === 'COMPLETED').length;
      
      if (activeEvents > completedEvents) {
        insights.push('Có nhiều sự kiện đang hoạt động, cho thấy tổ chức rất năng động.');
      }
    }

    if (context.statistics) {
      if (context.statistics.registrations && context.statistics.registrations.attendanceRate > 80) {
        insights.push('Tỷ lệ tham dự cao cho thấy sự kiện được tổ chức hiệu quả.');
      }
      
      if (context.statistics.users && context.statistics.users.activeUsers > context.statistics.users.total * 0.7) {
        insights.push('Cộng đồng rất tích cực với tỷ lệ người dùng hoạt động cao.');
      }
    }

    return insights;
  }

  generateSuggestions(context, analysis) {
    const suggestions = [];

    // Generate actionable suggestions
    if (analysis.queryType === 'statistical') {
      suggestions.push('Bạn có thể hỏi về xu hướng theo thời gian hoặc so sánh giữa các loại sự kiện.');
    }

    if (analysis.needsEvents && context.events && context.events.length > 0) {
      suggestions.push('Thử hỏi về sự kiện cụ thể hoặc thống kê đăng ký.');
    }

    if (analysis.entities.length > 0) {
      suggestions.push('Có thể tìm hiểu thêm về các chủ đề liên quan như AI, blockchain, hoặc cybersecurity.');
    }

    return suggestions;
  }

  // Semantic search using vector embeddings
  async semanticSearch(query, organizationId = null, options = {}) {
    const {
      limit = 10,
      threshold = 0.1,
      includeEvents = true,
      includeUsers = true,
      includeMessages = true
    } = options;

    const results = [];

    try {
      // Get all relevant documents for semantic search
      const documents = [];

      if (includeEvents) {
        const events = await this.prisma.event.findMany({
          where: organizationId ? { organizationId } : {},
          include: {
            registrations: {
              select: { id: true }
            }
          }
        });

        events.forEach(event => {
          documents.push({
            type: 'event',
            id: event.id,
            title: event.title,
            description: event.description,
            content: `${event.title} ${event.description} ${event.location || ''}`,
            data: event,
            createdAt: event.createdAt
          });
        });
      }

      if (includeUsers) {
        const users = await this.prisma.user.findMany({
          where: organizationId ? { organizationId } : {},
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true
          }
        });

        users.forEach(user => {
          documents.push({
            type: 'user',
            id: user.id,
            title: user.name,
            description: `${user.role} user`,
            content: `${user.name} ${user.email} ${user.role}`,
            data: user,
            createdAt: user.createdAt
          });
        });
      }

      if (includeMessages) {
        const messages = await this.prisma.message.findMany({
          where: organizationId ? { organizationId } : {},
          take: 100, // Limit messages for performance
          orderBy: { createdAt: 'desc' }
        });

        messages.forEach(message => {
          documents.push({
            type: 'message',
            id: message.id,
            title: `Message from ${message.senderName || 'User'}`,
            description: message.content?.substring(0, 100) || '',
            content: message.content || '',
            data: message,
            createdAt: message.createdAt
          });
        });
      }

      // Perform semantic search
      const analysis = this.analyzeQuery(query);
      const searchOptions = {
        threshold,
        maxResults: limit,
        entities: analysis.entities,
        keywords: analysis.keywords,
        entityBoost: 1.5,
        keywordBoost: 1.2
      };

      const semanticResults = this.vectorService.semanticSearch(query, documents, searchOptions);

      // Calculate enhanced relevance scores
      semanticResults.forEach(result => {
        const relevanceScore = this.vectorService.calculateRelevanceScore(
          query, 
          result.document, 
          analysis
        );
        
        results.push({
          ...result,
          relevanceScore,
          type: result.document.type,
          data: result.document.data
        });
      });

      return {
        results: results.sort((a, b) => b.relevanceScore - a.relevanceScore),
        totalFound: results.length,
        query,
        analysis
      };

    } catch (error) {
      console.error('Semantic search error:', error);
      return {
        results: [],
        totalFound: 0,
        query,
        error: error.message
      };
    }
  }

  // Enhanced context retrieval with semantic search
  async getEnhancedContext(query, organizationId = null, options = {}) {
    const { useSemanticSearch = true, limit = 10 } = options;

    // Get traditional context
    const traditionalContext = await this.getRelevantContext(query, organizationId, limit);

    if (!useSemanticSearch) {
      return traditionalContext;
    }

    // Get semantic search results
    const semanticResults = await this.semanticSearch(query, organizationId, { limit });

    // Merge and deduplicate results
    const mergedContext = { ...traditionalContext };
    const existingEventIds = new Set(traditionalContext.events?.map(e => e.id) || []);
    const existingUserIds = new Set(traditionalContext.users?.map(u => u.id) || []);

    // Add semantic results that aren't already included
    semanticResults.results.forEach(result => {
      if (result.type === 'event' && !existingEventIds.has(result.data.id)) {
        mergedContext.events = mergedContext.events || [];
        mergedContext.events.push(result.data);
      } else if (result.type === 'user' && !existingUserIds.has(result.data.id)) {
        mergedContext.users = mergedContext.users || [];
        mergedContext.users.push(result.data);
      }
    });

    // Update context metadata
    mergedContext.hasContext = (mergedContext.events?.length > 0) || 
                              (mergedContext.users?.length > 0) || 
                              (mergedContext.messages?.length > 0);
    
    mergedContext.semanticEnhanced = true;
    mergedContext.semanticResults = semanticResults.results.slice(0, 5); // Top 5 for reference

    return mergedContext;
  }

  // Generate query suggestions using semantic analysis
  generateSemanticSuggestions(query, context) {
    const suggestions = this.generateSuggestions(context, this.analyzeQuery(query));
    
    // Add semantic-based suggestions
    if (context.semanticResults && context.semanticResults.length > 0) {
      const topResult = context.semanticResults[0];
      
      if (topResult.type === 'event') {
        suggestions.push(`Tìm hiểu thêm về sự kiện "${topResult.data.title}"`);
      }
      
      // Generate expansion suggestions
      const expansionTerms = this.vectorService.generateQueryExpansion(
        query, 
        context.semanticResults.map(r => r.document)
      );
      
      if (expansionTerms.length > 0) {
        suggestions.push(`Thử tìm kiếm với từ khóa: ${expansionTerms.slice(0, 3).join(', ')}`);
      }
    }

    return suggestions;
  }
}

export default ContextService;