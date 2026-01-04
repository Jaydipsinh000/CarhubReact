import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchCarById, fetchCars, checkAvailability } from "../Services/carApi";

const CarDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [car, setCar] = useState(null);
  const [moreCars, setMoreCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("overview");
  const [imgIndex, setImgIndex] = useState(0);

  // Booking states
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [totalDays, setTotalDays] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [availability, setAvailability] = useState(null);

  // Load car data
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchCarById(id);
        const all = await fetchCars();
        setCar(res.data.car);
        setMoreCars(all.data.cars.filter((c) => c._id !== id).slice(0, 4));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  // Calculate total days & price
  useEffect(() => {
    if (startDate && endDate && car) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = end - start;
      const days = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

      if (days > 0) {
        setTotalDays(days);
        setTotalPrice(days * car.pricePerDay);
      } else {
        setTotalDays(0);
        setTotalPrice(0);
      }
    }
  }, [startDate, endDate, car]);

  // Check availability
  const handleCheckAvailability = async () => {
    if (!startDate || !endDate) {
      alert("Please select start and end dates");
      return;
    }
    try {
      const res = await checkAvailability({
        carId: car._id,
        startDate,
        endDate,
      });
      if (!res.data.available) {
        setAvailability(false);
        alert("❌ Car not available for selected dates");
      } else {
        setAvailability(true);
        alert("✅ Car is available, proceed to book");
      }
    } catch (err) {
      console.error(err);
      alert("Error checking availability");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <span className="animate-spin h-10 w-10 border-b-2 border-black rounded-full"></span>
      </div>
    );
  }

  if (!car) return <p className="text-center mt-20">Car not found</p>;

  // Helper for safe image resolution
  const getCarImage = (imagePath) => {
    if (!imagePath || typeof imagePath !== 'string') {
      return "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=1000";
    }
    if (imagePath.startsWith("http")) return imagePath;

    // Normalize path: replace backslashes, remove leading slashes
    let cleanPath = imagePath.replace(/\\/g, "/");
    while (cleanPath.startsWith("/")) cleanPath = cleanPath.substring(1);

    // Ensure it starts with uploads/
    if (!cleanPath.startsWith("uploads/")) {
      cleanPath = `uploads/${cleanPath}`;
    }

    const baseUrl = import.meta.env.VITE_IMAGE_BASE_URL || "https://carent-qdwb.onrender.com";
    const normalizedBase = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
    return `${normalizedBase}/${cleanPath}`;
  };

  const images = car.images?.length ? car.images : [car.image];
  const features = car.features || [
    "GPS Navigation",
    "Bluetooth",
    "Air Conditioning",
    "Music System",
    "ABS",
    "Airbags",
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* HERO */}
      <div className="max-w-7xl mx-auto px-4 pt-10">
        <div className="grid lg:grid-cols-2 gap-10">
          {/* IMAGE */}
          <div>
            <div className="relative overflow-hidden rounded-3xl shadow-xl bg-black">
              <div className="aspect-[16/9]">
                <img
                  src={getCarImage(images[imgIndex])}
                  alt={car.name}
                  className="w-full h-full object-contain sm:object-cover"
                />
              </div>

              {images.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setImgIndex(
                        imgIndex === 0 ? images.length - 1 : imgIndex - 1
                      )
                    }
                    className="absolute left-3 top-1/2 bg-white p-2 rounded-full"
                  >
                    ❮
                  </button>
                  <button
                    onClick={() =>
                      setImgIndex(
                        imgIndex === images.length - 1 ? 0 : imgIndex + 1
                      )
                    }
                    className="absolute right-3 top-1/2 bg-white p-2 rounded-full"
                  >
                    ❯
                  </button>
                </>
              )}

              <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-3 py-1 rounded-full">
                {imgIndex + 1} / {images.length}
              </div>
            </div>

            {images.length > 1 && (
              <div className="mt-4 flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {images.map((img, i) => (
                  <img
                    key={i}
                    src={images[imgIndex]}
                    onClick={() => setImgIndex(i)}
                    className={`h-20 w-28 sm:h-24 sm:w-32 object-cover rounded-xl cursor-pointer border-2 transition-all ${imgIndex === i
                      ? "border-blue-600 scale-105"
                      : "border-transparent hover:border-gray-300"
                      }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* INFO */}
          <div className="space-y-6">
            <h1 className="text-4xl font-extrabold">{car.name}</h1>
            <p className="text-gray-500 text-lg">{car.brand}</p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <span>🚗 Seats: {car.seats}</span>
              <span>⚙️ {car.transmission}</span>
              <span>⛽ {car.fuelType}</span>
              <span>🛡 Insurance Included</span>
            </div>
            <div className="flex gap-4 text-sm text-gray-600">
              <span>✔ Free Cancellation</span>
              <span>✔ 24x7 Support</span>
              <span>✔ Sanitized Cars</span>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT + BOOKING */}
      <div className="max-w-7xl mx-auto px-4 py-14 grid lg:grid-cols-3 gap-10">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-8">
          {/* Tabs */}
          <div className="flex gap-6 border-b">
            {["overview", "specs", "reviews"].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`pb-3 font-semibold ${tab === t
                  ? "border-b-2 border-black text-black"
                  : "text-gray-500"
                  }`}
              >
                {t.toUpperCase()}
              </button>
            ))}
          </div>

          {tab === "overview" && (
            <p className="text-gray-700 leading-relaxed">
              {car.description ||
                "Experience luxury, comfort and performance with this premium rental car."}
            </p>
          )}

          {tab === "specs" && (
            <div className="grid sm:grid-cols-2 gap-4">
              <div>🚗 Seats: {car.seats}</div>
              <div>⚙️ Transmission: {car.transmission}</div>
              <div>⛽ Fuel: {car.fuelType}</div>
              <div>💰 ₹{car.pricePerDay.toLocaleString("en-IN")} / day</div>
            </div>
          )}

          {tab === "reviews" && (
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-xl shadow">
                ⭐⭐⭐⭐⭐ <p>Excellent car, smooth drive!</p>
              </div>
              <div className="bg-white p-4 rounded-xl shadow">
                ⭐⭐⭐⭐☆ <p>Clean & well maintained.</p>
              </div>
            </div>
          )}

          {/* Features */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Features</h2>
            <div className="flex flex-wrap gap-3">
              {features.map((f, i) => (
                <span
                  key={i}
                  className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm"
                >
                  {f}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* BOOKING CARD */}
        <div className="sticky top-24 h-fit">
          <div className="bg-white rounded-3xl shadow-xl p-6 space-y-6">
            <div className="text-center">
              <p className="text-gray-500">Price per day</p>
              <p className="text-4xl font-extrabold text-green-600">
                ₹{car.pricePerDay.toLocaleString("en-IN")}
              </p>
            </div>

            <button
              onClick={() => navigate(`/book/${car._id}`)}
              className="w-full bg-black text-white py-4 rounded-xl text-lg font-semibold hover:bg-gray-900 transition"
            >
              Book Now
            </button>
          </div>
        </div>
      </div>

      {/* MORE CARS */}
      {moreCars.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 pb-20">
          <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {moreCars.map((c) => (
              <div
                key={c._id}
                onClick={() => navigate(`/cars/${c._id}`)}
                className="bg-white rounded-xl shadow hover:shadow-lg cursor-pointer transition"
              >
                <img
                  src={c.image}
                  className="h-40 w-full object-cover rounded-t-xl"
                  alt={c.name}
                />
                <div className="p-4">
                  <h3 className="font-semibold">{c.name}</h3>
                  <p className="text-gray-500 text-sm">{c.brand}</p>
                  <p className="font-bold text-green-600">
                    ₹{c.pricePerDay.toLocaleString("en-IN")}/day
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CarDetails;
