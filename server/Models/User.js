import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    phone: {
      type: String,
    },

    role: {
      type: String,
      enum: ["user", "admin", "seller"],
      default: "user",
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    sellerVerificationStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "approved", // Default to approved for legacy users, but we will force "pending" for NEW sellers in registerUser
    },

    otp: {
      type: String,
    },

    otpExpires: {
      type: Date,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true, // allows null/undefined to not clash uniqueness
    },
    photo: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
