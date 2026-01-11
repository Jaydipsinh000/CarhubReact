import express from "express";
import { createBooking, getMyBookings, getSellerBookings } from "../Controllers/bookingController.js";
import authUser from "../Middleware/authUser.js";

import { sellerOnly } from "../Middleware/authSeller.js";

const router = express.Router();

router.post("/book", authUser, createBooking);

router.get("/my", authUser, getMyBookings);

router.get("/seller-bookings", authUser, sellerOnly, getSellerBookings);

export default router;
