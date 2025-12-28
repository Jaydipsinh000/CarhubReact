import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchCars } from "../Services/carApi";

const Cars = () => {
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [brand, setBrand] = useState("All");
  const [fuel, setFuel] = useState("All");

  const [maxPriceInput, setMaxPriceInput] = useState("");
  const [appliedMaxPrice, setAppliedMaxPrice] = useState(null);

  useEffect(() => {
    fetchCars()
      .then((res) => {
        setCars(res.data.cars);
        setFilteredCars(res.data.cars);
      })
      .finally(() => setLoading(false));
  }, []);

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <span className="animate-spin rounded-full h-10 w-10 border-b-2 border-black"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200">
      {/* HERO */}
      <div className="text-center py-16">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
          Drive <span className="text-blue-600">Premium</span> Cars
        </h1>
        <p className="mt-4 text-gray-600 max-w-xl mx-auto">
          Choose from luxury, comfort & performance cars at unbeatable prices
        </p>
      </div>

      {/* FILTER BAR */}
      <div className="sticky top-0 z-20 bg-white/70 backdrop-blur-lg shadow-md">
        <div className="max-w-7xl mx-auto p-4 grid gap-3 md:grid-cols-6">
          <input
            placeholder="🔍 Search car or brand"
            className="border rounded-lg px-4 py-2 col-span-2"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="border rounded-lg px-3 py-2"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
          >
            {brands.map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>

          <select
            className="border rounded-lg px-3 py-2"
            value={fuel}
            onChange={(e) => setFuel(e.target.value)}
          >
            {fuels.map((f) => (
              <option key={f}>{f}</option>
            ))}
          </select>

          <input
            type="number"
            placeholder="₹ Max / Day"
            className="border rounded-lg px-3 py-2"
            value={maxPriceInput}
            onChange={(e) => setMaxPriceInput(e.target.value)}
          />

          <button
            onClick={() => setAppliedMaxPrice(maxPriceInput)}
            className="bg-black text-white rounded-lg px-4 py-2 hover:scale-105 transition"
          >
            Apply
          </button>
        </div>
      </div>

      {/* CAR GRID */}
      <div className="max-w-7xl mx-auto px-4 py-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {filteredCars.map((car) => (
          <div
            key={car._id}
            className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition relative"
          >
            {/* Badge */}
            <span className="absolute top-4 left-4 bg-black text-white text-xs px-3 py-1 rounded-full">
              Premium
            </span>

            <div className="overflow-hidden">
              <img
                src={car.image}
                alt={car.name}
                className="h-56 w-full object-cover group-hover:scale-110 transition duration-500"
              />
            </div>

            <div className="p-5">
              <h2 className="text-xl font-bold">{car.name}</h2>
              <p className="text-gray-500 text-sm">{car.brand}</p>

              <div className="flex justify-between items-center mt-4 text-sm">
                <span className="bg-gray-100 px-3 py-1 rounded-full">
                  ⛽ {car.fuelType}
                </span>
                <span className="text-xl font-bold text-blue-600">
                  ₹{car.pricePerDay}
                </span>
              </div>

              <Link
                to={`/cars/${car._id}`}
                className="mt-6 block text-center bg-gradient-to-r from-black to-gray-800 text-white py-3 rounded-xl hover:opacity-90"
              >
                View Details →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cars;
