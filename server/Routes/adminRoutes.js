import express from "express";
import { getAdminStats } from "../Controllers/adminController.js";
import { protect, adminOnly } from "../Middleware/authAdmin.js";

const router = express.Router();

router.get("/stats", protect, adminOnly, getAdminStats);

export default router;
