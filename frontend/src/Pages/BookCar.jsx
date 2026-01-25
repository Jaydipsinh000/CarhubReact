import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { fetchCarById } from "../Services/carApi";
import { createOrder, verifyPayment } from "../Services/paymentApi";
import { Calendar, CreditCard, ShieldCheck, MapPin, Phone, User, CheckCircle, AlertCircle, ArrowLeft } from "lucide-react";
import { getCarImage } from "../utils/imageUtils";
import Terms from "./Terms.jsx";

// Helper for premium inputs
const FormInput = ({ icon: Icon, label, ...props }) => (
  <div className="space-y-2">
    <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
      {Icon && <Icon size={16} className="text-blue-500" />} {label}
    </label>
    <div className="relative">
      <input
        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 pl-4 focus:ring-2 focus:ring-black/5 focus:border-black outline-none transition-all text-gray-900 placeholder:text-gray-400 font-medium"
        {...props}
      />
    </div>
  </div>
);

const BookCar = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  /* ================= STATES ================= */
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [showTerms, setShowTerms] = useState(false);
  const [agree, setAgree] = useState(false);
  const [paymentOption, setPaymentOption] = useState('full'); // full, partial, later

  // Form State
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

  /* ================= FETCH CAR ================= */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to continue booking");
      navigate("/login");
      return;
    }

    const loadCar = async () => {
      try {
        const res = await fetchCarById(id);
        setCar(res.data.car);
        // Pre-fill user data
        const user = JSON.parse(localStorage.getItem("user"));
        if (user) {
          setForm(prev => ({
            ...prev,
            fullName: user.name || "",
            email: user.email || "",
            phone: user.phone || ""
          }));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadCar();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin h-12 w-12 border-4 border-black border-t-transparent rounded-full mb-4" />
      </div>
    );
  }

  if (!car) return <div className="text-center p-10">Car not found</div>;

  /* ================= CALCULATIONS ================= */
  const excludedRanges =
    car.bookings?.map((b) => ({
      start: new Date(b.startDate),
      end: new Date(b.endDate),
    })) || [];

  const totalDays =
    startDate && endDate
      ? Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1
      : 0;

  const totalPrice = totalDays * car.pricePerDay;

  /* ================= HANDLE BOOKING ================= */
  const handleBooking = async () => {
    if (!startDate || !endDate) return alert("Please select your travel dates");
    if (!form.fullName || !form.phone || !form.email || !form.licenseNumber || !form.licenseExpiry) {
      return alert("Please fill in all required driver details");
    }
    if (!agree) return alert("Please accept the Terms & Conditions to proceed");

    setProcessing(true);

    try {
      const token = localStorage.getItem("token");
      const bookingData = {
        carId: car._id,
        ...form,
        startDate,
        endDate,
        amount: totalPrice,
        paymentStatus: "pending" // Default to pending
      };

      // 1. Create Booking
      const bookingRes = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/bookings/book`,
        bookingData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const bookingId = bookingRes.data.booking._id;

      // 2. Determine Payment Amount
      let payableAmount = 0;
      if (paymentOption === 'full') payableAmount = totalPrice;
      if (paymentOption === 'partial') payableAmount = Math.round(totalPrice * 0.2);

      // 3. Handle Pay Later
      if (paymentOption === 'later') {
        setProcessing(false);
        navigate("/my-bookings");
        return;
      }

      // 4. Handle Online Payment
      const orderRes = await createOrder({ amount: payableAmount, bookingId });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderRes.data.amount,
        currency: "INR",
        name: "Carent Premium",
        description: `Booking: ${car.name}`,
        order_id: orderRes.data.id,
        handler: async function (response) {
          try {
            await verifyPayment({
              bookingId,
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              signature: response.razorpay_signature,
            });
            navigate("/my-bookings");
          } catch (err) {
            alert("Payment verification failed. Booking saved in 'My Bookings'.");
            navigate("/my-bookings");
          }
        },
        prefill: { name: form.fullName, email: form.email, contact: form.phone },
        theme: { color: "#000000" },
        modal: {
          ondismiss: () => {
            setProcessing(false);
            alert("Payment cancelled. You can retry from 'My Bookings'.");
            navigate("/my-bookings");
          }
        }
      };

      if (!window.Razorpay) {
        alert("Payment gateway failed to load.");
        setProcessing(false);
        return;
      }
      new window.Razorpay(options).open();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Booking failed.");
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">

      {/* HEADER */}
      <div className="bg-black text-white pt-28 pb-32 px-4 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-2 text-white/60 hover:text-white transition">
            <ArrowLeft size={20} /> Back to details
          </button>
          <h1 className="text-4xl md:text-5xl font-bold font-display">Secure Your Booking</h1>
          <p className="text-gray-400 mt-2 text-lg">You are almost there! Complete the details below.</p>
        </div>
        {/* Abstract shapes */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600 rounded-full blur-[100px] opacity-20 -translate-y-1/2 translate-x-1/2" />
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-20">
        <div className="grid lg:grid-cols-3 gap-8">

          {/* === LEFT COLUMN: FORM === */}
          <div className="lg:col-span-2 space-y-8">

            {/* 1. Driver Details */}
            <div className="bg-white rounded-3xl p-8 shadow-xl shadow-gray-200/50 border border-gray-100">
              <div className="flex items-center gap-4 border-b border-gray-100 pb-6 mb-8">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-bold text-xl">1</div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Driver Information</h2>
                  <p className="text-sm text-gray-500">Who will be driving the vehicle?</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <FormInput icon={User} label="Full Name" placeholder="e.g. John Doe" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
                <FormInput icon={Phone} label="Phone Number" placeholder="+91 98765 43210" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                <FormInput icon={CheckCircle} label="Email Address" type="email" placeholder="john@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                <FormInput icon={MapPin} label="Residential Address" placeholder="Your full address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
              </div>
            </div>

            {/* 2. License Details */}
            <div className="bg-white rounded-3xl p-8 shadow-xl shadow-gray-200/50 border border-gray-100">
              <div className="flex items-center gap-4 border-b border-gray-100 pb-6 mb-8">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-bold text-xl">2</div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">License Information</h2>
                  <p className="text-sm text-gray-500">Enter your driving license details</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <FormInput label="License Number" placeholder="DL-1234567890123" value={form.licenseNumber} onChange={(e) => setForm({ ...form, licenseNumber: e.target.value })} />
                <FormInput label="License Expiry" type="date" value={form.licenseExpiry} onChange={(e) => setForm({ ...form, licenseExpiry: e.target.value })} />
                <FormInput label="Emergency Contact Name" placeholder="Relative Name" value={form.emergencyName} onChange={(e) => setForm({ ...form, emergencyName: e.target.value })} />
                <FormInput label="Emergency Phone" placeholder="Their contact number" value={form.emergencyPhone} onChange={(e) => setForm({ ...form, emergencyPhone: e.target.value })} />
              </div>
            </div>

          </div>

          {/* === RIGHT COLUMN: SUMMARY === */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-xl shadow-blue-900/5 border border-gray-100 sticky top-24">
              <h2 className="text-xl font-bold mb-6 font-display">Booking Summary</h2>

              {/* Car Mini Card */}
              <div className="flex gap-4 items-center bg-gray-50 p-4 rounded-2xl mb-6">
                <img src={getCarImage(car)} className="w-20 h-20 object-cover rounded-xl" alt="car" />
                <div>
                  <h3 className="font-bold text-gray-900">{car.name}</h3>
                  <p className="text-sm text-gray-500">{car.brand}</p>
                  <p className="text-xs text-blue-600 font-semibold mt-1">₹{car.pricePerDay}/day</p>
                </div>
              </div>

              {/* Date Selection */}
              <div className="mb-6">
                <label className="text-sm font-bold text-gray-500 uppercase mb-3 block">Travel Dates</label>
                <div className="flex justify-center bg-gray-50 rounded-2xl p-2">
                  <DatePicker
                    selectsRange
                    startDate={startDate}
                    endDate={endDate}
                    onChange={([s, e]) => { setStartDate(s); setEndDate(e); }}
                    excludeDateIntervals={excludedRanges}
                    minDate={new Date()}
                    inline
                    className="bg-transparent"
                  />
                </div>
              </div>

              {/* Payment Selection */}
              <div className="space-y-4 py-6 border-t border-gray-100">
                <label className="text-sm font-bold text-gray-500 uppercase block">Payment Option</label>

                <div className="grid grid-cols-1 gap-3">
                  <label className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentOption === 'full' ? 'border-black bg-gray-50' : 'border-gray-100 hover:border-gray-200'}`}>
                    <div className="flex items-center gap-3">
                      <input type="radio" name="payment" checked={paymentOption === 'full'} onChange={() => setPaymentOption('full')} className="w-5 h-5 text-black focus:ring-black" />
                      <div>
                        <span className="block font-bold text-gray-900">Pay Full Amount</span>
                        <span className="text-xs text-gray-500">Secure your car instantly</span>
                      </div>
                    </div>
                    <span className="font-bold text-gray-900">₹{totalPrice.toLocaleString()}</span>
                  </label>

                  <label className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentOption === 'partial' ? 'border-black bg-gray-50' : 'border-gray-100 hover:border-gray-200'}`}>
                    <div className="flex items-center gap-3">
                      <input type="radio" name="payment" checked={paymentOption === 'partial'} onChange={() => setPaymentOption('partial')} className="w-5 h-5 text-black focus:ring-black" />
                      <div>
                        <span className="block font-bold text-gray-900">Pay Deposit (20%)</span>
                        <span className="text-xs text-gray-500">Pay rest at pickup</span>
                      </div>
                    </div>
                    <span className="font-bold text-gray-900">₹{Math.round(totalPrice * 0.2).toLocaleString()}</span>
                  </label>

                  <label className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentOption === 'later' ? 'border-black bg-gray-50' : 'border-gray-100 hover:border-gray-200'}`}>
                    <div className="flex items-center gap-3">
                      <input type="radio" name="payment" checked={paymentOption === 'later'} onChange={() => setPaymentOption('later')} className="w-5 h-5 text-black focus:ring-black" />
                      <div>
                        <span className="block font-bold text-gray-900">Pay at Pickup</span>
                        <span className="text-xs text-gray-500">Cash or Card on arrival</span>
                      </div>
                    </div>
                    <span className="font-bold text-gray-900">₹0</span>
                  </label>
                </div>
              </div>

              {/* Total Calculation */}
              <div className="space-y-3 py-6 border-t border-b border-gray-100">
                <div className="flex justify-between text-gray-600">
                  <span>Duration</span>
                  <span className="font-medium text-gray-900">{totalDays} Days</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Total Rent</span>
                  <span className="font-medium text-gray-900">₹{totalPrice.toLocaleString()}</span>
                </div>
                {paymentOption === 'partial' && (
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Pay Now (20%)</span>
                    <span className="font-bold text-gray-900">₹{Math.round(totalPrice * 0.2).toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-lg pt-2">
                  <span className="font-bold text-gray-900">
                    {paymentOption === 'later' ? "Pay at Pickup" : "Pay Now"}
                  </span>
                  <span className="font-bold text-blue-600">
                    ₹{paymentOption === 'full'
                      ? totalPrice.toLocaleString()
                      : paymentOption === 'partial'
                        ? Math.round(totalPrice * 0.2).toLocaleString()
                        : totalDays > 0 ? (totalPrice).toLocaleString() + " (Later)" : "0"}
                  </span>
                </div>
              </div>

              {/* Terms */}
              <div className="mt-6 space-y-4">
                <label className="flex gap-3 cursor-pointer">
                  <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-1 w-5 h-5 text-blue-600 rounded focus:ring-blue-500" />
                  <span className="text-xs text-gray-500">I agree to the <span onClick={() => setShowTerms(true)} className="text-blue-600 font-medium underline cursor-pointer">Terms & Conditions</span> and Privacy Policy.</span>
                </label>

                <button
                  onClick={handleBooking}
                  disabled={!agree || processing || totalDays === 0}
                  className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-xl
                    ${agree && totalDays > 0 ? "bg-black text-white hover:bg-gray-800" : "bg-gray-100 text-gray-400 cursor-not-allowed"}
                  `}
                >
                  {processing ? "Processing..." :
                    paymentOption === 'later' ? "Confirm Booking (Pay at Pickup)" :
                      paymentOption === 'partial' ? `Pay Deposit ₹${Math.round(totalPrice * 0.2).toLocaleString()}` :
                        `Pay Now ₹${totalPrice.toLocaleString()}`
                  }
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* TERMS MODAL */}
      {showTerms && (
        <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
          <Terms onBack={() => setShowTerms(false)} />
        </div>
      )}
    </div>
  );
};

export default BookCar;