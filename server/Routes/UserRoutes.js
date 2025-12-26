import express from "express";
import { loginUser, registerUser, verifyOtp } from "../Controllers/user.js";
import sendOtpMail from "../Middleware/sendOtpMail.js"; // import middleware

const router = express.Router();

// Register a new user and send OTP
router.post("/register", registerUser, sendOtpMail); // add sendOtpMail as middleware

// Verify OTP
router.post("/verify-otp", verifyOtp);

// Login
router.post("/login", loginUser);


export default router;
