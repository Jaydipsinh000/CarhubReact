import express from "express";
import { addReview, getCarReviews, deleteReview } from "../Controllers/reviewController.js";
import { protect, adminOnly as admin } from "../Middleware/authAdmin.js";

const router = express.Router();

router.post("/add", protect, addReview);
router.get("/:carId", getCarReviews);
router.delete("/:id", protect, deleteReview);

export default router;
