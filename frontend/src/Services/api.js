// src/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://carent-dgkk.onrender.com/api" || "http://localhost:5000/api", // change to your backend URL
});

export default api;
