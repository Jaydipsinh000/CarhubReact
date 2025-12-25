import React from "react";
import { Link } from "react-router-dom";

const token =localStorage.getItem("token");
const Home = () => {
  return (
    <div className="w-full">
      {/* HERO */}
      <section className="min-h-screen bg-[url('https://wallpapercave.com/wp/wp13583943.jpg')] bg-cover bg-center flex items-center justify-center">
        <div className="backdrop-blur-lg bg-black/50 text-white p-10 rounded-2xl max-w-2xl text-center shadow-2xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Find Your <span className="text-yellow-400">Perfect Drive</span>
          </h1>
          <p className="text-gray-300 mb-8">
            Premium cars curated for your lifestyle, mood and journey. Not just
            renting — an experience.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/cars"
              className="px-6 py-3 bg-yellow-400 text-black font-semibold rounded-lg hover:bg-yellow-500 transition"
            >
              Explore Cars
            </Link>

            {!token ? (
              // 🔹 BEFORE LOGIN / REGISTER
              <Link
                to="/register"
                className="px-6 py-3 border border-white rounded-lg hover:bg-white hover:text-black transition"
              >
                Get Started
              </Link>
            ) : (
              // 🔹 AFTER LOGIN / REGISTER
              <Link
                to="/contact"
                className="px-6 py-3 border border-white rounded-lg hover:bg-white hover:text-black transition"
              >
                Get in Touch
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* FIND MY CAR */}
      <section className="py-20 bg-gray-950 text-white text-center">
        <h2 className="text-3xl font-bold mb-2">
          Find <span className="text-yellow-400">My Car</span>
        </h2>
        <p className="text-gray-400 mb-10">
          Answer few questions and we’ll recommend the best car for you.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto px-6">
          {[
            "💰 Budget Friendly",
            "👨‍👩‍👧 Family Ride",
            "🔥 Luxury Feel",
            "🌄 Long Trip",
          ].map((item, i) => (
            <div
              key={i}
              className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-yellow-400 hover:scale-105 transition cursor-pointer"
            >
              {item}
            </div>
          ))}
        </div>
      </section>

      {/* WHY CARENT */}
      <section className="py-20 bg-black text-white">
        <h2 className="text-3xl font-bold text-center mb-12">
          Why <span className="text-yellow-400">Carent</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-6">
          <div className="bg-gray-900 p-8 rounded-xl border border-gray-800 hover:border-yellow-400 transition">
            <h3 className="text-xl font-semibold mb-3">🚗 Curated Cars</h3>
            <p className="text-gray-400">
              Only top condition, premium maintained vehicles.
            </p>
          </div>

          <div className="bg-gray-900 p-8 rounded-xl border border-gray-800 hover:border-yellow-400 transition">
            <h3 className="text-xl font-semibold mb-3">
              🧠 Smart Recommendation
            </h3>
            <p className="text-gray-400">
              Cars suggested based on your needs, not random listings.
            </p>
          </div>

          <div className="bg-gray-900 p-8 rounded-xl border border-gray-800 hover:border-yellow-400 transition">
            <h3 className="text-xl font-semibold mb-3">🔐 Secure & Verified</h3>
            <p className="text-gray-400">
              OTP based login, verified users and cars.
            </p>
          </div>
        </div>
      </section>

      {/* FEATURED CARS */}
      <section className="py-20 bg-gray-950 text-white">
        <h2 className="text-3xl font-bold text-center mb-12">
          Featured <span className="text-yellow-400">Experiences</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-6">
          {[
            {
              img: "https://wallpapercave.com/wp/wp5052561.jpg",
              name: "BMW X5",
              desc: "Perfect for luxury highway drives",
            },
            {
              img: "https://wallpapercave.com/wp/wp10683432.jpg",
              name: "Audi A6",
              desc: "Executive comfort & class",
            },
            {
              img: "https://wallpapercave.com/wp/wp13496427.jpg",
              name: "Range Rover",
              desc: "Power, presence & performance",
            },
          ].map((car, i) => (
            <div
              key={i}
              className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-yellow-400 transition"
            >
              <img
                src={car.img}
                alt={car.name}
                className="h-56 w-full object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold">{car.name}</h3>
                <p className="text-gray-400 mt-2">{car.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
