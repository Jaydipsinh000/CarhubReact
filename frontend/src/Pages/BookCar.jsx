import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { fetchCarById } from "../Services/carApi";
import { createOrder, verifyPayment } from "../Services/paymentApi";
import { Calendar, CreditCard, ShieldCheck, MapPin, Phone, User, Info, CheckCircle, AlertCircle } from "lucide-react";

// Helper for premium inputs
const FormInput = ({ icon: Icon, label, ...props }) => (
  <div className="space-y-1.5">
    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
      {Icon && <Icon size={14} className="text-blue-500" />} {label}
    </label>
    <input
      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-gray-900 placeholder:text-gray-400"
      {...props}
    />
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
    // Auth Check
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
        // Pre-fill user data if available in localStorage
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
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full mb-4" />
        <p className="text-gray-500 font-medium">Preparing your vehicle...</p>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center p-4">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
          <AlertCircle size={32} />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Vehicle Not Found</h2>
        <p className="text-gray-500 mt-2 text-sm">The car you are looking for is currently unavailable or does not exist.</p>
        <button onClick={() => navigate('/cars')} className="mt-6 px-6 py-2 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition">
          Browse Fleet
        </button>
      </div>
    );
  }

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
    // Validation
    if (!startDate || !endDate) return alert("Please select your travel dates");
    if (!form.fullName || !form.phone || !form.email || !form.licenseNumber || !form.licenseExpiry) {
      return alert("Please fill in all required driver details");
    }
    if (!agree) return alert("Please accept the Terms & Conditions to proceed");

    setProcessing(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to book a car.");
        navigate("/login");
        return;
      }

      // 1. Create Booking Entry
      const bookingRes = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/bookings/book`,
        {
          carId: car._id,
          ...form,
          startDate,
          endDate,
          amount: totalPrice,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const bookingId = bookingRes.data.booking._id;

      // 2. Create Razorpay Order
      const orderRes = await createOrder({
        amount: totalPrice,
        bookingId,
      });

      // 3. Initialize Razorpay
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderRes.data.amount,
        currency: "INR",
        name: "Carent Premium",
        description: `Rental: ${car.name} (${totalDays} Days)`,
        order_id: orderRes.data.id,
        handler: async function (response) {
          try {
            await verifyPayment({
              bookingId,
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              signature: response.razorpay_signature,
            });

            // Success Redirect
            navigate("/my-bookings");
          } catch (err) {
            console.error(err);
            alert("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: form.fullName,
          email: form.email,
          contact: form.phone,
        },
        theme: { color: "#0f172a" },
        modal: {
          ondismiss: function () {
            setProcessing(false);
          }
        }
      };

      if (!window.Razorpay) {
        alert("Payment gateway failed to load. Please check your connection.");
        setProcessing(false);
        return;
      }

      new window.Razorpay(options).open();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Booking failed. Please try again.");
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-24 pb-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8">

        {/* === LEFT COLUMN: FORM === */}
        <div className="lg:col-span-2 space-y-6">

          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 font-display">Confirm your Booking</h1>
            <p className="text-gray-500 mt-1">Complete the form below to secure your ride.</p>
          </div>

          {/* Personal Details */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <User className="text-blue-600" size={20} /> Driver Details
            </h2>
            <div className="grid sm:grid-cols-2 gap-6">
              <FormInput icon={User} label="Full Name" placeholder="e.g. John Doe" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
              <FormInput icon={Phone} label="Phone Number" placeholder="+91 98765 43210" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              <FormInput icon={CheckCircle} label="Email Address" type="email" placeholder="john@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              <FormInput icon={MapPin} label="Residential Address" placeholder="Your full address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            </div>
          </div>

          {/* License & Emergency */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <ShieldCheck className="text-blue-600" size={20} /> License & Emergency
            </h2>
            <div className="grid sm:grid-cols-2 gap-6 mb-6">
              <FormInput label="License Number" placeholder="DL-1234567890123" value={form.licenseNumber} onChange={(e) => setForm({ ...form, licenseNumber: e.target.value })} />
              <FormInput label="License Expiry" type="date" value={form.licenseExpiry} onChange={(e) => setForm({ ...form, licenseExpiry: e.target.value })} />
            </div>
            <div className="grid sm:grid-cols-2 gap-6 pt-6 border-t border-gray-100">
              <FormInput label="Emergency Contact Name" placeholder="Relative/Friend Name" value={form.emergencyName} onChange={(e) => setForm({ ...form, emergencyName: e.target.value })} />
              <FormInput label="Emergency Phone" placeholder="Their contact number" value={form.emergencyPhone} onChange={(e) => setForm({ ...form, emergencyPhone: e.target.value })} />
            </div>
          </div>

        </div>

        {/* === RIGHT COLUMN: SUMMARY === */}
        <div className="space-y-6">

          {/* Car Summary Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden sticky top-24">
            <div className="relative h-48">
              <img
                src={(() => {
                  let img = car.image;
                  if (Array.isArray(img) && img.length > 0) img = img[0];
                  if (!img && car.images?.length > 0) img = car.images[0];

                  if (!img || typeof img !== 'string') return "https://via.placeholder.com/400x300?text=No+Image";

                  if (img.startsWith("http")) return img;

                  // Normalize path: replace backslashes, remove leading slashes
                  let cleanPath = img.replace(/\\/g, "/");
                  while (cleanPath.startsWith("/")) cleanPath = cleanPath.substring(1);

                  // Ensure it starts with uploads/
                  if (!cleanPath.startsWith("uploads/")) {
                    cleanPath = `uploads/${cleanPath}`;
                  }

                  const baseUrl = import.meta.env.VITE_IMAGE_BASE_URL || "https://carent-qdwb.onrender.com";
                  const normalizedBase = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
                  return `${normalizedBase}/${cleanPath}`;
                })()}
                alt={car.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-2xl font-bold font-display">{car.name}</h3>
                <p className="opacity-90">{car.brand} • {car.transmission}</p>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Date Picker */}
              <div>
                <label className="text-sm font-bold text-gray-700 mb-3 block flex items-center gap-2">
                  <Calendar size={16} className="text-blue-500" /> Select Dates
                </label>
                <div className="flex justify-center bg-gray-50 rounded-xl p-2">
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

              {/* Price Breakdown */}
              <div className="bg-blue-50/50 rounded-xl p-4 space-y-3">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Rate per day</span>
                  <span className="font-medium text-gray-900">₹{car.pricePerDay.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Duration</span>
                  <span className="font-medium text-gray-900">{totalDays} Days</span>
                </div>
                <div className="border-t border-blue-100 pt-3 flex justify-between items-center">
                  <span className="font-bold text-gray-900">Total Payable</span>
                  <span className="text-2xl font-bold text-blue-600">₹{totalPrice.toLocaleString()}</span>
                </div>
              </div>

              {/* Terms & Action */}
              <div className="space-y-4">
                <label className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition cursor-pointer">
                  <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-1 w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
                  <div className="text-sm text-gray-500 leading-snug">
                    I agree to the <button onClick={(e) => { e.preventDefault(); setShowTerms(!showTerms) }} className="text-blue-600 font-medium hover:underline">Terms & Conditions</button>, including damage policy and traffic fines responsibility.
                  </div>
                </label>

                {showTerms && (
                  <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg mx-2 border border-gray-200">
                    • Security deposit may apply upon pickup<br />
                    • Fuel policy: Full to Full<br />
                    • Valid ID & License required at pickup
                  </div>
                )}

                <button
                  onClick={handleBooking}
                  disabled={!agree || processing || totalDays === 0}
                  className={`w-full py-4 px-6 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all transform active:scale-95
                            ${agree && totalDays > 0 && !processing ? "bg-black text-white hover:bg-gray-900 shadow-lg shadow-gray-200" : "bg-gray-200 text-gray-400 cursor-not-allowed"}
                        `}
                >
                  {processing ? (
                    <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Processing...</>
                  ) : (
                    <>Confirm & Pay <CreditCard size={20} /></>
                  )}
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default BookCar;