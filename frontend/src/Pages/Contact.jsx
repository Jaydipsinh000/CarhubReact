import React, { useState } from "react";
import { Mail, Phone, MapPin } from "lucide-react";

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Later: connect API here
    alert("Message sent successfully!");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="bg-gray-50">
      {/* HERO */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-6 py-24 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Contact <span className="text-yellow-300">CarRent</span>
          </h1>
          <p className="text-lg max-w-3xl mx-auto opacity-90">
            Have questions or need help? We’re here to support you 24/7.
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-14">
        {/* LEFT INFO */}
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Get in Touch
          </h2>
          <p className="text-gray-600 mb-10">
            Reach out to CarRent for bookings, support, partnerships, or general
            inquiries. Our team will respond as soon as possible.
          </p>

          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Mail className="text-blue-600" />
              <span className="text-gray-700">support@carrent.com</span>
            </div>

            <div className="flex items-center gap-4">
              <Phone className="text-blue-600" />
              <span className="text-gray-700">+91 98765 43210</span>
            </div>

            <div className="flex items-center gap-4">
              <MapPin className="text-blue-600" />
              <span className="text-gray-700">
                Ahmedabad, Gujarat, India
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT FORM */}
        <div className="bg-white shadow-xl rounded-2xl p-10">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6">
            Send Us a Message
          </h3>

          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-400"
            />

            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-400"
            />

            <textarea
              name="message"
              rows="4"
              placeholder="Your Message"
              value={form.message}
              onChange={handleChange}
              required
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-400 resize-none"
            />

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
            >
              Send Message
            </button>
          </form>
        </div>
      </section>

      {/* MAP / FOOTER INFO */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold mb-4">Our Office</h2>
          <p className="text-gray-600 mb-6">
            Visit us or reach out anytime — we’re always happy to help.
          </p>

          <div className="w-full h-64 rounded-xl overflow-hidden shadow">
            <iframe
              title="CarRent Location"
              src="https://www.google.com/maps?q=Ahmedabad,Gujarat&output=embed"
              className="w-full h-full border-0"
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
