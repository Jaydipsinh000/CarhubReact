import api from "./api";

export const createOrder = (data) => api.post("/payments/order", data);

export const verifyPayment = (data) => api.post("/payments/verify", data);

//My booking
export const getMyBookings = () => api.get("/bookings/my");

export const settlePayment = (id, amount) => api.post(`/bookings/pay/${id}`, { amount });
