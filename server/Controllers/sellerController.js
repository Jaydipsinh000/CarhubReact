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
