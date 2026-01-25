import api from "./api";

// Use the shared api instance which handles base URL logic
const API = api;

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

export const getPendingSellers = () => API.get("/admin/pending-sellers");

export const verifySeller = (sellerId, status) =>
  API.post("/admin/verify-seller", { sellerId, status });



