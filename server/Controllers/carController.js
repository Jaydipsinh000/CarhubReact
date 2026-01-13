import mongoose from "mongoose";
import Car from "../Models/Cars.js";

// =======================
// ADMIN ADD CAR
// =======================
export const addCar = async (req, res) => {
  try {
    const { name, brand, pricePerDay, fuelType, seats, transmission, listingType, reservationFee } = req.body;

    const images = req.files?.map((file) => `/uploads/${file.filename}`.replace(/\\/g, "/"));

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
      listingType: listingType || "Rent",
      reservationFee: reservationFee ? Number(reservationFee) : 0,
      images,
      bookings: [],
      createdBy: req.user._id, // 🔹 Associate with logged-in user
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
      req.body.images = req.files.map((file) => `/uploads/${file.filename}`.replace(/\\/g, "/"));
    }

    // 🔹 Ownership Check for Sellers
    const car = await Car.findById(id);
    if (!car) return res.status(404).json({ message: "Car not found" });

    if (req.user.role !== "admin" && car.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this car" });
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
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    // 🔹 Ownership Check
    if (req.user.role !== "admin" && car.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this car" });
    }

    // 🔹 Delete images from storage
    if (car.images && car.images.length > 0) {
      const fs = await import("fs");
      const path = await import("path");

      car.images.forEach(imagePath => {
        // imagePath is like "/uploads/filename.jpg"
        const filename = imagePath.split("/").pop(); // filename.jpg
        const filePath = path.join(process.cwd(), "uploads", filename);

        fs.unlink(filePath, (err) => {
          if (err) {
            console.error(`Failed to delete file: ${filePath}`, err);
          } else {
            console.log(`Deleted file: ${filePath}`);
          }
        });
      });
    }

    await car.deleteOne();
    res.status(200).json({ message: "Car and associated images deleted successfully" });
  } catch (error) {
    console.error("Delete Car Error:", error);
    res.status(500).json({ message: "Car delete failed" });
  }
};

// =======================
// GET ALL CARS
// =======================
export const getAllCars = async (req, res) => {
  const cars = await Car.find()
    .populate("createdBy", "name email")
    .sort({ createdAt: -1 });
  res.json({ success: true, cars });
};

// =======================
// GET SINGLE CAR
// =======================
export const getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }
    res.json({ success: true, car });
  } catch (error) {
    res.status(500).json({ message: "Error fetching car details" });
  }
};

// =======================
// GET MY CARS (SELLER)
// =======================
export const getMyCars = async (req, res) => {
  try {
    const cars = await Car.find({ createdBy: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, cars });
  } catch (error) {
    console.error("Get My Cars Error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch cars" });
  }
};
