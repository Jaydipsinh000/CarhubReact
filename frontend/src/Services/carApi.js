import api from "./api";

// GET ALL CARS
export const fetchCars = () => api.get("/cars");

// GET SINGLE CAR
export const fetchCarById = (id) => api.get(`/cars/${id}`);
