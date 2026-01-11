import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Shield, Star, Zap } from "lucide-react";

const Home = () => {
  const token = localStorage.getItem("token");

  return (
    <div className="w-full overflow-hidden">
      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1503376763036-066120622c74?q=80&w=2070&auto=format&fit=crop"
            alt="Luxury Car Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/90" />
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="animate-fade-in space-y-6 max-w-4xl mx-auto">
            <span className="inline-block py-1 px-3 rounded-full bg-white/10 border border-white/20 text-white/80 text-sm font-medium backdrop-blur-md mb-4">
              Premium Car Rental Service
            </span>
            <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-tight">
              Elevate Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
                Journey
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto font-light">
              Experience the thrill of driving the world's most exclusive vehicles.
              Unmatched performance, comfort, and style tailored for you.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Link
                to="/cars"
                className="group relative px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-gray-100 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center justify-center gap-2"
              >
                Explore Fleet <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              {!token ? (
                <Link
                  to="/register"
                  className="px-8 py-4 bg-white/10 backdrop-blur-md text-white font-semibold rounded-full border border-white/20 hover:bg-white/20 transition-all flex items-center justify-center"
                >
                  Create Account
                </Link>
              ) : (
                <Link
                  to="/contact"
                  className="px-8 py-4 bg-white/10 backdrop-blur-md text-white font-semibold rounded-full border border-white/20 hover:bg-white/20 transition-all flex items-center justify-center"
                >
                  Contact Support
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-white/50">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-2 bg-white/50 rounded-full mt-2" />
          </div>
        </div>
      </section>

      {/* FEATURES SECTION (Bento Grid) */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-bold text-gray-900">Why Choose Carent?</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              We don't just rent cars; we provide an unforgettable driving experience with zero hassle.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:border-blue-100 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300">
              <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Shield size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Premium Insurance</h3>
              <p className="text-gray-500 leading-relaxed">
                Drive with peace of mind. All our rentals include comprehensive insurance coverage at no extra cost.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:border-blue-100 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300">
              <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Instant Booking</h3>
              <p className="text-gray-500 leading-relaxed">
                No paperwork, no waiting. Book your dream car in minutes through our seamless digital platform.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:border-blue-100 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300">
              <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
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
      <section className="py-24 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <span className="text-blue-400 font-semibold tracking-wider uppercase text-sm">Our Fleet</span>
              <h2 className="text-4xl font-bold mt-2">Featured Machines</h2>
            </div>
            <Link to="/cars" className="bg-white/10 hover:bg-white/20 px-6 py-3 rounded-full backdrop-blur-md transition flex items-center gap-2">
              View All Cars <ArrowRight size={18} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Porsche 911 GT3",
                price: "₹45,000",
                img: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=2071&auto=format&fit=crop"
              },
              {
                name: "Mercedes-AMG GT",
                price: "₹38,000",
                img: "https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=2070&auto=format&fit=crop"
              },
              {
                name: "Audi RS e-tron GT",
                price: "₹42,000",
                img: "https://images.unsplash.com/photo-1603584173870-7b299f589889?q=80&w=2071&auto=format&fit=crop"
              }
            ].map((car, idx) => (
              <div key={idx} className="group relative rounded-2xl overflow-hidden aspect-[4/3] cursor-pointer">
                <img
                  src={car.img}
                  alt={car.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-6 translate-y-4 group-hover:translate-y-0 transition-transform">
                  <h3 className="text-xl font-bold">{car.name}</h3>
                  <p className="text-blue-400 font-medium">{car.price} <span className="text-white/60 text-sm font-normal">/ day</span></p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6 font-display">Ready to hit the road?</h2>
          <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto">
            Book your premium vehicle today and experience the difference.
            Flexible plans, transparent pricing, and 24/7 support.
          </p>
          <Link
            to="/cars"
            className="inline-flex items-center gap-2 px-10 py-5 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition shadow-lg shadow-blue-200 hover:shadow-xl hover:-translate-y-1"
          >
            Start Your Booking
          </Link>
        </div>

        {/* Abstract Background Design */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-100 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 opacity-60" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-100 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 opacity-60" />
      </section>
    </div>
  );
};

export default Home;
