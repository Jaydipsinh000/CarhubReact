import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchCarById, fetchCars, checkAvailability } from "../Services/carApi";
import { resolveImagePath, getCarImage } from "../utils/imageUtils";
import { ChevronLeft, ChevronRight, Star, Shield, Zap, Settings, Fuel, Armchair, Calendar, ArrowRight } from "lucide-react";
import AuthModal from "../Components/AuthModal";

const CarDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [car, setCar] = useState(null);
  const [moreCars, setMoreCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Booking states
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [totalDays, setTotalDays] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchCarById(id);
        const all = await fetchCars();
        setCar(res.data.car);
        setMoreCars(all.data.cars.filter((c) => c._id !== id).slice(0, 4));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = end - start;
      const days = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
      setTotalDays(days > 0 ? days : 0);
    }
  }, [startDate, endDate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!car) return <div className="text-center py-20">Car not found</div>;

  const images = car.images?.length ? car.images : [car.image];
  const features = car.features || ["GPS Navigation", "Bluetooth", "Climate Control", "Premium Sound", "Leather Seats", "360 Camera"];

  const nextImage = () => setCurrentImgIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  const prevImage = () => setCurrentImgIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));

  const handleBookingClick = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setShowAuthModal(true);
    } else {
      navigate(`/book/${car._id}`);
    }
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen pb-24 md:pb-10">
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />

      {/* --- HERO GALLERY --- */}
      <div className="relative bg-black">
        <div className="relative h-[40vh] md:h-[60vh] w-full overflow-hidden">
          <img
            src={resolveImagePath(images[currentImgIndex])}
            alt={car.name}
            className="w-full h-full object-contain md:object-cover transition-opacity duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent md:hidden" />

          {/* Navigation Arrows */}
          <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/20 transition hidden md:flex">
            <ChevronLeft size={24} />
          </button>
          <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/20 transition hidden md:flex">
            <ChevronRight size={24} />
          </button>

          {/* Image Counter */}
          <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur text-white text-xs px-3 py-1 rounded-full border border-white/10">
            {currentImgIndex + 1} / {images.length}
          </div>
        </div>

        {/* Thumbnail Strip (Desktop) */}
        <div className="hidden md:flex gap-4 p-4 overflow-x-auto justify-center bg-black/90">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentImgIndex(idx)}
              className={`relative w-24 h-16 rounded-lg overflow-hidden border-2 transition-all opacity-80 hover:opacity-100 ${currentImgIndex === idx ? "border-blue-500 scale-105 opacity-100" : "border-transparent"
                }`}
            >
              <img src={resolveImagePath(img)} className="w-full h-full object-cover" alt="thumbnail" />
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 md:mt-10 relative z-10">
        <div className="grid lg:grid-cols-3 gap-10">

          {/* --- LEFT COLUMN: DETAILS --- */}
          <div className="lg:col-span-2 space-y-8">

            {/* Header Card */}
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 animate-slideUp">
              <div className="flex flex-col md:flex-row justify-between md:items-start gap-4 mb-6">
                <div>
                  <h1 className="text-3xl md:text-5xl font-bold text-gray-900 font-display tracking-tight leading-tight">
                    {car.name}
                  </h1>
                  <p className="text-lg text-gray-500 font-medium mt-1">{car.brand} Series</p>
                </div>
                <div className="flex flex-col items-start md:items-end">
                  <p className="text-3xl font-bold text-blue-600">₹{car.pricePerDay.toLocaleString()}</p>
                  <p className="text-sm text-gray-400 font-medium">per day</p>
                </div>
              </div>

              {/* Key Specs */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-blue-500 shadow-sm"><Settings size={18} /></div>
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-400 uppercase font-bold">Type</span>
                    <span className="text-sm font-semibold text-gray-700">{car.transmission}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-blue-500 shadow-sm"><Fuel size={18} /></div>
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-400 uppercase font-bold">Fuel</span>
                    <span className="text-sm font-semibold text-gray-700">{car.fuelType}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-blue-500 shadow-sm"><Armchair size={18} /></div>
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-400 uppercase font-bold">Seats</span>
                    <span className="text-sm font-semibold text-gray-700">{car.seats} Adults</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-blue-500 shadow-sm"><Shield size={18} /></div>
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-400 uppercase font-bold">Safety</span>
                    <span className="text-sm font-semibold text-gray-700">5 Star</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Description & Features Tabs */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex border-b border-gray-100">
                {['overview', 'features', 'reviews'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-4 text-sm md:text-base font-bold uppercase tracking-wider transition-all
                      ${activeTab === tab ? "bg-black text-white" : "bg-white text-gray-500 hover:bg-gray-50"}
                    `}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="p-8 min-h-[200px]">
                {activeTab === 'overview' && (
                  <div className="space-y-4 animate-fade-in">
                    <h3 className="text-xl font-bold font-display">About the vehicle</h3>
                    <p className="text-gray-600 leading-relaxed text-lg">
                      {car.description || "Experience the perfect blend of performance and luxury. This vehicle is maintained to the highest standards to ensure your journey is smooth, safe, and memorable. Perfect for weekend getaways or business travel."}
                    </p>
                    <div className="flex gap-4 mt-6">
                      <div className="px-4 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-medium flex items-center gap-2">
                        <CheckIcon /> Free Cancellation
                      </div>
                      <div className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium flex items-center gap-2">
                        <CheckIcon /> Instant Booking
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'features' && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-8 animate-fade-in">
                    {features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-2 text-gray-700">
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                        {feature}
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="w-12 h-12 bg-gray-200 rounded-full" />
                      <div>
                        <div className="flex items-center gap-1 text-yellow-500 mb-1">
                          <Star size={14} fill="currentColor" />
                          <Star size={14} fill="currentColor" />
                          <Star size={14} fill="currentColor" />
                          <Star size={14} fill="currentColor" />
                          <Star size={14} fill="currentColor" />
                        </div>
                        <p className="text-gray-900 font-medium">"Absolute pleasure to drive. The condition was pristine."</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* --- RIGHT COLUMN: STICKY BOOKING CARD (Desktop) --- */}
          <div className="hidden lg:block">
            <div className="sticky top-24 bg-white rounded-3xl shadow-xl shadow-blue-900/5 p-8 border border-gray-100">
              <h3 className="text-2xl font-bold font-display mb-6">Book your drive</h3>

              <div className="space-y-6">
                <div className="p-4 bg-gray-50 rounded-xl space-y-4">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Daily Rate</label>
                    <div className="text-2xl font-bold text-gray-900">₹{car.pricePerDay.toLocaleString()}</div>
                  </div>
                </div>

                <button
                  onClick={handleBookingClick}
                  className="w-full py-4 bg-black text-white rounded-xl font-bold text-lg hover:bg-gray-900 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 group shadow-lg"
                >
                  Proceed to Book <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>

                <p className="text-center text-xs text-gray-400">
                  You won't be charged yet. Secure checkout handled by Razorpay.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* --- SIMILAR CARS --- */}
        {moreCars.length > 0 && (
          <div className="mt-20">
            <h2 className="text-3xl font-bold mb-8 font-display">You might also like</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {moreCars.map((c) => (
                <div
                  key={c._id}
                  onClick={() => navigate(`/cars/${c._id}`)}
                  className="group bg-white rounded-2xl border border-gray-100 overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300"
                >
                  <div className="h-48 overflow-hidden">
                    <img
                      src={getCarImage(c)}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      alt={c.name}
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-lg text-gray-900 mb-1">{c.name}</h3>
                    <p className="text-gray-500 text-sm mb-3">{c.brand}</p>
                    <div className="flex justify-between items-center border-t pt-3">
                      <span className="font-semibold text-gray-900">₹{c.pricePerDay.toLocaleString()}</span>
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">{c.transmission}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* --- MOBILE FIXED BOOKING BAR --- */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4 lg:hidden z-40 flex items-center justify-between shadow-[0_-5px_20px_rgba(0,0,0,0.1)]">
        <div>
          <p className="text-sm text-gray-500">Total Price</p>
          <p className="text-xl font-bold text-blue-600">₹{car.pricePerDay.toLocaleString()}<span className="text-sm text-gray-400 font-normal">/day</span></p>
        </div>
        <button
          onClick={handleBookingClick}
          className="px-8 py-3 bg-black text-white rounded-xl font-bold shadow-lg"
        >
          Book Now
        </button>
      </div>
    </div>
  );
};

// Simple Icon Component
const CheckIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

export default CarDetails;
