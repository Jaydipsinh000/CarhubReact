import axios from "axios";

const API_URL = "http://localhost:5000/api/user";

export const registerUser = (userData) => {
  return axios.post(`${API_URL}/register`, userData, {
    headers: { "Content-Type": "application/json" },
  });
};

export const verifyOtp = (otpData) => {
  return axios.post(`${API_URL}/verify-otp`, otpData, {
    headers: { "Content-Type": "application/json" },
  });
};

export const loginUser = (loginData) => {
  return axios.post(`${API_URL}/login`, loginData, {
    headers: { "Content-Type": "application/json" },
  });
};
