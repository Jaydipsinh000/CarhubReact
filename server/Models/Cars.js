import mongoose from "mongoose";

const carSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    features: {
      type: [String],
    },
    location: {
      lat: { type: Number, required: false },
      lng: { type: Number, required: false },
      address: { type: String, required: false }
    },
    history: {
      type: String,
      required: true,
    },

    brand: {
      type: String,
      required: true,
    },

    pricePerDay: {
      type: Number,
      required: true,
    },

    fuelType: {
      type: String,
      enum: ["Petrol", "Diesel", "Electric", "Hybrid"],
      required: true,
    },

    seats: {
      type: Number,
      required: true,
    },

    transmission: {
      type: String,
      enum: ["Manual", "Automatic"],
      required: true,
    },

    images: {
      type: [String],
      required: true,
    },

    available: {
      type: Boolean,
      default: true,
    },

    listingType: {
      type: String,
      enum: ["Rent", "Sell"],
      default: "Rent",
    },

    reservationFee: {
      type: Number,
      default: 0
    },

    // ✅ NEW: BOOKINGS FOR DATE AVAILABILITY
    bookings: [
      {
        startDate: {
          type: Date,
          required: true,
        },
        endDate: {
          type: Date,
          required: true,
        },
        bookingId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Booking",
        },
      },
    ],

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Car || mongoose.model("Car", carSchema);
