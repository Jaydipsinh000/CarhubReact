import axios from "axios";

// Ensure http for localhost to avoid SSL errors/mismatches
let baseURL = import.meta.env.VITE_API_BASE_URL;
if (!baseURL || baseURL.includes("localhost")) {
  baseURL = baseURL ? baseURL.replace("https://", "http://") : "http://localhost:5000/api";
}

const api = axios.create({
  baseURL,
  withCredentials: true,
});

api.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default api;
