import jwt from "jsonwebtoken";
import User from "../Models/User.js";

/**
 * 🛡️ Seller Only Access
 */
export const sellerOnly = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: "Not authenticated",
        });
    }

    // Allow if role is seller OR admin (Admin oversees all)
    if (req.user.role !== "seller" && req.user.role !== "admin") {
        return res.status(403).json({
            success: false,
            message: "Seller access only",
        });
    }

    // Check verification status if it's a seller (Admins bypass this)
    if (req.user.role === "seller" && req.user.sellerVerificationStatus !== "approved") {
        return res.status(403).json({
            success: false,
            message: "Account Pending Admin Verification. Please wait for approval.",
        });
    }

    next();
};
