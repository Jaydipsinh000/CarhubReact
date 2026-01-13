import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchCarById, fetchCars, checkAvailability } from "../Services/carApi";
import { resolveImagePath, getCarImage } from "../utils/imageUtils";
import { ChevronLeft, ChevronRight, Star, Shield, Zap, Settings, Fuel, Armchair, Calendar, ArrowRight } from "lucide-react";
import AuthModal from "../Components/AuthModal";
import CarLoader from "../Components/CarLoader";

const CarDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [car, setCar] = useState(null);
  const [moreCars, setMoreCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [showAuthModal, setShowAuthModal] = useState(false);



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



  if (loading) {
    return <div className="h-screen flex items-center justify-center bg-gray-50"><CarLoader /></div>;
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
      if (car.listingType === "Sell") {
        navigate(`/buy/${car._id}`);
      } else {
        navigate(`/book/${car._id}`);
      }
    }
  };

  return (
    <div className="bg-white min-h-screen pb-20">
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:items-start text-left">

          {/* --- LEFT COLUMN: STICKY GALLERY --- */}
          <div className="lg:sticky lg:top-24 h-fit space-y-4">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-gray-100 border border-gray-100 shadow-sm group">
              <img
                src={resolveImagePath(images[currentImgIndex])}
                alt={car.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {/* Image Navigation Overlay */}
              <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={prevImage} className="w-10 h-10 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white text-gray-900 transition shadow-lg">
                  <ChevronLeft size={20} />
                </button>
                <button onClick={nextImage} className="w-10 h-10 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white text-gray-900 transition shadow-lg">
                  <ChevronRight size={20} />
                </button>
              </div>
              <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur text-white text-xs font-bold px-3 py-1.5 rounded-full">
                {currentImgIndex + 1} / {images.length}
              </div>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImgIndex(idx)}
                  className={`relative flex-shrink-0 w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all ${currentImgIndex === idx ? "border-blue-600 opacity-100" : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                >
                  <img src={resolveImagePath(img)} className="w-full h-full object-cover" alt="thumbnail" />
                </button>
              ))}
            </div>
          </div>

          {/* --- RIGHT COLUMN: DETAILS & BOOKING --- */}
          <div className="space-y-8">
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider">
                  {car.brand}
                </span>
                <span className="flex items-center gap-1 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <Star size={12} className="text-yellow-400 fill-yellow-400" /> 4.9 (42 reviews)
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 font-display tracking-tight leading-tight mb-2">
                {car.name}
              </h1>
              <p className="text-3xl font-bold text-gray-900">
                ₹{car.pricePerDay.toLocaleString()}
                {car.listingType !== "Sell" && <span className="text-lg text-gray-400 font-medium font-sans">/day</span>}
              </p>
            </div>

            {/* Specs Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-600 shadow-sm"><Settings size={20} /></div>
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase">Transmission</p>
                  <p className="font-semibold text-gray-900">{car.transmission}</p>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-600 shadow-sm"><Fuel size={20} /></div>
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase">Fuel Type</p>
                  <p className="font-semibold text-gray-900">{car.fuelType}</p>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-600 shadow-sm"><Armchair size={20} /></div>
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase">Seats</p>
                  <p className="font-semibold text-gray-900">{car.seats} Adults</p>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-600 shadow-sm"><Zap size={20} /></div>
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase">Speed</p>
                  <p className="font-semibold text-gray-900">240 km/h</p>
                </div>
              </div>
            </div>

            {/* Booking Card (Inline) */}
            <div className="p-6 rounded-3xl border border-gray-200 shadow-xl shadow-gray-200/50 bg-white">
              <h3 className="font-bold text-xl mb-4">Book your drive</h3>
              <div className="space-y-4">
                <p className="text-gray-500 text-sm">
                  Experience the thrill of driving this specific {car.brand} {car.name}.
                  Click below to proceed to secure checkout.
                </p>

                <button
                  onClick={handleBookingClick}
                  className="w-full py-4 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition-transform active:scale-[0.99] flex items-center justify-center gap-2 shadow-lg"
                >
                  {car.listingType === "Sell" ? "Reserve Now" : "Book Now"} <ArrowRight size={18} />
                </button>
                <div className="flex items-center justify-center gap-2 text-xs text-gray-400 font-medium">
                  <Shield size={12} /> Secure transaction via Razorpay
                </div>
              </div>
            </div>

            {/* Tabs for Description & Needs */}
            <div className="border-t border-gray-100 pt-8">
              <div className="flex gap-6 border-b border-gray-100 mb-6">
                {['Overview', 'Features', 'Reviews'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab.toLowerCase())}
                    className={`pb-4 text-sm font-bold uppercase tracking-wider border-b-2 transition-colors ${activeTab === tab.toLowerCase() ? "border-black text-black" : "border-transparent text-gray-400 hover:text-gray-600"}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="min-h-[150px]">
                {activeTab === 'overview' && (
                  <div className="animate-fade-in space-y-4">
                    <p className="text-gray-600 leading-relaxed">
                      {car.description || "Designed for those who refuse to compromise. This vehicle combines engineering excellence with interior luxury to make every journey memorable. Whether you're heading to a business meeting or a weekend retreat, arrive in style."}
                    </p>
                    <ul className="space-y-2 mt-4">
                      <li className="flex items-center gap-2 text-sm text-gray-600"><CheckIcon /> Meticulously cleaned and sanitized</li>
                      <li className="flex items-center gap-2 text-sm text-gray-600"><CheckIcon /> Full tank of fuel provided</li>
                      <li className="flex items-center gap-2 text-sm text-gray-600"><CheckIcon /> 24/7 Roadside Assistance included</li>
                    </ul>
                  </div>
                )}
                {activeTab === 'features' && (
                  <div className="grid grid-cols-2 gap-y-3 animate-fade-in">
                    {features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-gray-700 font-medium">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        {feature}
                      </div>
                    ))}
                  </div>
                )}
                {activeTab === 'reviews' && (
                  <div className="bg-gray-50 rounded-xl p-6 text-center text-gray-500 animate-fade-in">
                    <p>Verified reviews from recent renters will appear here.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* --- SIMILAR CARS --- */}
        {moreCars.length > 0 && (
          <div className="mt-24 border-t border-gray-100 pt-16">
            <h2 className="text-2xl font-bold mb-8 font-display">You might also like</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {moreCars.map((c) => (
                <div
                  key={c._id}
                  onClick={() => navigate(`/cars/${c._id}`)}
                  className="group bg-white rounded-2xl border border-gray-100 overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300"
                >
                  <div className="h-40 overflow-hidden bg-gray-50">
                    <img
                      src={getCarImage(c)}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      alt={c.name}
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-base text-gray-900 mb-1">{c.name}</h3>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-blue-600 font-bold text-sm">
                        ₹{c.pricePerDay.toLocaleString()}
                        {c.listingType !== "Sell" && <span>/day</span>}
                      </span>
                      <span className="text-[10px] uppercase font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded">{c.brand}</span>
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
          <p className="text-xs text-gray-400 font-bold uppercase">Total</p>
          <p className="text-lg font-bold text-gray-900">₹{car.pricePerDay.toLocaleString()}</p>
        </div>
        <button
          onClick={handleBookingClick}
          className="px-6 py-3 bg-black text-white rounded-lg font-bold shadow-lg text-sm"
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
