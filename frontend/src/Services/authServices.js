import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/user",
  withCredentials: true, // required if using cookies
});

// Register user (step 1)
export const registerUser = (data) => API.post("/register", data);

// Verify OTP (step 2)
export const verifyOtp = (data) => API.post("/verify-otp", data);

// Login user
export const loginUser = (data) => API.post("/login", data);

export default API;
