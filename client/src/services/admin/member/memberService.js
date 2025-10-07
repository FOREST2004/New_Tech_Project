import api from "../../common/axios";


export const createMember = async (memberData) => {
  const res = await api.post("/admin/members/create", memberData);
  return res.data;
};


export const getMembers = async (params = {}) => {
  const queryParams = new URLSearchParams();
  
  
  Object.keys(params).forEach(key => {
    if (params[key] !== "" && params[key] !== null && params[key] !== undefined) {
      queryParams.append(key, params[key]);
    }
  });
  
  const res = await api.get(`/admin/members/list?${queryParams.toString()}`);
  return res.data;
};


export const getMemberById = async (id) => {
  const res = await api.get(`/admin/members/${id}`);
  return res.data;
};


export const MemberLock = async (id) => {
  const res = await api.put(`/admin/members/${id}/lock`);
  return res.data;
};


export const MemberUnlock = async (id) => {
  const res = await api.put(`/admin/members/${id}/unlock`);
  return res.data;
};


export const resetMemberPassword = async (id) => {
  const res = await api.put(`/admin/members/${id}/reset-password`);
  return res.data;
};


