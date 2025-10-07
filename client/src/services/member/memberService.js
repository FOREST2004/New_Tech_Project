import api from "../common/axios";

export const getMembers = async (params = {}) => {
  const { page = 1, limit = 10, email = '', fullName = '' } = params;
  
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(email && { email }),
    ...(fullName && { fullName })
  });
  
  const res = await api.get(`/member/members?${queryParams}`);
  return res.data;
};