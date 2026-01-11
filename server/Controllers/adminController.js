import Car from "../Models/Cars.js";
import Booking from "../Models/Booking.js";
import User from "../Models/User.js";

export const getAdminStats = async (req, res) => {
  try {
    const totalCars = await Car.countDocuments();

    const unavailableCars = await Car.countDocuments({
      available: false,
    });

    const totalBookings = await Booking.countDocuments();

    const totalUsers = await User.countDocuments();

    // Recent 5 Bookings
    const recentBookings = await Booking.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("carId", "name brand images pricePerDay");

    // Monthly Bookings (Last 6 Months)
    const monthlyBookings = await Booking.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(new Date().setMonth(new Date().getMonth() - 6)),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 },
          revenue: { $sum: "$amount" },
        },
      },
      { $sort: { "_id": 1 } },
    ]);

    // Format monthly data for frontend (e.g., "Jan", "Feb")
    const formattedMonthly = monthlyBookings.map(item => {
      const date = new Date();
      date.setMonth(item._id - 1);
      return {
        name: date.toLocaleString('default', { month: 'short' }),
        bookings: item.count,
        revenue: item.revenue || 0
      };
    });

    res.json({
      totalCars,
      unavailableCars,
      totalBookings,
      totalUsers,
      recentBookings,
      monthlyStats: formattedMonthly
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch admin stats" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Prevent deleting other admins (optional safeguard)
    if (user.role === 'admin') {
      return res.status(400).json({ message: "Cannot delete Admin accounts" });
    }

    await user.deleteOne();
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete user" });
  }
};

export const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    await booking.deleteOne();
    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete booking" });
  }
};
