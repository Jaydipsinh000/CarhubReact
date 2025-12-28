import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchCarById, fetchCars } from "../Services/carApi";

const CarDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [car, setCar] = useState(null);
  const [moreCars, setMoreCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("overview");
  const [imgIndex, setImgIndex] = useState(0);

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <span className="animate-spin h-10 w-10 border-b-2 border-black rounded-full"></span>
      </div>
    );
  }

  if (!car) return <p className="text-center mt-20">Car not found</p>;

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
      {/* ===== HERO SECTION ===== */}
      <div className="max-w-7xl mx-auto px-4 pt-10">
        <div className="grid lg:grid-cols-2 gap-10">
          
          {/* ===== HERO IMAGE GALLERY ===== */}
          <div className="w-full">
            {/* MAIN IMAGE */}
            <div className="relative w-full overflow-hidden rounded-3xl shadow-xl bg-black">
              <div className="aspect-[16/9] sm:aspect-[4/3] lg:aspect-[16/9]">
                <img
                  src={images[imgIndex]}
                  alt={car.name}
                  className="w-full h-full object-contain sm:object-cover transition-all duration-500"
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
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow"
                  >
                    ❮
                  </button>

                  <button
                    onClick={() =>
                      setImgIndex(
                        imgIndex === images.length - 1 ? 0 : imgIndex + 1
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow"
                  >
                    ❯
                  </button>
                </>
              )}

              {/* Image Counter */}
              <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-3 py-1 rounded-full">
                {imgIndex + 1} / {images.length}
              </div>
            </div>

            {/* THUMBNAILS */}
            {images.length > 1 && (
              <div className="mt-4 flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {images.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    onClick={() => setImgIndex(i)}
                    className={`h-20 w-28 sm:h-24 sm:w-32 object-cover rounded-xl cursor-pointer border-2 transition-all ${
                      imgIndex === i
                        ? "border-blue-600 scale-105"
                        : "border-transparent hover:border-gray-300"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-6">
            <h1 className="text-4xl font-extrabold">{car.name}</h1>
            <p className="text-gray-500 text-lg">{car.brand}</p>

            {/* Quick Specs */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <span>🚗 Seats: {car.seats || 5}</span>
              <span>⚙️ {car.transmission || "Automatic"}</span>
              <span>⛽ {car.fuelType}</span>
              <span>🛡 Insurance Included</span>
            </div>

            {/* Trust badges */}
            <div className="flex gap-4 text-sm text-gray-600">
              <span>✔ Free Cancellation</span>
              <span>✔ 24x7 Support</span>
              <span>✔ Sanitized Cars</span>
            </div>
          </div>
        </div>
      </div>

      {/* ===== CONTENT + BOOKING ===== */}
      <div className="max-w-7xl mx-auto px-4 py-14 grid lg:grid-cols-3 gap-10">
        {/* LEFT CONTENT */}
        <div className="lg:col-span-2 space-y-8">
          {/* Tabs */}
          <div className="flex gap-6 border-b">
            {["overview", "specs", "reviews"].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`pb-3 font-semibold ${
                  tab === t
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
                "Experience luxury, comfort and performance with this premium rental car. Perfect for city rides and long journeys."}
            </p>
          )}

          {tab === "specs" && (
            <div className="grid sm:grid-cols-2 gap-4">
              <div>🚗 Seats: {car.seats}</div>
              <div>⚙️ Transmission: {car.transmission}</div>
              <div>⛽ Fuel: {car.fuelType}</div>
              <div>💰 ₹{car.pricePerDay} / day</div>
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
              <p className="text-gray-500">Starting From</p>
              <p className="text-4xl font-extrabold text-green-600">
                ₹{car.pricePerDay}
              </p>
              <p className="text-sm text-gray-500">per day</p>
            </div>

            <button className="w-full bg-black text-white py-3 rounded-xl text-lg hover:opacity-90">
              Book Now
            </button>

            <button onClick={() => navigate("/contact")} className="w-full border py-3 rounded-xl">
              Contact Support
            </button>
          </div>
        </div>
      </div>

      {/* ===== MORE CARS ===== */}
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
                />
                <div className="p-4">
                  <h3 className="font-semibold">{c.name}</h3>
                  <p className="text-gray-500 text-sm">{c.brand}</p>
                  <p className="font-bold text-green-600">
                    ₹{c.pricePerDay}/day
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
