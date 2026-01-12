import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Shield, Star, Zap, MapPin, Calendar, Search, CheckCircle2 } from "lucide-react";
import { fetchCars } from "../Services/carApi";
import { getCarImage } from "../utils/imageUtils";

const Home = () => {
  const [featuredCars, setFeaturedCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchCars()
      .then((res) => {
        // Get top 3 most expensive/premium cars for display
        const sorted = res.data.cars
          .sort((a, b) => b.pricePerDay - a.pricePerDay)
          .slice(0, 3);
        setFeaturedCars(sorted);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate("/cars", { state: { search: searchQuery } });
  };

  return (
    <div className="w-full overflow-hidden bg-white">
      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://wallpapercave.com/wp/wp13583943.jpg"
            alt="Luxury Car Background"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/90" />
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 mt-20">
          <div className="flex flex-col lg:flex-row items-center gap-12">

            {/* Left Text */}
            <div className="lg:w-1/2 text-center lg:text-left space-y-6">
              <span className="inline-block py-1 px-3 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-200 text-sm font-medium backdrop-blur-md">
                ✨ Premium Car Rental Service
              </span>
              <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-none font-display">
                Drive the <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
                  Extraordinary
                </span>
              </h1>
              <p className="text-lg md:text-xl text-gray-300 max-w-xl mx-auto lg:mx-0 font-light leading-relaxed">
                Experience the thrill of driving the world's most exclusive vehicles.
                Unmatched performance, comfort, and style tailored for you.
              </p>
            </div>

            {/* Right Search Widget */}
            <div className="lg:w-1/2 w-full max-w-md mx-auto lg:mr-0">
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 md:p-8 rounded-3xl shadow-2xl">
                <h3 className="text-2xl font-bold text-white mb-6">Find your perfect car</h3>

                <form onSubmit={handleSearch} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                      <MapPin size={16} className="text-blue-400" /> Location
                    </label>
                    <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-blue-500 transition cursor-pointer hover:bg-white/10">
                      <option className="bg-gray-900">Ahmedabad, Gujarat</option>
                      <option className="bg-gray-900">Mumbai, Maharashtra (Coming Soon)</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                      <Search size={16} className="text-blue-400" /> Search Car
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. BMW, Audi, SUV..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-500 transition"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2 mt-4"
                  >
                    Search Availability <ArrowRight size={20} />
                  </button>
                </form>
              </div>
            </div>

          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-white/50 hidden md:block">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-2 bg-white/50 rounded-full mt-2" />
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US (Bento Grid) */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-bold text-gray-900 tracking-tight">Why Choose Carent?</h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">
              We don't just rent cars; we provide an unforgettable driving experience with zero hassle.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group p-8 rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Shield size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Premium Insurance</h3>
              <p className="text-gray-500 leading-relaxed">
                Drive with peace of mind. All our rentals include comprehensive insurance coverage at no extra cost to you.
              </p>
            </div>

            <div className="group p-8 rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Instant Booking</h3>
              <p className="text-gray-500 leading-relaxed">
                No paperwork, no waiting. Book your dream car in minutes through our seamless digital platform.
              </p>
            </div>

            <div className="group p-8 rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Star size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Top Condition</h3>
              <p className="text-gray-500 leading-relaxed">
                Each vehicle is meticulously maintained and sanitized before delivery to ensure a showroom experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED CARS PREVIEW */}
      <section className="py-24 bg-[#0F172A] text-white relative overflow-hidden">
        {/* Background accent */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <span className="text-blue-400 font-semibold tracking-wider uppercase text-sm">Our Fleet</span>
              <h2 className="text-4xl font-bold mt-2">Featured Machines</h2>
            </div>
            <Link to="/cars" className="bg-white/10 hover:bg-white/20 px-6 py-3 rounded-full backdrop-blur-md transition flex items-center gap-2 text-sm font-medium">
              View All Cars <ArrowRight size={18} />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="aspect-[4/3] bg-white/5 rounded-2xl animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredCars.map((car, idx) => (
                <div
                  key={idx}
                  onClick={() => navigate(`/cars/${car._id}`)}
                  className="group relative rounded-2xl overflow-hidden aspect-[4/3] cursor-pointer border border-white/10 hover:border-blue-500/50 transition-all"
                >
                  <img
                    src={getCarImage(car)}
                    alt={car.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                  <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-2 group-hover:translate-y-0 transition-transform">
                    <h3 className="text-2xl font-bold">{car.name}</h3>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-blue-400 font-bold text-lg">₹{car.pricePerDay} <span className="text-white/60 text-sm font-normal">/ day</span></p>
                      <span className="bg-white/20 backdrop-blur-md p-2 rounded-full transform scale-0 group-hover:scale-100 transition-transform duration-300">
                        <ArrowRight size={16} />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* APP DOWNLOAD / TESTIMONIALS */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="bg-blue-600 rounded-3xl p-12 md:p-20 relative overflow-hidden text-center md:text-left shadow-2xl shadow-blue-900/20">
            {/* Decorative Circles */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>

            <div className="relative z-10 max-w-2xl">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Ready to hit the road?</h2>
              <p className="text-blue-100 text-lg mb-8 leading-relaxed">
                Join thousands of happy customers who have found their perfect ride with Carent.
                Experience luxury, comfort, and speed today.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link
                  to="/cars"
                  className="px-8 py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-gray-100 transition shadow-lg flex items-center justify-center gap-2"
                >
                  Start Booking Now
                </Link>
                <Link
                  to="/contact"
                  className="px-8 py-4 bg-blue-700 text-white font-semibold rounded-xl border border-blue-500 hover:bg-blue-800 transition flex items-center justify-center"
                >
                  Contact Support
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS (Static for now) */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">Loved by Drivers</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Rahul Sharma", role: "Business Traveler", text: "The service was impeccable. The BMW 5 Series was in pristine condition. Highly recommended for corporate travel." },
              { name: "Priya Patel", role: "Weekend Explorer", text: "Booked a Thar for a weekend trip to Gir. Seamless process, zero hidden charges, and the car was a beast!" },
              { name: "Amit Verma", role: "Car Enthusiast", text: "Finally a rental service that understands cars. The Audi collection is superb. Will definitely rent again." }
            ].map((t, i) => (
              <div key={i} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map(s => <Star key={s} size={16} className="text-yellow-400 fill-yellow-400" />)}
                </div>
                <p className="text-gray-600 mb-6 italic">"{t.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-500">
                    {t.name[0]}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{t.name}</h4>
                    <p className="text-xs text-gray-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
