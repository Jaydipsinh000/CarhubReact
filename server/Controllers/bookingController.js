import Booking from "../Models/Booking.js";
import Car from "../Models/Cars.js";
export const createBooking = async (req, res) => {
  try {
    const {
      carId,
      startDate,
      endDate,
      amount,
      fullName,
      phone,
      email,
      address,
      licenseNumber,
      licenseExpiry,
      emergencyName,
      emergencyPhone,
    } = req.body;

    if (!carId || !startDate || !endDate)
      return res.status(400).json({ message: "Missing booking details" });

    // Verify user exists from middleware
    if (!req.user || !req.user._id) {
      console.error("Booking Error: User not found in request");
      return res.status(401).json({ message: "User not authenticated" });
    }

    const booking = await Booking.create({
      carId,
      user: req.user._id, // User is attached by authUser middleware
      startDate,
      endDate,
      amount,
      fullName,
      phone,
      email,
      address,
      licenseNumber,
      licenseExpiry,
      emergencyName,
      emergencyPhone,
    });

    console.log("Booking Created:", booking._id);

    // Block dates immediately
    await Car.findByIdAndUpdate(carId, {
      $push: {
        bookings: {
          startDate,
          endDate,
          bookingId: booking._id,
        },
      },
    });

    res.status(201).json({ booking });
  } catch (err) {
    console.error("Booking Creation Error:", err);
    res.status(500).json({ message: "Booking failed", error: err.message });
  }
};

export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate("carId") // Correctly populate carId
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
};

// =======================
// GET SELLER BOOKINGS
// =======================
export const getSellerBookings = async (req, res) => {
  try {
    // 1. Find all cars created by this seller
    const cars = await Car.find({ createdBy: req.user._id });
    const carIds = cars.map((car) => car._id);

    // 2. Find bookings for these cars
    const bookings = await Booking.find({ carId: { $in: carIds } })
      .populate("carId", "name brand image pricePerDay images")
      .populate("user", "name email phone")
      .sort({ createdAt: -1 });

    res.json({ success: true, bookings });
  } catch (error) {
    console.error("Get Seller Bookings Error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch bookings" });
  }
};
