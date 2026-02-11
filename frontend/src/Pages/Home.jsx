import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Shield, Star, Zap, MapPin, Calendar, Search, CheckCircle2, Play } from "lucide-react";
import { fetchCars } from "../Services/carApi";
import { getCarImage } from "../utils/imageUtils";
import CarLoader from "../Components/CarLoader";
import { motion } from "framer-motion";

const Home = () => {
  const [featuredCars, setFeaturedCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

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

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div className="w-full overflow-hidden bg-white">
      {/* --- HERO SECTION --- */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Image Background with Slow Zoom Effect */}
        <div className="absolute inset-0 z-0">
          <motion.img
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 10, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
            src="https://www.hdcarwallpapers.com/download/alpine_white_bmw_f82_m4-1920x1080.jpg"
            alt="Luxury Car Background"
            className="w-full h-full object-cover object-[75%] md:object-center"
          />
          {/* Gradient Overlays for better text visibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/90" />
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 mt-20 md:mt-0">
          <div className="flex flex-col lg:flex-row items-center gap-12 py-20 lg:py-0">

            {/* Left Text */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="lg:w-1/2 text-center lg:text-left space-y-6"
            >
              <motion.div variants={fadeInUp}>
                <span className="inline-flex items-center gap-2 py-1 px-3 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-200 text-xs font-bold backdrop-blur-md">
                  <Star size={12} className="fill-blue-200" /> PREMIUM FLEET
                </span>
              </motion.div>

              <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tight leading-none md:leading-[0.9] font-display">
                OWN THE <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-200 to-white">
                  MOMENT
                </span>
              </motion.h1>

              <motion.p variants={fadeInUp} className="text-base md:text-xl text-gray-300 max-w-lg mx-auto lg:mx-0 font-light leading-relaxed">
                Experience the thrill of driving the world's most exclusive vehicles.
                Unmatched performance, comfort, and style.
              </motion.p>

              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/cars" className="px-8 py-4 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2">
                  View Fleet <ArrowRight size={20} />
                </Link>
                <button
                  onClick={() => document.getElementById('how-it-works').scrollIntoView({ behavior: 'smooth' })}
                  className="px-8 py-4 bg-white/10 text-white font-bold rounded-full hover:bg-white/20 backdrop-blur-md transition border border-white/10 flex items-center justify-center gap-2"
                >
                  <Play size={18} /> How it Works
                </button>
              </motion.div>
            </motion.div>

            {/* Right Search Widget */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:w-1/2 w-full max-w-md mx-auto lg:mr-0"
            >
              <div className="bg-white/5 backdrop-blur-2xl border border-white/10 p-6 md:p-8 rounded-3xl shadow-2xl">
                <h3 className="text-2xl font-bold text-white mb-6">Find your perfect drive</h3>

                <form onSubmit={handleSearch} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                      <MapPin size={14} className="text-blue-400" /> Pick-up Location
                    </label>
                    <div className="relative">
                      <select className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-blue-500 transition cursor-pointer appearance-none">
                        <option className="bg-gray-900">Ahmedabad, Gujarat</option>
                        {/* <option className="bg-gray-900">Mumbai, Maharashtra (Coming Soon)</option> */}
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                        <ArrowRight size={14} className="rotate-90" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                      <Search size={14} className="text-blue-400" /> Search Model
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. BMW, Audi, Thar..."
                      className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-500 transition"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-blue-50 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2 mt-4 shadow-lg"
                  >
                    Check Availability <ArrowRight size={20} />
                  </button>
                </form>
              </div>
            </motion.div>

          </div>
        </div>


      </section>

      {/* --- HOW IT WORKS --- */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-blue-600 font-bold uppercase tracking-widest text-sm">Simple Process</span>
            <h2 className="text-4xl font-black text-gray-900 mt-2 mb-4">Rent your dream car in 3 steps</h2>
            <p className="text-gray-500">We've simplified the rental process so you can get behind the wheel faster.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connector Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gray-100 -z-10"></div>

            {[
              { icon: <Search size={32} />, title: "Choose Your Car", desc: "Browse our premium fleet and pick the vehicle that matches your style." },
              { icon: <Calendar size={32} />, title: "Book Your Dates", desc: "Select pick-up dates and location. Our booking process is 100% online." },
              { icon: <Zap size={32} />, title: "Drive Away", desc: "Pick up your car from our hub or get it delivered to your doorstep." }
            ].map((step, idx) => (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                key={idx}
                className="bg-white p-6 rounded-3xl text-center"
              >
                <div className="w-24 h-24 mx-auto bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6 shadow-sm border border-blue-100 relative">
                  {step.icon}
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold text-sm border-4 border-white">
                    {idx + 1}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-500 leading-relaxed text-sm">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FEATURED CARS --- */}
      <section className="py-24 bg-[#0F172A] text-white relative overflow-hidden">
        {/* Background accent */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <span className="text-blue-400 font-bold tracking-widest uppercase text-sm">Our Fleet</span>
              <h2 className="text-4xl md:text-5xl font-black mt-2 font-display">Featured Machines</h2>
            </div>
            <Link to="/cars" className="bg-white/10 hover:bg-white/20 px-8 py-4 rounded-full backdrop-blur-md transition flex items-center gap-2 text-sm font-bold">
              View All Cars <ArrowRight size={18} />
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <CarLoader />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredCars.map((car, idx) => (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  key={idx}
                  onClick={() => navigate(`/cars/${car._id}`)}
                  className="group relative rounded-3xl overflow-hidden aspect-[4/3] cursor-pointer border border-white/10 hover:border-blue-500/50 transition-all bg-white/5"
                >
                  <img
                    src={getCarImage(car)}
                    alt={car.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                  <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 group-hover:translate-y-0 transition-transform">
                    <h3 className="text-2xl font-bold">{car.name}</h3>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-end gap-1">
                        <span className="text-blue-400 font-bold text-xl">₹{car.pricePerDay.toLocaleString()}</span>
                        {car.listingType !== "Sell" && <span className="text-white/60 text-sm font-medium mb-1">/day</span>}
                      </div>
                      <span className="bg-white/20 backdrop-blur-md p-2 rounded-full transform scale-0 group-hover:scale-100 transition-transform duration-300">
                        <ArrowRight size={16} />
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* --- WHY CHOOSE US --- */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-blue-600 font-bold uppercase tracking-widest text-sm">Why Choose Us</span>
              <h2 className="text-4xl font-black text-gray-900 mt-2 mb-6">We don't just rent cars, <br /> we curate experiences.</h2>
              <p className="text-gray-500 text-lg leading-relaxed mb-8">
                From 24/7 support to comprehensive insurance, we handle the details so you can focus on the drive.
              </p>

              <div className="space-y-6">
                {[
                  { icon: <Shield size={24} />, title: "Premium Insurance", desc: "Full coverage included for peace of mind." },
                  { icon: <Zap size={24} />, title: "Instant Booking", desc: "Digital process. No paperwork. No waiting." },
                  { icon: <Star size={24} />, title: "Top Condition", desc: "Showroom-fresh vehicles, sanitized every time." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-12 h-12 bg-white text-blue-600 rounded-xl flex items-center justify-center shrink-0 shadow-sm border border-gray-100">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg">{item.title}</h4>
                      <p className="text-gray-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -top-10 -right-10 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-50"></div>
              <img
                src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=2070&auto=format&fit=crop"
                className="rounded-3xl shadow-2xl relative z-10 w-full"
                alt="Luxury Interior"
              />
              <div className="absolute bottom-10 -left-10 bg-white p-6 rounded-2xl shadow-xl z-20 max-w-xs animate-bounce hidden md:block">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <p className="font-bold text-gray-900">Available Now</p>
                </div>
                <p className="text-gray-500 text-sm">Over 50+ luxury models ready for instant booking.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- APP DOWNLOAD / CTA --- */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-blue-700 to-blue-600 rounded-[3rem] p-12 md:p-24 relative overflow-hidden text-center md:text-left shadow-2xl shadow-blue-900/20">
            {/* Decorative */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>

            <div className="relative z-10 max-w-3xl">
              <h2 className="text-3xl md:text-6xl font-black text-white mb-6 leading-tight">Ready to hit the road?</h2>
              <p className="text-blue-100 text-xl mb-10 leading-relaxed max-w-lg">
                Join thousands of happy customers who have found their perfect ride with Carent.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link
                  to="/cars"
                  className="px-8 py-4 bg-white text-blue-900 font-bold rounded-2xl hover:bg-gray-50 transition shadow-xl flex items-center justify-center gap-2 transform active:scale-95"
                >
                  Start Booking Now <ArrowRight size={20} />
                </Link>
                <Link
                  to="/contact"
                  className="px-8 py-4 bg-blue-800/40 backdrop-blur-md text-white font-bold rounded-2xl border border-white/20 hover:bg-blue-800/60 transition flex items-center justify-center transform active:scale-95"
                >
                  Contact Support
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
