import axios from "axios";

let baseURL = import.meta.env.VITE_API_BASE_URL;

// Detect environment
const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

if (isLocal) {
  // Force HTTP for local dev to avoid SSL issues
  if (!baseURL || baseURL.includes("localhost")) {
    baseURL = baseURL ? baseURL.replace("https://", "http://") : "http://localhost:5000/api";
  }
} else {
  // LIVE ENVIRONMENT (Vercel)
  // If env is missing or points to localhost, fallback to Render Live URL
  if (!baseURL || baseURL.includes("localhost")) {
    baseURL = "https://carent-qdwb.onrender.com/api";
  }
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
