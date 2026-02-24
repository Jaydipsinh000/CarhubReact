import express from "express";
import { createBooking, getMyBookings, getSellerBookings, updateBookingStatus, settlePayment } from "../Controllers/bookingController.js";
import authUser from "../Middleware/authUser.js";

import { sellerOnly } from "../Middleware/authSeller.js";



const router = express.Router();

router.post(
    "/book",
    authUser,
    createBooking
);

router.get("/my", authUser, getMyBookings);

router.get("/seller-bookings", authUser, sellerOnly, getSellerBookings);

// Lifecycle Routes
router.patch("/status/:id", authUser, sellerOnly, updateBookingStatus);
router.post("/verify-handover/:id", authUser, sellerOnly, verifyHandover);
router.post("/pay/:id", authUser, settlePayment);

export default router;
