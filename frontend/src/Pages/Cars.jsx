import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchCars } from "../Services/carApi";
import { getCarImage } from "../utils/imageUtils";
import { Search, Filter, Fuel, Settings, Zap, ArrowRight, X, SlidersHorizontal } from "lucide-react";
import AuthModal from "../Components/AuthModal";

const Cars = () => {
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [loading, setLoading] = useState(true);

  // filters
  const [search, setSearch] = useState("");
  const [brand, setBrand] = useState("All");
  const [fuel, setFuel] = useState("All");
  const [maxPriceInput, setMaxPriceInput] = useState("");
  const [appliedMaxPrice, setAppliedMaxPrice] = useState(null);

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false); // mobile

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

  // filter logic
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
    if (appliedMaxPrice)
      data = data.filter((c) => c.pricePerDay <= appliedMaxPrice);

    setFilteredCars(data);
  }, [search, brand, fuel, appliedMaxPrice, cars]);

  const brands = ["All", ...new Set(cars.map((c) => c.brand))];
  const fuels = ["All", ...new Set(cars.map((c) => c.fuelType))];

  const handleBookNow = (id) => {
    navigate(`/cars/${id}`);
  };

  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full"></div>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />

      {/* HEADER */}
      <div className="bg-black text-white pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold font-display tracking-tight">
            Premium <span className="text-blue-500">Selection</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto font-light">
            Choose from our exclusive fleet of luxury vehicles for your next journey.
          </p>
        </div>
      </div>

      {/* FILTERS & CONTENT */}
      <div className="max-w-7xl mx-auto px-4 -mt-10 pb-20">
        <div className="grid lg:grid-cols-4 gap-8">

          {/* SIDEBAR FILTERS (Desktop) */}
          <div className="hidden lg:block space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-xl shadow-blue-900/5 border border-gray-100 sticky top-24">
              <div className="flex items-center gap-2 mb-6 text-gray-900">
                <SlidersHorizontal size={20} />
                <h3 className="font-bold text-lg">Filters</h3>
              </div>

              <div className="space-y-6">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none transition"
                    placeholder="Search cars..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>

                {/* Brand */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-500 uppercase">Brand</label>
                  <div className="relative">
                    <select
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      className="w-full appearance-none bg-gray-50 border border-gray-100 text-gray-700 py-3 px-4 pr-8 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium transition cursor-pointer"
                    >
                      {brands.map((b) => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Price */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-500 uppercase">Max Price</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="e.g. 5000"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl"
                      value={maxPriceInput}
                      onChange={(e) => setMaxPriceInput(e.target.value)}
                    />
                    <button
                      onClick={() => setAppliedMaxPrice(maxPriceInput)}
                      className="bg-black text-white px-4 rounded-xl hover:bg-gray-800 transition"
                    >
                      Go
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* MOBILE FILTER TOGGLE */}
          <div className="lg:hidden col-span-1">
            <button
              onClick={() => setShowFilters(true)}
              className="w-full bg-white py-4 rounded-2xl shadow-lg border border-gray-100 flex items-center justify-center gap-2 font-bold text-gray-900"
            >
              <SlidersHorizontal size={20} /> Show Filters
            </button>
          </div>

          {/* CAR GRID */}
          <div className="lg:col-span-3">
            {filteredCars.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border dashed border-gray-200">
                <p className="text-gray-500 text-lg">No cars found matching your criteria.</p>
                <button onClick={() => { setBrand("All"); setFuel("All"); setSearch(""); setAppliedMaxPrice(null) }} className="mt-4 text-blue-600 font-bold hover:underline">Clear all filters</button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredCars.map((car) => (
                  <div
                    key={car._id}
                    onClick={() => handleBookNow(car._id)}
                    className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col cursor-pointer"
                  >
                    {/* Image */}
                    <div className="relative h-56 overflow-hidden bg-gray-100">
                      <img
                        src={getCarImage(car)}
                        alt={car.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                        {car.brand}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h2 className="text-xl font-bold text-gray-900 font-display">{car.name}</h2>
                          <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                            <span className="bg-gray-100 px-2 py-0.5 rounded flex items-center gap-1"><Settings size={12} /> {car.transmission}</span>
                            <span className="bg-gray-100 px-2 py-0.5 rounded flex items-center gap-1"><Fuel size={12} /> {car.fuelType}</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-4">
                        <div>
                          <p className="text-xl font-bold text-blue-600">₹{car.pricePerDay.toLocaleString()}</p>
                          <p className="text-xs text-gray-400">per day</p>
                        </div>
                        <button className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                          <ArrowRight size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MOBILE FILTER DRAWER */}
      {showFilters && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-xs bg-white h-full p-6 overflow-y-auto animate-slide-left">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold font-display">Filters</h2>
              <button onClick={() => setShowFilters(false)} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-8">
              {/* Search */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-500 uppercase">Search</label>
                <input
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              {/* Brand */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-500 uppercase">Brand</label>
                <div className="relative">
                  <select
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full appearance-none bg-gray-50 border border-gray-100 text-gray-700 py-3 px-4 pr-8 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium transition cursor-pointer"
                  >
                    {brands.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowFilters(false)}
                className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-200"
              >
                Show Results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cars;
