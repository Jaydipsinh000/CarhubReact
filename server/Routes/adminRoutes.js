import express from "express";
import User from "../Models/User.js";
import Booking from "../Models/Booking.js";
import { getAdminStats, deleteUser, deleteBooking } from "../Controllers/adminController.js";
import { protect, adminOnly } from "../Middleware/authAdmin.js";

const router = express.Router();

/**
 * ======================
 * ADMIN DASHBOARD STATS
 * ======================
 */
router.get("/stats", protect, adminOnly, getAdminStats);

// DELETE ACTIONS
router.delete("/users/:id", protect, adminOnly, deleteUser);
router.delete("/bookings/:id", protect, adminOnly, deleteBooking);

/**
 * ======================
 * GET ALL USERS (ADMIN)
 * ======================
 */
router.get("/users", protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("Admin users error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
});

/**
 * ======================
 * GET ALL BOOKINGS (ADMIN)
 * ======================
 */
router.get("/bookings", protect, adminOnly, async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email image")
      .populate({
        path: "carId",
        select: "name brand pricePerDay images",
        populate: { path: "createdBy", select: "name email" } // Seller Info
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      bookings,
    });
  } catch (error) {
    console.error("Admin bookings error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch bookings",
    });
  }
});

/**
 * ======================
 * GET ALL PAYMENTS (ADMIN)
 * Payments are derived from bookings
 * ======================
 */
router.get("/payments", protect, adminOnly, async (req, res) => {
  try {
    const payments = await Booking.find()
      .populate("user", "name email")
      .populate({
        path: "carId",
        select: "name brand",
        populate: { path: "createdBy", select: "name email" }
      })
      .select("user carId amount paymentStatus createdAt")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      payments,
    });
  } catch (error) {
    console.error("Admin payments error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch payments",
    });
  }
});

export default router;
