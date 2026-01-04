import express from "express";
import { createBooking, getMyBookings } from "../Controllers/bookingController.js";
import authUser from "../Middleware/authUser.js";

const router = express.Router();

router.post("/book", authUser, createBooking);

router.get("/my", authUser, getMyBookings);


export default router;
