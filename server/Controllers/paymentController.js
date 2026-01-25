import crypto from "crypto";
import razorpay from "../Config/razorpay.js";
import Booking from "../Models/Booking.js";

export const createOrder = async (req, res) => {
  try {
    console.log("PAYMENT BODY:", req.body); // check amount & bookingId
    const { amount, bookingId } = req.body;

    if (!amount || !bookingId)
      return res.status(400).json({ message: "Amount or bookingId missing" });

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: bookingId,
    });

    console.log("ORDER CREATED:", order);
    res.json(order);
  } catch (err) {
    console.error("RAZORPAY ERROR:", err); // backend console log
    res.status(500).json({ message: "Order creation failed", error: err.message });
  }
};



export const verifyPayment = async (req, res) => {
  try {
    const { bookingId, paymentId, orderId, signature } = req.body;

    const body = orderId + "|" + paymentId;
    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expected !== signature)
      return res.status(400).json({ message: "Invalid signature" });

    // 1. Fetch the order from Razorpay to know the actual paid amount
    const order = await razorpay.orders.fetch(orderId);
    if (!order) return res.status(400).json({ message: "Order not found" });

    const paidNow = order.amount / 100; // Razorpay returns amount in paisa

    // 2. Update Booking
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    booking.paidAmount = (booking.paidAmount || 0) + paidNow;

    // Check if fully paid (allow small margin for float errors)
    if (booking.paidAmount >= booking.amount - 1) {
      booking.paymentStatus = "paid";
    } else {
      booking.paymentStatus = "partial";
    }

    await booking.save();

    res.json({ success: true, paymentStatus: booking.paymentStatus });
  } catch (err) {
    console.error("VERIFY ERROR:", err);
    res.status(500).json({ message: "Payment verification failed" });
  }
};
