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
app.use(
  cors({
    origin: "http://localhost:5173", // Vite default port
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// Database
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
