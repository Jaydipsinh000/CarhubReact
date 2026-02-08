import express from "express";
import { toggleWishlist, getWishlist } from "../Controllers/wishlistController.js";
import { protect } from "../Middleware/authAdmin.js";

const router = express.Router();

router.post("/toggle", protect, toggleWishlist);
router.get("/", protect, getWishlist);

export default router;
