import * as memberService from '../../services/member/member.service.js';



export const getMembers = async (req, res) => {
  try {
    const organizationId = req.user.organizationId;
    const { page = 1, limit = 10, email = '', fullName = '' } = req.query;
    
    const result = await memberService.getMembersByOrganization(
      organizationId, 
      parseInt(page), 
      parseInt(limit),
      { email, fullName }
    );
    
    res.json(result);
  } catch (error) {
    console.error('Get members error:', error);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
};

