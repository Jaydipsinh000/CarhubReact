import React from "react";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="bg-gray-50">
      {/* HERO SECTION */}
      <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-6 py-24 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            About <span className="text-yellow-300">CarRent</span>
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto opacity-90">
            Your trusted partner for premium, affordable, and reliable car rentals —
            anytime, anywhere.
          </p>
        </div>
      </section>

      {/* ABOUT CONTENT */}
      <section className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-14 items-center">
        {/* LEFT */}
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Who We Are
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            <strong>CarRent</strong> is a modern car rental platform built to make
            traveling simple, comfortable, and affordable. Whether you need a
            compact car for city travel or a luxury vehicle for special occasions,
            we provide a wide range of well-maintained vehicles to meet every need.
          </p>
          <p className="text-gray-600 leading-relaxed">
            With transparent pricing, verified vehicles, and seamless booking,
            CarRent ensures a stress-free rental experience backed by trusted
            customer support.
          </p>
        </div>

        {/* RIGHT */}
        <div className="rounded-xl overflow-hidden shadow-lg">
          <img
            src="https://images.unsplash.com/photo-1503376780353-7e6692767b70"
            alt="Car Rental"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* MISSION / VISION */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12">
          <div className="p-8 rounded-xl border hover:shadow-md transition">
            <h3 className="text-2xl font-semibold text-gray-800 mb-3">
              Our Mission
            </h3>
            <p className="text-gray-600 leading-relaxed">
              To redefine car rentals by delivering safe, affordable, and premium
              mobility solutions powered by technology and trust.
            </p>
          </div>

          <div className="p-8 rounded-xl border hover:shadow-md transition">
            <h3 className="text-2xl font-semibold text-gray-800 mb-3">
              Our Vision
            </h3>
            <p className="text-gray-600 leading-relaxed">
              To become India’s most reliable and customer-centric car rental
              platform, making transportation accessible to everyone.
            </p>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-12">
            Why Choose CarRent
          </h2>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8">
            {[
              {
                title: "Verified Cars",
                desc: "Every vehicle is inspected and maintained for safety.",
              },
              {
                title: "Affordable Pricing",
                desc: "Transparent pricing with no hidden charges.",
              },
              {
                title: "Easy Booking",
                desc: "Book your car in minutes with our simple platform.",
              },
              {
                title: "24/7 Support",
                desc: "We’re always here when you need assistance.",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition"
              >
                <h4 className="text-lg font-semibold text-gray-800 mb-2">
                  {item.title}
                </h4>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="mb-6 text-lg opacity-90">
            Explore our wide range of cars and book your ride today.
          </p>
          <Link
            to="/cars"
            className="inline-block bg-white text-blue-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Browse Cars
          </Link>
        </div>
      </section>
    </div>
  );
};

export default About;
