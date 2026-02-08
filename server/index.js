import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./Config/db.js";
import userRoutes from "./Routes/UserRoutes.js";
import carRoutes from "./Routes/CarRoutes.js";
import path from "path";
import { fileURLToPath } from "url";
import bookingRoutes from "./Routes/bookingRoutes.js";
import paymentRoutes from "./Routes/paymentRoutes.js";
import adminRoutes from "./Routes/adminRoutes.js";
import sellerRoutes from "./Routes/sellerRoutes.js";
import reviewRoutes from "./Routes/reviewRoutes.js";
import wishlistRoutes from "./Routes/wishlistRoutes.js";



dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Serve uploads folder
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// ✅ Only Localhost allowed
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://carent-nu.vercel.app", // Verified Vercel URL
  process.env.FRONTEND_URL // Allow production frontend
].filter(Boolean);

// CORS
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// Middleware
app.use(express.json());

// DB
connectDB();

// Routes
app.get("/", (req, res) => {
  res.send("Server is running");
});

app.use("/api/user", userRoutes);
app.use("/api/cars", carRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/seller", sellerRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/wishlist", wishlistRoutes);

// Port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});
