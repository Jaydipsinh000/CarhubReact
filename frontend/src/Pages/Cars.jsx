import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchCars } from "../Services/carApi";
import { Search, Filter, Fuel, Settings, Zap, ArrowRight, Car as CarIcon, AlertCircle } from "lucide-react";
import AuthModal from "../Components/AuthModal";

const Cars = () => {
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [brand, setBrand] = useState("All");
  const [fuel, setFuel] = useState("All");
  const [maxPriceInput, setMaxPriceInput] = useState("");
  const [appliedMaxPrice, setAppliedMaxPrice] = useState(null);

  const [showAuthModal, setShowAuthModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchCars()
      .then((res) => {
        setCars(res.data.cars);
        setFilteredCars(res.data.cars);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Filter Logic
  useEffect(() => {
    let data = [...cars];
    if (search) {
      data = data.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.brand.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (brand !== "All") data = data.filter((c) => c.brand === brand);
    if (fuel !== "All") data = data.filter((c) => c.fuelType === fuel);
    if (appliedMaxPrice) data = data.filter((c) => c.pricePerDay <= appliedMaxPrice);

    setFilteredCars(data);
  }, [search, brand, fuel, appliedMaxPrice, cars]);

  const brands = ["All", ...new Set(cars.map((c) => c.brand))];
  const fuels = ["All", ...new Set(cars.map((c) => c.fuelType))];

  // Helper for safe image resolution (Same as MyBookings)
  const getCarImage = (car) => {
    if (!car || (!car.image && (!car.images || car.images.length === 0))) {
      return "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=1000";
    }
    const img = car.image || car.images[0];
    if (typeof img !== 'string') return "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=1000";

    // Check if absolute URL (http/https)
    return img.startsWith("http") ? img : `${import.meta.env.VITE_IMAGE_BASE_URL}${img}`;
  };

  const handleBookNow = (carId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setShowAuthModal(true);
      return;
    }
    navigate(`/cars/${carId}`);
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin h-12 w-12 border-4 border-black border-t-transparent rounded-full mb-4" />
        <p className="text-gray-500 font-medium">Loading premium fleet...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />

      {/* HERO SECTION */}
      <div className="relative bg-black text-white py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-blue-900/20 blur-3xl opacity-50" />
        <div className="relative max-w-7xl mx-auto text-center space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold font-display tracking-tight">
            Find Your <span className="text-blue-500">Perfect Drive</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Experience the thrill of the road with our curated collection of premium and luxury vehicles.
          </p>
        </div>
      </div>

      {/* STICKY FILTER BAR */}
      <div className="sticky top-16 z-30 px-4 -mt-8">
        <div className="max-w-7xl mx-auto bg-white/80 backdrop-blur-xl border border-gray-200/50 shadow-xl rounded-2xl p-4 md:p-6 transition-all">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">

            {/* SEARCH */}
            <div className="md:col-span-4 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                placeholder="Search by name or brand..."
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* BRAND */}
            <div className="md:col-span-2 relative">
              <CarIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <select
                className="w-full pl-11 pr-8 py-3 bg-gray-50 border border-gray-200 rounded-xl appearance-none focus:ring-2 focus:ring-blue-500/20 outline-none cursor-pointer"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              >
                {brands.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>

            {/* FUEL */}
            <div className="md:col-span-2 relative">
              <Fuel className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <select
                className="w-full pl-11 pr-8 py-3 bg-gray-50 border border-gray-200 rounded-xl appearance-none focus:ring-2 focus:ring-blue-500/20 outline-none cursor-pointer"
                value={fuel}
                onChange={(e) => setFuel(e.target.value)}
              >
                {fuels.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>

            {/* PRICE */}
            <div className="md:col-span-4 flex gap-2">
              <div className="relative flex-1">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
                <input
                  type="number"
                  placeholder="Max Price"
                  className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none"
                  value={maxPriceInput}
                  onChange={(e) => setMaxPriceInput(e.target.value)}
                />
              </div>
              <button
                onClick={() => setAppliedMaxPrice(maxPriceInput)}
                className="px-6 py-3 bg-black text-white font-medium rounded-xl hover:bg-gray-800 transition shadow-lg shadow-gray-200"
              >
                Filter
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* CAR GRID */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        {filteredCars.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex p-4 bg-gray-100 rounded-full text-gray-400 mb-4">
              <AlertCircle size={48} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">No cars found</h3>
            <p className="text-gray-500 mt-2">Try adjusting your filters to find what you're looking for.</p>
            <button onClick={() => { setSearch(""); setBrand("All"); setFuel("All"); setAppliedMaxPrice(null); }} className="mt-6 text-blue-600 font-medium hover:underline">Clear all filters</button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCars.map((car) => (
              <div
                key={car._id}
                className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
              >
                {/* IMAGE AREA */}
                <div className="relative h-64 overflow-hidden bg-gray-100">
                  <img
                    src={getCarImage(car)}
                    alt={car.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
                    {car.brand}
                  </div>
                </div>

                {/* CONTENT */}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 font-display leading-tight">{car.name}</h2>
                      <p className="text-sm text-gray-500 mt-1">{car.brand} Series</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-blue-600">₹{car.pricePerDay.toLocaleString()}</p>
                      <p className="text-xs text-gray-400">/ day</p>
                    </div>
                  </div>

                  {/* SPECS */}
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-6 bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <span className="flex items-center gap-1.5"><Fuel size={16} className="text-blue-500" /> {car.fuelType}</span>
                    <span className="w-px h-4 bg-gray-300"></span>
                    <span className="flex items-center gap-1.5"><Settings size={16} className="text-blue-500" /> {car.transmission}</span>
                    <span className="w-px h-4 bg-gray-300"></span>
                    <span className="flex items-center gap-1.5"><Zap size={16} className="text-blue-500" /> {car.seats} Seats</span>
                  </div>

                  <div className="mt-auto pt-4 border-t border-gray-100">
                    <button
                      onClick={() => handleBookNow(car._id)}
                      className="w-full py-3 bg-black text-white rounded-xl font-medium flex items-center justify-center gap-2 group-hover:bg-blue-600 transition-colors"
                    >
                      Book Now <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Cars;
