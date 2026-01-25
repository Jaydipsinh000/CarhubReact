import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../Models/User.js";

// Generate OTP
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// =======================
// REGISTER USER
// =======================
// =======================
// REGISTER USER
// =======================
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, phone, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields required" });
    }

    let user = await User.findOne({ email });
    const otp = generateOtp();

    if (user) {
      if (user.isVerified) {
        return res.status(400).json({ success: false, message: "User already exists" });
      }
      // User exists but not verified (e.g. previous email failed). Update and resend.
      const hashedPassword = await bcrypt.hash(password, 10);
      user.name = name;
      user.phone = phone;
      user.password = hashedPassword;
      user.otp = otp;
      user.otpExpires = Date.now() + 10 * 60 * 1000;
      await user.save();

      req.otpData = { email, otp, type: "resend" };
      return next();
    }

    // New User
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if file uploaded (for Seller Verification)
    const documentImage = req.file ? req.file.path : null;

    // Determine Status
    let sellerStatus = "approved"; // Default for users (irrelevent)
    if (role === "seller") {
      // If doc is uploaded, we go to pending. If no doc (should be required on frontend), still pending.
      sellerStatus = "pending";
    }

    const newUser = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      otp,
      otpExpires: Date.now() + 10 * 60 * 1000,
      isVerified: role === "seller" ? true : false, // Sellers auto-verify email (bypass broken mail)
      role: role === "seller" ? "seller" : "user",
      sellerVerificationStatus: sellerStatus,
      documentImage: documentImage, // Save path
      documentStatus: documentImage ? "uploaded" : "not_uploaded"
    });

    // IF SELLER -> BYPASS EMAIL OTP
    if (role === "seller") {
      return res.status(201).json({
        success: true,
        message: "Application Submitted! Admin will verify your documents.",
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          sellerVerificationStatus: newUser.sellerVerificationStatus,
        },
      });
    }

    // Set OTP data for middleware (FOR USERS)
    req.otpData = { email, otp, type: "register" };

    // Call next middleware (sendOtpMail)
    next();
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ success: false, message: "Registration failed", error: error.message });
  }
};

// =======================
// VERIFY OTP
// =======================
// =======================
// VERIFY OTP (AUTO LOGIN)
// =======================
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email & OTP required",
      });
    }

    const user = await User.findOne({ email });

    if (
      !user ||
      user.otp !== otp ||
      !user.otpExpires ||
      user.otpExpires < Date.now()
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    // ✅ VERIFY USER
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    // ✅ GENERATE TOKEN
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // ✅ SEND USER + TOKEN
    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Verify OTP Error:", error);
    res.status(500).json({
      success: false,
      message: "OTP verification failed",
    });
  }
};


// =======================
// LOGIN USER
// =======================
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: "Email and password are required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ success: false, message: "User not found" });
    if (!user.isVerified) return res.status(400).json({ success: false, message: "Email not verified" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ success: false, message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        sellerVerificationStatus: user.sellerVerificationStatus,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ success: false, message: "Login failed" });
  }
};
// =======================
// GOOGLE LOGIN (UPSERT)
// =======================
export const googleLogin = async (req, res) => {
  try {
    const { name, email, googleId, photo, role } = req.body; // Accept role (optional)

    // 1. Check if user exists
    let user = await User.findOne({ email });

    if (user) {
      // If user exists, ensure googleId is set (link account)
      if (!user.googleId) {
        user.googleId = googleId;
        user.isVerified = true;
        await user.save();
      }
    } else {
      // 2. If user doesn't exist, create new user
      const randomPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(randomPassword, 10);

      // Determine Role & Status
      // If role passed is 'seller', create as pending seller. Default is 'user'.
      const assignedRole = role === "seller" ? "seller" : "user";
      const sellerStatus = role === "seller" ? "pending" : "approved";

      user = await User.create({
        name,
        email,
        password: hashedPassword,
        googleId,
        isVerified: true, // Google emails are verified
        role: assignedRole,
        sellerVerificationStatus: sellerStatus,
        documentStatus: role === "seller" ? "not_uploaded" : undefined
      });
    }

    // 3. Generate Token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    // 4. Return Response
    // If seller is pending, they might be restricted, but they can login.
    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        sellerVerificationStatus: user.sellerVerificationStatus,
        photo: photo
      }
    });

  } catch (error) {
    console.error("Google Login Error:", error);
    res.status(500).json({ success: false, message: "Google Login failed" });
  }
};

// =======================
// FORGOT PASSWORD
// =======================
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Generate OTP
    const otp = generateOtp();
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 mins
    await user.save();

    // Pass to mailer middleware
    req.otpData = { email, otp, type: "reset" };
    next();
  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// =======================
// RESET PASSWORD
// =======================
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user || user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Update Password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    // Clear OTP
    user.otp = undefined;
    user.otpExpires = undefined;

    await user.save();

    res.status(200).json({ success: true, message: "Password reset successfully. Please login." });

  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ message: "Failed to reset password" });
  }
};

