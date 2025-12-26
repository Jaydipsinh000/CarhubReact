import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

/* ======================
   TOKEN INTERCEPTOR
====================== */
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

// Get all cars (admin)
export const getCars = () => API.get("/cars");

// Add new car
export const addCar = (data) => API.post("/cars/add", data);

// Update car
export const updateCar = (id, data) =>
  API.put(`/cars/update/${id}`, data);

// Delete car
export const deleteCar = (id) =>
  API.delete(`/cars/delete/${id}`);

/* ======================
   ADMIN – DASHBOARD STATS
====================== */

export const getDashboardStats = () =>
  API.get("/admin/dashboard");

/* ======================
   ADMIN – USERS
====================== */

export const getUsers = () => API.get("/admin/users");
export const deleteUser = (id) =>
  API.delete(`/admin/users/${id}`);
