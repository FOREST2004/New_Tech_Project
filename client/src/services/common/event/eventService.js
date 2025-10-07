import api from "../axios";

export const getMemberRegistrations = async () => {
  const res = await api.get('/event');
  return res.data;
};

export const getUpcomingEvents = async (page = 1, limit = 10) => {
  const res = await api.get(`/event/upcoming?page=${page}&limit=${limit}`);
  return res.data;
};

export const registerEvent = async (eventId) => {
  const res = await api.post(`/event/${eventId}/register`);
  return res.data;
};

export const cancelRegistration = async (eventId) => {
  const res = await api.delete(`/event/${eventId}/register`);
  return res.data;
};

