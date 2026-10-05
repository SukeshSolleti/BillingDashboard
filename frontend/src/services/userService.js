import axios from "axios";

const API_URL = "http://localhost:5000/api/users";

const register = async (userData) => {
  const response = await axios.post(`${API_URL}/register`, userData);
  return response.data;
};

const login = async (userData) => {
  const response = await axios.post(`${API_URL}/login`, userData);
  return response.data;
};

const forgotPassword = async (email) => {
  return await axios.post(`${API_URL}/forgot-password`, { email });
};
const resetPassword = async (token, password) => {
  return await axios.post(`${API_URL}/reset-password`, { token, password });
};

const verifyToken = async (token) => {
  try {
    const response = await axios.post(`${API_URL}/verify-token`, { token });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Token verification failed"
    );
  }
};

const userService = {
  register,
  login,
  forgotPassword,
  resetPassword,
  verifyToken,
};

export default userService;
