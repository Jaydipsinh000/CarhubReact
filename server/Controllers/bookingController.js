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

    const booking = await Booking.create({
      carId,
      user: req.user._id || req.user.id, // Ensure user ID is saved
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
    console.error(err);
    res.status(500).json({ message: "Booking failed" });
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
