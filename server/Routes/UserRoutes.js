import express from "express";
import { loginUser, registerUser, verifyOtp, googleLogin, forgotPassword, resetPassword } from "../Controllers/user.js";
import sendOtpMail from "../Middleware/sendOtpMail.js"; // import middleware
import authUser from "../Middleware/authUser.js";

import upload from "../Middleware/uploadMiddleware.js";

const router = express.Router();

// Register a new user and send OTP
// Note: Changed to support file upload (multipart/form-data)
router.post("/register", upload.single("document"), registerUser, sendOtpMail);

// Verify OTP
router.post("/verify-otp", verifyOtp);

// Login
router.post("/login", loginUser);

// Google Login
// Google Login
router.post("/google", googleLogin);

// Forgot Password
router.post("/forgot-password", forgotPassword, sendOtpMail);

// Reset Password
router.post("/reset-password", resetPassword);

export default router;
