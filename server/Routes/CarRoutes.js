import express from "express";
import {
  addCar,
  deleteCar,
  getAllCars,
  getCarById,
  updateCar,
  getMyCars,
} from "../Controllers/carController.js";
import { protect, adminOnly } from "../Middleware/authAdmin.js";
import { sellerOnly } from "../Middleware/authSeller.js";
import fs from "fs";
import path from "path";
import upload from "../Middleware/uploadMiddleware.js";


const router = express.Router();

// Ensure uploads folder exists (legacy cleanup or for public assets)
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}


// PUBLIC ROUTES
router.get("/", getAllCars);

// ADMIN & SELLER ROUTES
router.get("/my-cars", protect, sellerOnly, getMyCars); // Moved up
router.post("/add", protect, sellerOnly, upload.array("images", 10), addCar);
router.put("/update/:id", protect, sellerOnly, upload.array("images", 10), updateCar);
router.delete("/delete/:id", protect, sellerOnly, deleteCar);

router.get("/:id", getCarById); // Specific ID route last



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
