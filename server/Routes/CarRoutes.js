import express from "express";
import {
  addCar,
  deleteCar,
  getAllCars,
  getCarById,
  updateCar,
} from "../Controllers/carController.js";
import { protect, adminOnly } from "../Middleware/authAdmin.js";
import multer from "multer";
import fs from "fs";
import Car from "../Models/Cars.js";
import path from "path";


const router = express.Router();

// Ensure uploads folder exists
if (!fs.existsSync("uploads")) fs.mkdirSync("uploads");

// Multer setup

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname).toLowerCase();
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      cb(new Error("Only image files allowed"));
    }
    cb(null, true);
  },
});


// PUBLIC ROUTES
router.get("/", getAllCars);
router.get("/:id", getCarById);

// ADMIN ROUTES
router.post("/add", protect, adminOnly, upload.array("images", 10), addCar);
router.put("/update/:id", protect, adminOnly, upload.array("images", 10), updateCar);
router.delete("/delete/:id", protect, adminOnly, deleteCar);



if (!fs.existsSync("temp")) fs.mkdirSync("temp");

const uploads = multer({ dest: "temp/" });

router.post(
  "/bulk",
  protect,
  adminOnly,
  uploads.single("file"),
  async (req, res) => {
    try {
      const filePath = req.file.path;
      const rawData = fs.readFileSync(filePath);
      const cars = JSON.parse(rawData);

      if (!Array.isArray(cars)) {
        return res.status(400).json({ message: "Invalid JSON format" });
      }

      await Car.insertMany(cars);

      fs.unlinkSync(filePath);

      res.json({
        success: true,
        message: `${cars.length} cars added successfully`,
      });
    } catch (err) {
      res.status(500).json({
        message: "Bulk upload failed",
        error: err.message,
      });
    }
  }
);



export default router;
