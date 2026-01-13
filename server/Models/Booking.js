import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    carId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Car",
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    fullName: String,
    phone: String,
    email: String,
    address: String,

    licenseNumber: String,
    licenseExpiry: String,

    emergencyName: String,
    emergencyPhone: String,

    startDate: Date,
    endDate: Date,

    amount: Number,

    paymentStatus: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },

    orderType: {
      type: String,
      enum: ["Rent", "Sale"],
      default: "Rent",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);
