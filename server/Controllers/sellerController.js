import Car from "../Models/Cars.js";
import Booking from "../Models/Booking.js";

export const getSellerStats = async (req, res) => {
    try {
        const sellerId = req.user._id;

        // 1. Get all cars created by this seller
        const sellerCars = await Car.find({ createdBy: sellerId });
        const carIds = sellerCars.map(car => car._id);

        // 2. Counts
        const totalCars = sellerCars.length;

        // 3. Find bookings associated with these cars
        const bookings = await Booking.find({ carId: { $in: carIds } })
            .populate("carId", "name brand images")
            .sort({ createdAt: -1 });

        const totalBookings = bookings.length;
        const totalEarnings = bookings.reduce((acc, curr) => acc + (curr.amount || 0), 0);

        // 4. Recent activity (top 5)
        const recentBookings = bookings.slice(0, 5).map(b => ({
            id: b._id,
            user: b.fullName || "User",
            car: b.carId?.name || "Deleted Car",
            status: b.paymentStatus === "paid" ? "Active" : "Upcoming", // Simplified status logic
            date: new Date(b.startDate).toLocaleDateString(),
            amount: b.amount || 0
        }));

        // 5. Chart Data (Last 7 Days)
        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            last7Days.push({
                name: date.toLocaleDateString("en-US", { weekday: "short" }),
                date: date.toISOString().split("T")[0],
                bookings: 0,
                earnings: 0
            });
        }

        bookings.forEach(b => {
            const bDate = new Date(b.createdAt).toISOString().split("T")[0];
            const chartItem = last7Days.find(d => d.date === bDate);
            if (chartItem) {
                chartItem.bookings += 1;
                chartItem.earnings += (b.amount || 0);
            }
        });

        res.json({
            success: true,
            totalCars,
            totalBookings,
            totalEarnings,
            recentBookings,
            chartData: last7Days
        });

    } catch (error) {
        console.error("Seller Stats Error:", error);
        res.status(500).json({ success: false, message: "Failed to fetch seller stats" });
    }
};

// ==========================
// GET SELLER REPORTS
// ==========================
export const getSellerReports = async (req, res) => {
    try {
        const sellerId = req.user._id;
        const { range } = req.query; // '1m', '6m', '1y'
        let months = 6;
        if (range === '1m') months = 1;
        if (range === '1y') months = 12;

        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - months);

        // 1. Get Seller's Cars
        const sellerCars = await Car.find({ createdBy: sellerId }).select('_id');
        const carIds = sellerCars.map(car => car._id);

        if (carIds.length === 0) {
            return res.json({
                success: true,
                chartData: [],
                kpi: { revenue: 0, bookings: 0, cars: 0 }
            });
        }

        // 2. REVENUE AGGREGATION
        const revenueStats = await Booking.aggregate([
            {
                $match: {
                    carId: { $in: carIds },
                    createdAt: { $gte: startDate },
                    paymentStatus: { $in: ['paid', 'partial', 'pending'] } // Include pending for now as logic might vary, usually paid
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

        // 3. MERGE DATA
        const mergedData = [];
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        for (let i = 0; i < months; i++) {
            const d = new Date();
            d.setMonth(d.getMonth() - (months - 1 - i));
            const key = d.toISOString().slice(0, 7); // YYYY-MM
            const monthLabel = monthNames[d.getMonth()];

            const revData = revenueStats.find(r => r._id === key) || { revenue: 0, bookings: 0 };

            // Simulating Platform Fees (e.g. 10%)
            const platformFees = Math.round(revData.revenue * 0.1);

            mergedData.push({
                name: monthLabel,
                revenue: revData.revenue,
                expenses: platformFees, // "Expenses" here = Platform Fees
                bookings: revData.bookings,
                netIncome: revData.revenue - platformFees
            });
        }

        // 4. KPI TOTALS for the period
        const totalRevenue = mergedData.reduce((acc, curr) => acc + curr.revenue, 0);
        const totalBookings = mergedData.reduce((acc, curr) => acc + curr.bookings, 0);

        res.json({
            success: true,
            chartData: mergedData,
            kpi: {
                revenue: totalRevenue,
                bookings: totalBookings,
                cars: carIds.length
            }
        });

    } catch (error) {
        console.error("Seller Reports Error:", error);
        res.status(500).json({ success: false, message: "Failed to fetch seller reports" });
    }
};
