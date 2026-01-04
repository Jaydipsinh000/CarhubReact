import api from "./api";

// GET ALL CARS
export const fetchCars = () => api.get("/cars");

// GET SINGLE CAR
export const fetchCarById = (id) => api.get(`/cars/${id}`);

export const checkAvailability = (data) =>
  api.post("/cars/check-availability", data);
