import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { fetchCars } from "../Services/carApi";
import { getCarImage } from "../utils/imageUtils";
import { Search, Filter, Fuel, Settings, Zap, ArrowRight, X, SlidersHorizontal, MapPin, CheckCircle2 } from "lucide-react";
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
  const location = useLocation();

  useEffect(() => {
    fetchCars()
      .then((res) => {
        setCars(res.data.cars);
        setFilteredCars(res.data.cars);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (location.state?.search) {
      setSearch(location.state.search);
    }
  }, [location.state]);

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
      <div className="min-h-screen flex justify-center items-center bg-[#F8FAFC]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full shadow-lg"></div>
          <p className="text-gray-500 font-medium animate-pulse">Loading Fleet...</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />

      {/* HEADER */}
      <div className="bg-[#0F172A] text-white pt-32 pb-24 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="max-w-7xl mx-auto text-center space-y-4 relative z-10">
          <span className="text-blue-400 font-bold tracking-widest text-xs uppercase bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20 max-w-max mx-auto">
            World Class Collection
          </span>
          <h1 className="text-4xl md:text-6xl font-bold font-display tracking-tight leading-tight">
            Premium <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-200">Fleet</span>
          </h1>
          <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto font-light">
            Choose from our exclusive selection of luxury vehicles for your next journey.
          </p>
        </div>
      </div>

      {/* FILTERS & CONTENT */}
      <div className="max-w-7xl mx-auto px-4 -mt-12 pb-20 relative z-20">
        <div className="grid lg:grid-cols-4 gap-8">

          {/* SIDEBAR FILTERS (Desktop) */}
          <div className="hidden lg:block space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-xl shadow-blue-900/5 border border-gray-100 sticky top-24">
              <div className="flex items-center gap-2 mb-6 text-gray-900 border-b border-gray-100 pb-4">
                <SlidersHorizontal size={20} className="text-blue-600" />
                <h3 className="font-bold text-lg">Filters</h3>
              </div>

              <div className="space-y-6">
                {/* Search */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">Search by Name</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none transition text-sm font-medium"
                      placeholder="e.g. BMW X5"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                </div>

                {/* Brand */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">Brand</label>
                  <div className="relative">
                    <select
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      className="w-full appearance-none bg-gray-50 border border-gray-100 text-gray-700 py-3 px-4 pr-8 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium transition cursor-pointer text-sm"
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
                  <label className="text-xs font-bold text-gray-400 uppercase">Max Price / Day</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="e.g. 5000"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium"
                      value={maxPriceInput}
                      onChange={(e) => setMaxPriceInput(e.target.value)}
                    />
                    <button
                      onClick={() => setAppliedMaxPrice(maxPriceInput)}
                      className="bg-black text-white px-4 rounded-xl hover:bg-gray-800 transition active:scale-95"
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
              className="w-full bg-white py-4 rounded-2xl shadow-lg shadow-blue-900/10 border border-gray-100 flex items-center justify-center gap-2 font-bold text-gray-900 hover:bg-gray-50 transition active:scale-[0.98]"
            >
              <SlidersHorizontal size={20} className="text-blue-600" /> Filter Vehicles
            </button>
          </div>

          {/* CAR GRID */}
          <div className="lg:col-span-3">
            {filteredCars.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-gray-200">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                  <Search size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900">No cars found</h3>
                <p className="text-gray-500 mt-2">Try adjusting your filters or search query.</p>
                <button
                  onClick={() => { setBrand("All"); setFuel("All"); setSearch(""); setAppliedMaxPrice(null) }}
                  className="mt-6 text-blue-600 font-bold hover:underline"
                >
                  Clear all filters
                </button>
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
                    <div className="relative h-52 sm:h-60 overflow-hidden bg-gray-100">
                      <img
                        src={getCarImage(car)}
                        alt={car.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold shadow-sm flex items-center gap-1">
                        <CheckCircle2 size={12} className="text-blue-600" /> {car.brand}
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>

                    {/* Content */}
                    <div className="p-5 flex-1 flex flex-col">
                      <div className="mb-4">
                        <h2 className="text-lg sm:text-xl font-bold text-gray-900 font-display line-clamp-1">{car.name}</h2>

                        <div className="flex flex-wrap gap-2 mt-3">
                          <span className="bg-gray-50 text-gray-600 px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 border border-gray-100">
                            <Settings size={12} /> {car.transmission}
                          </span>
                          <span className="bg-gray-50 text-gray-600 px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 border border-gray-100">
                            <Fuel size={12} /> {car.fuelType}
                          </span>
                          <span className="bg-gray-50 text-gray-600 px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 border border-gray-100">
                            <Zap size={12} /> Fast
                          </span>
                        </div>
                      </div>

                      <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-4">
                        <div>
                          <p className="text-xl font-bold text-blue-600">₹{car.pricePerDay.toLocaleString()}</p>
                          <p className="text-xs text-gray-400 font-medium">per day</p>
                        </div>
                        <button className="h-10 px-5 bg-black text-white rounded-full flex items-center justify-center gap-2 group-hover:bg-blue-600 transition-colors text-sm font-bold shadow-lg">
                          Book Now
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

      {/* MOBILE FILTER DRAWER (Bottom Sheet Style) */}
      {showFilters && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center items-end lg:items-center">
          <div className="bg-white w-full lg:w-96 lg:rounded-3xl rounded-t-3xl p-6 md:p-8 animate-slide-up lg:animate-fade-in shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-8 sticky top-0 bg-white z-10 pb-4 border-b border-gray-100">
              <h2 className="text-2xl font-bold font-display">Filter Fleet</h2>
              <button
                onClick={() => setShowFilters(false)}
                className="p-2 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-8">
              {/* Search */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-500 uppercase">Search</label>
                <input
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none"
                  placeholder="e.g. Audi"
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
                    className="w-full appearance-none bg-gray-50 border border-gray-100 text-gray-700 py-3 px-4 pr-8 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium h-12"
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
                <label className="text-sm font-bold text-gray-500 uppercase">Max Price / Day</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="e.g. 5000"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none"
                    value={maxPriceInput}
                    onChange={(e) => setMaxPriceInput(e.target.value)}
                  />
                  <button
                    onClick={() => setAppliedMaxPrice(maxPriceInput)}
                    className="bg-black text-white px-4 rounded-xl hover:bg-gray-800 transition active:scale-95"
                  >
                    Go
                  </button>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => setShowFilters(false)}
                  className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition active:scale-[0.98]"
                >
                  Show {filteredCars.length} Cars
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cars;
