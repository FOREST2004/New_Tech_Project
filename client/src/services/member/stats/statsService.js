import api from "../../common/axios";

export const getMemberStats = async () => {
  try {
    const response = await api.get("/member/stats/dashboard");
    return response.data.data;
  } catch (error) {
    console.error("Get member stats error:", error);
    throw error.response?.data || error;
  }
};
