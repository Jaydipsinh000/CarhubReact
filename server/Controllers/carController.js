import Car from "../Models/Cars.js";

// =======================
// ADMIN ADD CAR
// =======================
export const addCar = async (req, res) => {
  try {
    let {
      name,
      brand,
      pricePerDay,
      fuelType,
      seats,
      transmission,
      images, // expecting array of image URLs
    } = req.body;

    // Ensure images is an array
    if (!images || !Array.isArray(images) || images.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one image is required",
      });
    }

    // Main image is the first in array
    const image = images[0];

    // Validation
    if (
      !name ||
      !brand ||
      pricePerDay === undefined ||
      !fuelType ||
      seats === undefined ||
      !transmission ||
      !image
    ) {
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
      image,   // main image
      images,  // array of all images
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
    let { images } = req.body;

    // If images provided, update main image as first one
    if (images && Array.isArray(images) && images.length > 0) {
      req.body.image = images[0];
    }

    const updatedCar = await Car.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

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
    const { id } = req.params;

    const deletedCar = await Car.findByIdAndDelete(id);

    if (!deletedCar) {
      return res.status(404).json({ message: "Car not found" });
    }

    res.status(200).json({ message: "Car deleted successfully" });
  } catch (error) {
    console.error("Delete Car Error:", error.message);
    res.status(500).json({ message: "Car delete failed" });
  }
};

// =======================
// GET ALL CARS (PUBLIC)
// =======================
export const getAllCars = async (req, res) => {
  try {
    const cars = await Car.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total: cars.length,
      cars,
    });
  } catch (error) {
    console.error("Get All Cars Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch cars",
    });
  }
};

// =======================
// GET SINGLE CAR BY ID
// =======================
export const getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({
        success: false,
        message: "Car not found",
      });
    }

    res.status(200).json({
      success: true,
      car,
    });
  } catch (error) {
    console.error("Get Car Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Invalid car ID or server error",
    });
  }
};
