import api from "./api";

// Add a review
export const addReview = (reviewData) => {
    return api.post("/reviews/add", reviewData);
};

// Get reviews for a car
export const getCarReviews = (carId) => {
    return api.get(`/reviews/${carId}`);
};

// Delete a review
export const deleteReview = (reviewId) => {
    return api.delete(`/reviews/${reviewId}`);
};
