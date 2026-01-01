import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";
import { fetchCarById } from "../Services/carApi";

const BookCar = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // ================= STATES =================
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [showTerms, setShowTerms] = useState(false);
  const [agree, setAgree] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    licenseNumber: "",
    licenseExpiry: "",
    address: "",
    emergencyName: "",
    emergencyPhone: "",
  });

  // ================= FETCH CAR =================
  useEffect(() => {
    const loadCar = async () => {
      try {
        const res = await fetchCarById(id);
        setCar(res.data.car);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadCar();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <span className="animate-spin h-12 w-12 border-b-2 border-black rounded-full"></span>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="text-center mt-20 text-xl font-semibold text-red-600">
        Car data not available
      </div>
    );
  }

  // ================= DISABLED DATES =================
  const excludedRanges =
    car.bookings?.map((b) => ({
      start: new Date(b.startDate),
      end: new Date(b.endDate),
    })) || [];

  // ================= PRICE =================
  const totalDays =
    startDate && endDate
      ? Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1
      : 0;

  const totalPrice = totalDays * (car.pricePerDay || 0);

  // ================= VALIDATION =================
  const validateForm = () => {
    if (!startDate || !endDate) return "Select booking dates";
    if (!form.fullName || !form.phone || !form.email)
      return "Fill all required details";
    if (!form.licenseNumber || !form.licenseExpiry)
      return "License details required";
    if (!agree) return "Please accept Terms & Conditions";
    return null;
  };

  // ================= BOOKING =================
  const handleBooking = async () => {
    const error = validateForm();
    if (error) return alert(error);

    try {
      const bookingRes = await axios.post(
        "http://localhost:5000/api/bookings/book",
        {
          carId: car._id,
          ...form,
          startDate,
          endDate,
          amount: totalPrice,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }, // if auth required
        }
      );

      // Order
      const { data } = await axios.post(
        "http://localhost:5000/api/payments/order",
        {
          amount: totalPrice,
          bookingId: bookingRes.data.booking._id,
        }
      );

      // Verify
      await axios.post("http://localhost:5000/api/payments/verify", {
        bookingId: bookingRes.data.booking._id,
        paymentId: response.razorpay_payment_id,
        orderId: response.razorpay_order_id,
        signature: response.razorpay_signature,
      });

      const options = {
        key: "rzp_test_RwZIAWCoF3HLYf",
        amount: data.amount,
        currency: data.currency,
        name: "Carent",
        description: `Booking for ${car.name}`,
        order_id: data.id,
        handler: async (response) => {
          await axios.post("/api/payments/verify", {
            bookingId: bookingRes.data.booking._id,
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id,
            signature: response.razorpay_signature,
          });

          alert("🎉 Booking Successful");
          navigate("/my-bookings");
        },
        prefill: {
          name: form.fullName,
          email: form.email,
          contact: form.phone,
        },
        theme: { color: "#000000" },
      };

      new window.Razorpay(options).open();
    } catch (err) {
      console.error(err);
      alert("Booking failed");
    }
  };

  const inputClass =
    "w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-black outline-none";

  // ================= UI =================
  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-10">
        {/* LEFT */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl p-8 space-y-6">
          <h1 className="text-3xl font-bold">Book {car.name}</h1>

          <div className="grid sm:grid-cols-2 gap-4">
            <input
              className={inputClass}
              placeholder="Full Name"
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            />
            <input
              className={inputClass}
              placeholder="Phone"
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
            <input
              className={inputClass}
              placeholder="Email"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <input
              className={inputClass}
              placeholder="Address"
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
            <input
              className={inputClass}
              placeholder="License Number"
              onChange={(e) =>
                setForm({ ...form, licenseNumber: e.target.value })
              }
            />
            <input
              type="date"
              className={inputClass}
              onChange={(e) =>
                setForm({ ...form, licenseExpiry: e.target.value })
              }
            />
            <input
              className={inputClass}
              placeholder="Emergency Name"
              onChange={(e) =>
                setForm({ ...form, emergencyName: e.target.value })
              }
            />
            <input
              className={inputClass}
              placeholder="Emergency Phone"
              onChange={(e) =>
                setForm({ ...form, emergencyPhone: e.target.value })
              }
            />
          </div>

          {/* TERMS LINK */}
          <div className="text-sm text-gray-600">
            <span
              onClick={() => setShowTerms(!showTerms)}
              className="text-blue-600 cursor-pointer underline"
            >
              View Terms & Conditions
            </span>

            {showTerms && (
              <div className="mt-3 border rounded-xl p-4 bg-gray-50 text-gray-700 space-y-2">
                <p>• Any damage to the vehicle must be paid by the customer</p>
                <p>• Fuel level should be same at return</p>
                <p>• Traffic fines & penalties are customer responsibility</p>
                <p>• Late return may attract additional charges</p>
                <p>• Vehicle must not be used for illegal activities</p>
                <p>• Valid driving license is mandatory</p>
              </div>
            )}

            <div className="flex items-center gap-2 mt-3">
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
              />
              <span>I agree to the Terms & Conditions</span>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl shadow-xl p-6">
            <DatePicker
              selectsRange
              startDate={startDate}
              endDate={endDate}
              onChange={([s, e]) => {
                setStartDate(s);
                setEndDate(e);
              }}
              excludeDateIntervals={excludedRanges}
              minDate={new Date()}
              inline
            />
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-6">
            <p>₹{car.pricePerDay} / day</p>
            <p>Total Days: {totalDays}</p>
            <p className="font-bold text-lg">Total: ₹{totalPrice}</p>

            <button
              disabled={!agree}
              onClick={handleBooking}
              className={`w-full mt-4 py-4 rounded-xl font-semibold ${
                agree ? "bg-black text-white" : "bg-gray-300 text-gray-500"
              }`}
            >
              Confirm & Pay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCar;
