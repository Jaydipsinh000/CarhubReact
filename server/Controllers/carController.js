import mongoose from "mongoose";
import Car from "../Models/Cars.js";
import Booking from "../Models/Booking.js";

// =======================
// ADMIN ADD CAR
// =======================
export const addCar = async (req, res) => {
  console.log("--> Add Car: Request Received");
  try {


    const { name, brand, pricePerDay, fuelType, seats, transmission, listingType, reservationFee, features, lat, lng, address } = req.body;
    console.log("Add Car Body:", req.body);
    console.log("Add Car Files:", req.files);
    // Cloudinary returns file.path as the full secure URL
    const imagePaths = req.files.map((file) => file.path);

    if (!imagePaths || imagePaths.length === 0) {
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

    const newCar = new Car({
      createdBy: req.user._id, // Owner
      name,
      brand,
      pricePerDay,
      fuelType,
      seats,
      transmission,
      listingType: listingType || "Rent",
      reservationFee: listingType === "Sell" ? (reservationFee ? Number(reservationFee) : 0) : 0,
      images: imagePaths, // All Images
      features: features ? features.split(",") : [], // If sent as CSV
      location: {
        lat: lat ? parseFloat(lat) : null,
        lng: lng ? parseFloat(lng) : null,
        address: address || ""
      },
      bookings: [],
      history: "Clean", // Default
    });

    await newCar.save();

    res.status(201).json({
      success: true,
      message: "Car added successfully",
      car: newCar,
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
  console.log("--> Update Car: Request Received");
  try {
    const { id } = req.params;
    console.log("Update Car ID:", id);
    console.log("Update Car Body:", req.body);
    console.log("Update Car Files:", req.files);

    if (req.files && req.files.length > 0) {
      req.body.images = req.files.map((file) => file.path);
    }

    // Handle Location Update
    const { lat, lng, address } = req.body;
    if (lat || lng || address) {
      req.body.location = {
        lat: lat ? parseFloat(lat) : null,
        lng: lng ? parseFloat(lng) : null,
        address: address || ""
      };
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

    // 🔹 Delete images from Cloudinary
    if (car.images && car.images.length > 0) {
      const { v2: cloudinary } = await import("cloudinary");

      // Initialize cloudinary
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      });

      for (const imagePath of car.images) {
        try {
          // Extract public_id from Cloudinary URL
          // Example: https://res.cloudinary.com/cloudname/image/upload/v12345/carent_uploads/filename.jpg
          const parts = imagePath.split("/");
          const fileNameWithExt = parts.pop();
          const folder = parts.pop();
          const publicId = `${folder}/${fileNameWithExt.split(".")[0]}`;

          await cloudinary.uploader.destroy(publicId);
          console.log(`Deleted from Cloudinary: ${publicId}`);
        } catch (err) {
          console.error(`Failed to delete Cloudinary image: ${imagePath}`, err);
        }
      }
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

// =======================
// GET ALL CARS (with Filters)
// =======================
export const getAllCars = async (req, res) => {
  try {
    const { startDate, endDate, minPrice, maxPrice, brand, fuelType } = req.query;

    let query = {};

    // 1. Basic Filters
    if (brand && brand !== "All") query.brand = brand;
    if (fuelType && fuelType !== "All") query.fuelType = fuelType;
    if (minPrice || maxPrice) {
      query.pricePerDay = {};
      if (minPrice) query.pricePerDay.$gte = Number(minPrice);
      if (maxPrice) query.pricePerDay.$lte = Number(maxPrice);
    }

    // 2. Date Availability Filter
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      // Find bookings that overlap with the requested range
      // Overlap logic: (StartA <= EndB) and (EndA >= StartB)
      const conflictingBookings = await Booking.find({
        status: { $in: ["confirmed", "active"] },
        $or: [
          { startDate: { $lte: end }, endDate: { $gte: start } }
        ]
      }).select("carId");

      const bookedCarIds = conflictingBookings.map(b => b.carId);

      // Exclude these cars
      if (bookedCarIds.length > 0) {
        query._id = { $nin: bookedCarIds };
      }
    }

    const cars = await Car.find(query)
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.json({ success: true, cars });
  } catch (error) {
    console.error("Get All Cars Error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch cars" });
  }
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
