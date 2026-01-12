import api from "./api";

export const getSellerStats = () => api.get("/seller/stats");
export const getSellerCars = () => api.get("/cars/my-cars");
export const getSellerBookings = () => api.get("/bookings/seller-bookings");
