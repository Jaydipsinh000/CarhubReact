import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchCarById } from "../Services/carApi";

const CarDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [car, setCar] = useState(null);
  const [moreCars, setMoreCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState("description");
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const loadCar = async () => {
      try {
        const res = await fetchCarById(id);
        setCar(res.data.car);
        setCurrentImage(0);
      } catch (err) {
        console.error(err);
      }
    };

    const loadMoreCars = async () => {
      try {
        const res = await fetchAllCars();
        // Exclude the current car
        setMoreCars(res.data.cars.filter((c) => c._id !== id));
      } catch (err) {
        console.error(err);
      }
    };

    Promise.all([loadCar(), loadMoreCars()]).finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return (
      <p className="text-center mt-20 text-gray-500 animate-pulse">
        Loading car details...
      </p>
    );

  if (!car)
    return (
      <p className="text-center mt-20 text-red-500 font-semibold">
        Car not found
      </p>
    );

  const images = car.images && car.images.length ? car.images : [car.image];
  const features = car.features || ["GPS", "Air Conditioning", "Bluetooth", "Music System"];

  const prevImage = () =>
    setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  const nextImage = () =>
    setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
      {/* ===== CAR IMAGE GALLERY ===== */}
      <div className="grid md:grid-cols-5 gap-6">
        {/* MAIN IMAGE */}
        <div className="md:col-span-4 relative rounded-2xl overflow-hidden shadow-xl bg-black">
          <img
            src={images[currentImage]}
            alt={car.name}
            className="w-full h-[420px] object-cover transition-all duration-500"
          />
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full shadow transition"
              >
                ❮
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full shadow transition"
              >
                ❯
              </button>
            </>
          )}
          <div className="absolute bottom-4 right-4 bg-black/60 text-white px-4 py-1 rounded-full text-sm">
            {currentImage + 1} / {images.length}
          </div>
        </div>

        {/* THUMBNAILS */}
        <div className="md:col-span-1 flex md:flex-col gap-3 overflow-y-auto h-[420px]">
          {images.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`${car.name}-${idx}`}
              onClick={() => setCurrentImage(idx)}
              className={`w-full h-24 object-cover rounded-xl cursor-pointer border-2 transition-all ${
                idx === currentImage
                  ? "border-blue-600 scale-105 shadow-lg"
                  : "border-gray-300 hover:scale-105"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Car Info & Tabs */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* Tabs */}
          <div className="flex gap-4 border-b">
            {["description", "specs", "reviews"].map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`py-2 px-4 font-semibold ${
                  selectedTab === tab
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-600"
                } transition`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {selectedTab === "description" && car.description && (
            <div className="p-4 bg-white rounded-xl shadow">
              <p className="text-gray-700">{car.description}</p>
            </div>
          )}
          {selectedTab === "specs" && (
            <div className="p-4 bg-white rounded-xl shadow">
              <h2 className="text-2xl font-semibold mb-4">Specifications</h2>
              <div className="grid md:grid-cols-2 gap-4 text-gray-700">
                <div>🚗 Seats: {car.seats}</div>
                <div>⚙️ Transmission: {car.transmission}</div>
                <div>⛽ Fuel Type: {car.fuelType}</div>
                <div>💰 Price Per Day: ₹{car.pricePerDay}</div>
              </div>
            </div>
          )}
          {selectedTab === "reviews" && (
            <div className="p-4 bg-white rounded-xl shadow space-y-4">
              <h2 className="text-2xl font-semibold mb-4">Customer Reviews</h2>
              <div className="space-y-3">
                <div className="p-4 border rounded-lg hover:shadow-lg transition">
                  <p>"Amazing car, smooth drive and very comfortable!"</p>
                  <p className="mt-2 font-semibold text-gray-700">- John D.</p>
                </div>
                <div className="p-4 border rounded-lg hover:shadow-lg transition">
                  <p>"Great experience! Highly recommend renting from here."</p>
                  <p className="mt-2 font-semibold text-gray-700">- Sarah K.</p>
                </div>
              </div>
            </div>
          )}

          {/* Features */}
          <div className="mt-6 p-4 bg-white rounded-xl shadow">
            <h2 className="text-2xl font-semibold mb-4">Features</h2>
            <div className="flex flex-wrap gap-3">
              {features.map((feat, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                >
                  {feat}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Pricing & Booking */}
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6 rounded-xl shadow-lg flex flex-col items-center">
            <p className="text-sm font-medium">Starting From</p>
            <p className="text-3xl font-bold my-2">₹{car.pricePerDay}/day</p>
            <button className="mt-4 bg-white text-green-700 font-semibold px-6 py-3 rounded-xl w-full hover:bg-gray-100 transition">
              Book Now
            </button>
          </div>
        </div>
      </div>

      {/* ===== MORE CARS ===== */}
      {moreCars.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-6">More Cars You May Like</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {moreCars.map((c) => (
              <div
                key={c._id}
                className="bg-white rounded-xl shadow p-4 cursor-pointer hover:shadow-lg transition"
                onClick={() => navigate(`/cars/${c._id}`)}
              >
                <img
                  src={c.images?.[0] || c.image}
                  alt={c.name}
                  className="w-full h-40 object-cover rounded-lg mb-3"
                />
                <h3 className="font-semibold text-gray-800">{c.name}</h3>
                <p className="text-gray-600">{c.brand}</p>
                <p className="text-green-700 font-bold">₹{c.pricePerDay}/day</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CarDetails;
