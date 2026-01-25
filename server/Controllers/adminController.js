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

// ==========================
// GET PENDING SELLERS
// ==========================
export const getPendingSellers = async (req, res) => {
  try {
    const pendingSellers = await User.find({ role: "seller", sellerVerificationStatus: "pending" })
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, sellers: pendingSellers });
  } catch (error) {
    console.error("Get Pending Sellers Error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch pending sellers" });
  }
};

// ==========================
// VERIFY SELLER (APPROVE / REJECT)
// ==========================
export const verifySeller = async (req, res) => {
  try {
    const { sellerId, status } = req.body; // status: "approved" or "rejected"

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const seller = await User.findById(sellerId);
    if (!seller || seller.role !== "seller") {
      return res.status(404).json({ success: false, message: "Seller not found" });
    }

    seller.sellerVerificationStatus = status;
    await seller.save();

    res.status(200).json({ success: true, message: `Seller ${status} successfully` });
  } catch (error) {
    console.error("Verify Seller Error:", error);
    res.status(500).json({ success: false, message: "Failed to update verification status" });
  }
};

// ==========================
// GET SYSTEM REPORTS (Charts Data)
// ==========================
export const getSystemReports = async (req, res) => {
  try {
    const { range } = req.query; // '1m', '6m', '1y'
    let months = 6;
    if (range === '1m') months = 1;
    if (range === '1y') months = 12;

    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

    // 1. REVENUE & EXPENSES AGGREGATION
    const revenueStats = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          paymentStatus: { $in: ['paid', 'partial'] } // Consider mostly paid/verified bookings
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          revenue: { $sum: "$amount" },
          bookings: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    // 2. USER GROWTH AGGREGATION
    const userStats = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          users: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    // 3. MERGE DATA
    // We need to generate a continuous list of months
    const mergedData = [];
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    for (let i = 0; i < months; i++) {
      const d = new Date();
      d.setMonth(d.getMonth() - (months - 1 - i));
      const key = d.toISOString().slice(0, 7); // YYYY-MM
      const monthLabel = monthNames[d.getMonth()];

      const revData = revenueStats.find(r => r._id === key) || { revenue: 0, bookings: 0 };
      const userData = userStats.find(u => u._id === key) || { users: 0 };

      // Simulating Expenses (e.g., 60% of revenue for maintenance/partner payout)
      const estimatedExpenses = Math.round(revData.revenue * 0.6);

      mergedData.push({
        name: monthLabel,
        revenue: revData.revenue,
        expenses: estimatedExpenses,
        users: userData.users,
        active: Math.round(userData.users * 0.7) // Roughly 70% active
      });
    }

    // 4. KPI TOTALS
    const totalRevenue = mergedData.reduce((acc, curr) => acc + curr.revenue, 0);
    const totalUsers = mergedData.reduce((acc, curr) => acc + curr.users, 0);
    const totalBookings = revenueStats.reduce((acc, curr) => acc + curr.bookings, 0);

    res.json({
      success: true,
      chartData: mergedData,
      kpi: {
        revenue: totalRevenue,
        users: totalUsers,
        bookings: totalBookings
      }
    });

  } catch (error) {
    console.error("Report Stats Error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch reports" });
  }
};
