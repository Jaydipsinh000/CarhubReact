import Car from "../Models/Cars.js";

// =======================
// ADMIN ADD CAR
// =======================
export const addCar = async (req, res) => {
  try {
    const {
      name,
      brand,
      pricePerDay,
      fuelType,
      seats,
      transmission,
      image,
    } = req.body;

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
      image,
    });

    res.status(201).json({
      success: true,
      message: "Car added successfully",
      car, // ✅ correct variable
    });
  } catch (error) {
    console.error("Add Car Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while adding Car",
    });
  }
};


// update cars
export const updateCar = async (req, res) => {
  try {
    const { id } = req.params;

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

//deleteCar
export const deleteCar = async (req,res)=>{
  try{
    const {id} = req.params;

    const deleteCar = await Car.findByIdAndDelete(id);

    if(!deleteCar){
      res.status(404).json({message:"Car not found.."});
    }

    res.status(201).json({message:"Car deleted successfully"});
  }
  catch(error){
    res.status(500).json({message:"Car delete failed.."});
  }
}

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
