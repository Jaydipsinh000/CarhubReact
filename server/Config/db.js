import mongoose from "mongoose";

const connectDB = async () => {
  try {
    console.log(process.env.DB);

    await mongoose.connect(process.env.DB);
    console.log("Database Connected Successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};

export default connectDB;
