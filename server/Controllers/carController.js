import mongoose from "mongoose";
import Car from "../Models/Cars.js";

// =======================
// ADMIN ADD CAR
// =======================
export const addCar = async (req, res) => {
  try {
    const { name, brand, pricePerDay, fuelType, seats, transmission } = req.body;

    const images = req.files?.map((file) => `/uploads/${file.filename}`);

    if (!images || images.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one image is required",
      });
    }

    if (!name || !brand || !pricePerDay || !fuelType || !seats || !transmission) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const car = await Car.create({
      name,
      brand,
      pricePerDay,
      fuelType,
      seats,
      transmission,
      images,
      bookings: [],
    });

    res.status(201).json({
      success: true,
      message: "Car added successfully",
      car,
    });
  } catch (error) {
    console.error("Add Car Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while adding Car",
    });
  }
};

// =======================
// UPDATE CAR
// =======================
export const updateCar = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.files && req.files.length > 0) {
      req.body.images = req.files.map((file) => `/uploads/${file.filename}`);
    }

    const updatedCar = await Car.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedCar) {
      return res.status(404).json({ message: "Car not found" });
    }

    res.status(200).json({
      success: true,
      message: "Car updated successfully",
      car: updatedCar,
    });
  } catch (error) {
    console.error("Update Car Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Car update failed",
    });
  }
};


// =======================
// DELETE CAR
// =======================
export const deleteCar = async (req, res) => {
  try {
    const deletedCar = await Car.findByIdAndDelete(req.params.id);
    if (!deletedCar) {
      return res.status(404).json({ message: "Car not found" });
    }
    res.status(200).json({ message: "Car deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Car delete failed" });
  }
};

// =======================
// GET ALL CARS
// =======================
export const getAllCars = async (req, res) => {
  const cars = await Car.find().sort({ createdAt: -1 });
  res.json({ success: true, cars });
};

// =======================
// GET SINGLE CAR
// =======================
export const getCarById = async (req, res) => {
  const car = await Car.findById(req.params.id);
  if (!car) {
    return res.status(404).json({ message: "Car not found" });
  }
  res.json({ success: true, car });
};
