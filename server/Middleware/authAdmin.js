import jwt from "jsonwebtoken";
import User from "../Models/User.js";

/**
 * 🔐 Protect Routes (Login Required)
 */
export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // ❌ No token
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authorization token missing",
      });
    }

    // ✅ Extract token
    const token = authHeader.split(" ")[1];

    // ❌ Invalid token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    // ❌ User not found
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User no longer exists",
      });
    }

    // ✅ Attach user to request
    req.user = user;
    next();
  } catch (error) {
    console.error("Auth Error:", error);
    res.status(500).json({
      success: false,
      message: "Server authentication error",
    });
  }
};

/**
 * 🛡️ Admin Only Access
 */
export const adminOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Not authenticated",
    });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Admin access only",
    });
  }

  next();
};
