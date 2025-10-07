import api from "../axios";


export const loginUser = async (email, password) => {
  const response = await api.post("/auth/login", {
    email,
    password
  });
  return response.data;
};


export const sendResetCode = async (email) => {
  const response = await api.post("/auth/forgot-password", {
    email
  });
  return response.data;
};


export const resetPassword = async (email, code, newPassword) => {
  const response = await api.post("/auth/reset-password", {
    email,
    code,
    newPassword
  });
  return response.data;
};


export const handleLoginSuccess = (userData) => {
  localStorage.setItem("token", userData.token);
  localStorage.setItem("role", userData.user.role.toLowerCase());
  localStorage.setItem("currentUser", JSON.stringify(userData.user));
  

  if (userData.user.role === "ADMIN") {
    window.location.href = "/admin";
  } else if (userData.user.role === "MEMBER") {
    window.location.href = "/member";
  }
};


export const handleApiError = (error) => {
  console.error("API error:", error);
  
  if (error.response?.data?.message) {
    return error.response.data.message;
  } else {
    return "Đã xảy ra lỗi. Vui lòng thử lại.";
  }
};