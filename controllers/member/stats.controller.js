import * as MemberStatsService from '../../services/member/stats.service.js';

export const getMemberStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const stats = await MemberStatsService.getMemberStats(userId);
    
    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get member stats error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get member statistics'
    });
  }
};