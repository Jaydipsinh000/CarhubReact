import express from "express";
import {
  addCar,
  deleteCar,
  getAllCars,
  getCarById,
  updateCar,
} from "../Controllers/carController.js";
import { protect,adminOnly } from "../Middleware/authAdmin.js";

const router = express.Router();

// PUBLIC ROUTES
router.get("/", getAllCars);
router.get("/:id", getCarById);

// ADMIN ROUTE
router.post("/add", protect, adminOnly, addCar);
router.put("/update/:id",protect,adminOnly,updateCar);
router.delete("/delete/:id",protect,adminOnly,deleteCar);

export default router;
