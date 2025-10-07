import api from "../axios";

export const profileService = {
  getProfile: async () => {
    const res = await api.get(`/profile`);
    return res.data;
  },

  updateProfile: async (updatedData) => {
    const res = await api.put(`/profile`, updatedData);
    return res.data;
  },

  updatePassword: async (currentPassword, newPassword) => {
    const res = await api.put(`/profile/password`, {
      currentPassword,
      newPassword,
    });
    return res.data;
  }
};
