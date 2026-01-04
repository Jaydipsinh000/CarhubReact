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
