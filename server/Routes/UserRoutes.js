import express from "express";
import sendOtpMail from "../middleware/sendOtpMail.js";
import { registerUser, verifyOtp, loginUser } from "../Controllers/user.js";

const router = express.Router();

// REGISTER
router.post(
  "/register",
  registerUser,
  sendOtpMail,
  (req, res) => {
    res.status(201).json({
      success: true,
      message: "User registered. OTP sent to email.",
    });
  }
);

// VERIFY OTP
router.post("/verify-otp", verifyOtp);

// LOGIN
router.post("/login", loginUser);

export default router;
