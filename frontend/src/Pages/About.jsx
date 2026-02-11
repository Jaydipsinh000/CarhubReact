import React from "react";
import { Link } from "react-router-dom";
import { Users, Car, MapPin, Award, ArrowRight, CheckCircle2 } from "lucide-react";

const About = () => {
  return (
    <div className="bg-white overflow-hidden">
      {/* HERO SECTION */}
      <section className="relative h-[60vh] md:h-[70vh] flex items-center justify-center">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1966&auto=format&fit=crop"
            alt="About Hero"
            className="w-full h-full object-cover attachment-fixed"
          />
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        </div>

        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto space-y-6">
          <span className="inline-block py-1 px-3 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-200 text-xs md:text-sm font-medium backdrop-blur-md uppercase tracking-widest">
            Our Story
          </span>
          <h1 className="text-4xl md:text-7xl font-bold font-display leading-tight">
            Redefining the <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-white">
              Art of Driving
            </span>
          </h1>
          <p className="text-base md:text-xl text-gray-300 font-light max-w-2xl mx-auto leading-relaxed">
            We believe every journey should be an experience. From the roar of the engine to the comfort of the cabin, we curate moments, not just rentals.
          </p>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="py-12 bg-white -mt-16 md:-mt-20 relative z-20 container mx-auto px-4">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x-0 md:divide-x divide-gray-100">
          <div className="space-y-2">
            <h3 className="text-3xl md:text-5xl font-black text-blue-600">50+</h3>
            <p className="text-gray-500 font-medium text-sm md:text-base">Premium Vehicles</p>
          </div>
          <div className="space-y-2">
            <h3 className="text-3xl md:text-5xl font-black text-blue-600">10k+</h3>
            <p className="text-gray-500 font-medium text-sm md:text-base">Happy Journeys</p>
          </div>
          <div className="space-y-2">
            <h3 className="text-3xl md:text-5xl font-black text-blue-600">5</h3>
            <p className="text-gray-500 font-medium text-sm md:text-base">Years Excellence</p>
          </div>
          <div className="space-y-2">
            <h3 className="text-3xl md:text-5xl font-black text-blue-600">24/7</h3>
            <p className="text-gray-500 font-medium text-sm md:text-base">Roadside Support</p>
          </div>
        </div>
      </section>

      {/* VISION & MISSION */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">

            {/* Image Side */}
            <div className="order-2 md:order-1 relative">
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-100 rounded-full blur-3xl opacity-50"></div>
              <img
                src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=2072&auto=format&fit=crop"
                alt="Our Vision"
                className="rounded-3xl shadow-2xl relative z-10 w-full object-cover h-[400px] md:h-[600px]"
              />
              <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-purple-100 rounded-full blur-3xl opacity-50"></div>

              {/* Floating Card */}
              <div className="absolute bottom-8 left-8 right-8 md:right-auto md:w-64 bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-xl z-20 border border-white/50">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-green-100 p-2 rounded-full text-green-600">
                    <CheckCircle2 size={20} />
                  </div>
                  <span className="font-bold text-gray-900">Verified Quality</span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Every car undergoes a strict 150-point inspection before every rental.
                </p>
              </div>
            </div>

            {/* Text Side */}
            <div className="order-1 md:order-2 space-y-8">
              <div>
                <span className="text-blue-600 font-bold uppercase tracking-widest text-sm">Our Philosophy</span>
                <h2 className="text-3xl md:text-5xl font-black text-gray-900 mt-2 mb-6 leading-tight">Driven by <br /> <span className="text-blue-600">Passion & Precision</span></h2>
                <p className="text-gray-500 text-lg leading-relaxed">
                  Carent was born from a simple idea: Luxury shouldn't be inaccessible. We wanted to create a platform where anyone could experience the thrill of driving their dream car without the burdens of ownership.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex gap-5 group">
                  <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                    <Award size={28} />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-1">Excellence First</h4>
                    <p className="text-gray-500 text-sm md:text-base">We never compromise on the quality of our fleet. Every car is vetted for perfection.</p>
                  </div>
                </div>

                <div className="flex gap-5 group">
                  <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                    <Users size={28} />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-1">Customer Centric</h4>
                    <p className="text-gray-500 text-sm md:text-base">Your journey matters. From booking to drop-off, we ensure a seamless experience.</p>
                  </div>
                </div>
              </div>

              <Link to="/contact" className="inline-flex items-center gap-2 text-white bg-black px-8 py-4 rounded-full font-bold hover:bg-gray-800 transition-all shadow-lg hover:gap-4 mt-4">
                Join our journey <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gray-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-black mb-8">Experience the Difference</h2>
          <Link
            to="/cars"
            className="inline-block px-10 py-5 bg-white text-black font-bold rounded-full hover:bg-blue-500 hover:text-white transition-all transform hover:scale-105 shadow-xl md:text-lg"
          >
            Explore Our Fleet
          </Link>
        </div>
      </section>
    </div>
  );
};

export default About;
