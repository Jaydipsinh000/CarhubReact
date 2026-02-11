import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, MessageSquare, ArrowRight } from "lucide-react";

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
    <div className="bg-gray-50 min-h-screen">
      {/* HERO HEADER */}
      <div className="bg-[#0F172A] text-white py-16 md:py-24 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 bg-blue-600/20 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>

        <div className="relative z-10 px-4">
          <span className="text-blue-400 font-bold uppercase tracking-widest text-xs md:text-sm mb-2 block">24/7 Support</span>
          <h1 className="text-4xl md:text-6xl font-black mb-4 font-display">Get in Touch</h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-xl mx-auto leading-relaxed">
            Have a question or need assistance? Our team is always here to chat.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-10 pb-20 relative z-20">
        <div className="flex flex-col md:flex-row gap-6 md:gap-0 bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">

          {/* LEFT: INFO (Mobile First: Top) */}
          <div className="md:w-5/12 bg-blue-600 p-8 md:p-12 text-white flex flex-col justify-between relative overflow-hidden">
            {/* Decorative Circles */}
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>

            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
              <p className="text-blue-100 mb-8 leading-relaxed text-sm md:text-base">
                Fill up the form and our Team will get back to you within 24 hours.
              </p>

              <div className="space-y-6 md:space-y-8">
                <a href="tel:+919876543210" className="flex items-center gap-4 group cursor-pointer">
                  <div className="w-12 h-12 bg-white/10 group-hover:bg-white/20 transition rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <Phone className="text-white" size={20} />
                  </div>
                  <div>
                    <p className="text-blue-200 text-xs uppercase font-bold tracking-wider">Phone</p>
                    <p className="font-bold text-lg">+91 98765 43210</p>
                  </div>
                </a>

                <a href="mailto:support@carent.com" className="flex items-center gap-4 group cursor-pointer">
                  <div className="w-12 h-12 bg-white/10 group-hover:bg-white/20 transition rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <Mail className="text-white" size={20} />
                  </div>
                  <div>
                    <p className="text-blue-200 text-xs uppercase font-bold tracking-wider">Email</p>
                    <p className="font-bold text-lg break-all">support@carent.com</p>
                  </div>
                </a>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <MapPin className="text-white" size={20} />
                  </div>
                  <div>
                    <p className="text-blue-200 text-xs uppercase font-bold tracking-wider">Address</p>
                    <p className="font-bold text-lg">Ahmedabad, Gujarat, India</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative z-10 mt-12 flex gap-4">
              {/* Social Icons Placeholder */}
              <div className="w-10 h-10 rounded-full bg-white/20 hover:bg-white hover:text-blue-600 transition flex items-center justify-center cursor-pointer">
                <MessageSquare size={18} />
              </div>
            </div>
          </div>

          {/* RIGHT: FORM */}
          <div className="md:w-7/12 p-6 md:p-12 bg-white">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Your Name</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition font-medium"
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition font-medium"
                    placeholder="john@example.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Message</label>
                <textarea
                  name="message"
                  rows="4"
                  value={form.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition resize-none font-medium"
                  placeholder="How can we help you?"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition shadow-lg flex items-center justify-center gap-2 group transform active:scale-95"
              >
                Send Message <Send size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </div>
        </div>

        {/* MAP SECTION */}
        <div className="mt-12 w-full h-[500px] rounded-[2.5rem] overflow-hidden shadow-2xl border border-gray-100 relative group">
          <iframe
            title="CarRent Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3674.2342820126646!2d72.20390497508927!3d22.94159737923056!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395ea4c5e0c05e47%3A0xb61a599c836f3fd7!2sLilapur%20Village!5e0!3m2!1sen!2sin!4v1770786946164!5m2!1sen!2sin"
            className="w-full h-full border-0 grayscale hover:grayscale-0 transition-all duration-700"
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default Contact;
