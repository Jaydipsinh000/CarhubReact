import express from "express";
import {
  createOrder,
  verifyPayment,
} from "../Controllers/paymentController.js";
import { protect } from "../Middleware/authAdmin.js";

const router = express.Router();

router.post("/order", protect,createOrder);
router.post("/verify",protect,verifyPayment);

export default router;
