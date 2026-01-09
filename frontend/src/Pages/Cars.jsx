import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchCars } from "../Services/carApi";
import { getCarImage } from "../utils/imageUtils";
import {
  Search,
  Filter,
  Fuel,
  Settings,
  Zap,
  ArrowRight,
  Car as CarIcon,
  AlertCircle,
} from "lucide-react";
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
    // Navigate directly to details page. Login check happens at booking stage.
    navigate(`/cars/${id}`);
  };

  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full"></div>
          <p className="text-gray-500 font-medium animate-pulse">Loading premium fleet...</p>
        </div>
      </div>
    );



  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />

      {/* HERO */}
      <div className="relative bg-black text-white py-24 text-center">
        <h1 className="text-5xl font-bold">
          Find Your <span className="text-blue-500">Perfect Drive</span>
        </h1>
        <p className="text-gray-400 mt-4">
          Premium & luxury cars at best price
        </p>
      </div>

      {/* MOBILE FILTER BUTTON */}
      <div className="md:hidden sticky top-16 z-30 px-4 -mt-8">
        <button
          onClick={() => setShowFilters(true)}
          className="w-full flex items-center justify-center gap-2 bg-black text-white py-3 rounded-xl shadow-xl"
        >
          <Filter size={18} />
          Filters
        </button>
      </div>

      {/* DESKTOP FILTER BAR (UNCHANGED DESIGN) */}
      <div className="hidden md:block sticky top-16 z-30 px-4 -mt-8">
        <div className="max-w-7xl mx-auto bg-white/80 backdrop-blur-xl border shadow-xl rounded-2xl p-5">
          <div className="grid grid-cols-12 gap-4">

            <div className="col-span-4 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border rounded-xl"
                placeholder="Search by name or brand..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="col-span-2 relative">
              <CarIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <select
                className="w-full pl-11 pr-8 py-3 bg-gray-50 border rounded-xl appearance-none"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              >
                {brands.map((b) => (
                  <option key={b}>{b}</option>
                ))}
              </select>
            </div>

            <div className="col-span-2 relative">
              <Fuel className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <select
                className="w-full pl-11 pr-8 py-3 bg-gray-50 border rounded-xl appearance-none"
                value={fuel}
                onChange={(e) => setFuel(e.target.value)}
              >
                {fuels.map((f) => (
                  <option key={f}>{f}</option>
                ))}
              </select>
            </div>

            <div className="col-span-2 relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                ₹
              </span>
              <input
                type="number"
                placeholder="Max Price"
                className="w-full pl-8 pr-4 py-3 bg-gray-50 border rounded-xl"
                value={maxPriceInput}
                onChange={(e) => setMaxPriceInput(e.target.value)}
              />
            </div>

            <button
              onClick={() => setAppliedMaxPrice(maxPriceInput)}
              className="col-span-2 bg-black text-white rounded-xl flex items-center justify-center gap-2"
            >
              Apply <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE FILTER MODAL – SAME UI */}
      {showFilters && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end">
          <div className="w-full bg-white/90 backdrop-blur-xl rounded-t-2xl p-5 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Filter size={18} /> Filters
              </h3>
              <button onClick={() => setShowFilters(false)}>✕</button>
            </div>

            {/* SAME FILTER CONTENT */}
            <div className="grid gap-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border rounded-xl"
                  placeholder="Search by name or brand..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="relative">
                <CarIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <select
                  className="w-full pl-11 pr-8 py-3 bg-gray-50 border rounded-xl"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                >
                  {brands.map((b) => (
                    <option key={b}>{b}</option>
                  ))}
                </select>
              </div>

              <div className="relative">
                <Fuel className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <select
                  className="w-full pl-11 pr-8 py-3 bg-gray-50 border rounded-xl"
                  value={fuel}
                  onChange={(e) => setFuel(e.target.value)}
                >
                  {fuels.map((f) => (
                    <option key={f}>{f}</option>
                  ))}
                </select>
              </div>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  ₹
                </span>
                <input
                  type="number"
                  placeholder="Max Price"
                  className="w-full pl-8 pr-4 py-3 bg-gray-50 border rounded-xl"
                  value={maxPriceInput}
                  onChange={(e) => setMaxPriceInput(e.target.value)}
                />
              </div>

              <button
                onClick={() => {
                  setAppliedMaxPrice(maxPriceInput);
                  setShowFilters(false);
                }}
                className="w-full bg-black text-white py-3 rounded-xl flex items-center justify-center gap-2"
              >
                Apply Filters <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

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
                    onClick={() => handleBookNow(car._id)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 cursor-pointer"
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
