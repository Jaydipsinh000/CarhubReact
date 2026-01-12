import React from "react";
import { Link } from "react-router-dom";
import { Users, Car, MapPin, Award, ArrowRight } from "lucide-react";

const About = () => {
  return (
    <div className="bg-white overflow-hidden">
      {/* HERO SECTION */}
      <section className="relative h-[60vh] flex items-center justify-center">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1966&auto=format&fit=crop"
            alt="About Hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        </div>

        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto space-y-6">
          <span className="text-blue-400 font-bold tracking-widest uppercase text-sm">Our Story</span>
          <h1 className="text-5xl md:text-7xl font-bold font-display leading-tight">
            Redefining the <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-white">Art of Driving</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 font-light">
            We believe every journey should be an experience. From the roar of the engine to the comfort of the cabin, we curate moments, not just rentals.
          </p>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="py-12 bg-white -mt-20 relative z-20 container mx-auto px-4">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-12 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center divide-x divide-gray-100">
          <div className="space-y-2">
            <h3 className="text-4xl md:text-5xl font-bold text-blue-600">50+</h3>
            <p className="text-gray-500 font-medium">Premium Vehicles</p>
          </div>
          <div className="space-y-2">
            <h3 className="text-4xl md:text-5xl font-bold text-blue-600">10k+</h3>
            <p className="text-gray-500 font-medium">Happy Journeys</p>
          </div>
          <div className="space-y-2">
            <h3 className="text-4xl md:text-5xl font-bold text-blue-600">5</h3>
            <p className="text-gray-500 font-medium">Years Excellence</p>
          </div>
          <div className="space-y-2">
            <h3 className="text-4xl md:text-5xl font-bold text-blue-600">24/7</h3>
            <p className="text-gray-500 font-medium">Roadside Support</p>
          </div>
        </div>
      </section>

      {/* VISION & MISSION */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1 relative">
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-100 rounded-full blur-3xl opacity-50"></div>
              <img
                src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=2072&auto=format&fit=crop"
                alt="Our Vision"
                className="rounded-3xl shadow-2xl relative z-10 w-full object-cover h-[500px]"
              />
              <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-purple-100 rounded-full blur-3xl opacity-50"></div>
            </div>

            <div className="order-1 md:order-2 space-y-8">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">Driven by Passion</h2>
                <p className="text-gray-500 text-lg leading-relaxed">
                  Carent was born from a simple idea: Luxury shouldn't be inaccessible. We wanted to create a platform where anyone could experience the thrill of driving their dream car without the burdens of ownership.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                    <Award size={24} />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900">Excellence First</h4>
                    <p className="text-gray-500">We never compromise on the quality of our fleet. Every car is vetted for perfection.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                    <Users size={24} />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900">Customer Centric</h4>
                    <p className="text-gray-500">Your journey matters. From booking to drop-off, we ensure a seamless experience.</p>
                  </div>
                </div>
              </div>

              <Link to="/contact" className="inline-flex items-center gap-2 text-blue-600 font-bold hover:gap-3 transition-all">
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
          <h2 className="text-4xl md:text-5xl font-bold mb-8">Experience the Difference</h2>
          <Link
            to="/cars"
            className="inline-block px-10 py-4 bg-white text-black font-bold rounded-full hover:bg-blue-500 hover:text-white transition-all transform hover:scale-105 shadow-xl"
          >
            Explore Our Fleet
          </Link>
        </div>
      </section>
    </div>
  );
};

export default About;
