import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./Config/db.js";
import userRoutes from "./Routes/UserRoutes.js";
import carRoutes from "./Routes/CarRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Allowed origins
const allowedOrigins = [
  "http://localhost:5174",        // Vite dev
  "https://carent-nu.vercel.app" // Production
];

// CORS setup
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// Database connection
connectDB();

// Routes
app.get("/", (req, res) => {
  res.send("Server is running");
});

app.use("/api/user", userRoutes);
app.use("/api/cars", carRoutes);

// Port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port: http://localhost:${PORT}`);
});
