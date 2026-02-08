import api from "./api";

export const toggleWishlist = (carId) => api.post("/wishlist/toggle", { carId });
export const getWishlist = () => api.get("/wishlist");
