import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

/* TOKEN */
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

/* ======================
   ADMIN – CARS
====================== */

export const getCars = () => API.get("/cars");

// ✅ ADD THIS
export const getCarById = (id) => API.get(`/cars/${id}`);

export const addCar = (data) =>
  API.post("/cars/add", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const updateCar = (id, data) =>
  API.put(`/cars/update/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });


export const deleteCar = (id) =>
  API.delete(`/cars/delete/${id}`);

export const getAdminStats = () => API.get("/admin/stats");



