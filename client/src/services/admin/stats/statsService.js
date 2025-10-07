import api from "../../common/axios";

export const statsService = {
  async getDashboardStats() {
    try {
      const response = await api.get("/admin/stats/dashboard");
      return response.data;
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      throw error;
    }
  },
};
