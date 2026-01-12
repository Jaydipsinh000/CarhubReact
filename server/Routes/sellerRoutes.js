import express from "express";
import { getSellerStats } from "../Controllers/sellerController.js";
import { protect } from "../Middleware/authAdmin.js";
import { sellerOnly } from "../Middleware/authSeller.js";

const router = express.Router();

router.get("/stats", protect, sellerOnly, getSellerStats);

export default router;
