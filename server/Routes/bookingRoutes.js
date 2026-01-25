import express from "express";
import { createBooking, getMyBookings, getSellerBookings, updateBookingStatus, settlePayment } from "../Controllers/bookingController.js";
import authUser from "../Middleware/authUser.js";

import { sellerOnly } from "../Middleware/authSeller.js";

import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure uploads folder exists
if (!fs.existsSync("uploads")) fs.mkdirSync("uploads");

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname).toLowerCase();
        cb(null, uniqueName);
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith("image/")) {
            cb(new Error("Only image files allowed"));
        }
        cb(null, true);
    },
});

const router = express.Router();

router.post(
    "/book",
    authUser,
    upload.fields([
        { name: "licenseFront", maxCount: 1 },
        { name: "licenseBack", maxCount: 1 },
        { name: "idProof", maxCount: 1 },
    ]),
    createBooking
);

router.get("/my", authUser, getMyBookings);

router.get("/seller-bookings", authUser, sellerOnly, getSellerBookings);

// Lifecycle Routes
router.patch("/status/:id", authUser, sellerOnly, updateBookingStatus);
router.post("/pay/:id", authUser, settlePayment);

export default router;
