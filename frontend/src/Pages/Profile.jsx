import React, { useEffect, useState } from "react";
import { User, Mail, Phone, Calendar, LogOut, ArrowRight, ShieldCheck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="text-center p-8 bg-white rounded-3xl shadow-xl border border-gray-100 max-w-md w-full mx-4">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <User size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Guest Access</h2>
          <p className="text-gray-500 mb-6">Please login to manage your bookings and profile.</p>
          <Link
            to="/login"
            className="block w-full py-3 bg-black text-white rounded-xl font-bold hover:bg-gray-900 transition mb-3"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="block w-full py-3 bg-white text-black border-2 border-gray-100 rounded-xl font-bold hover:border-gray-200 transition"
          >
            Create Account
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      {/* HEADER BACKGROUND */}
      <div className="h-60 bg-[#0F172A] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] to-transparent"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative -mt-32">
        <div className="grid lg:grid-cols-3 gap-8">

          {/* LEFT: PROFILE CARD */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 text-center relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-blue-50 to-transparent opacity-50"></div>

              <div className="relative">
                <div className="w-32 h-32 mx-auto bg-white p-1 rounded-full shadow-2xl mb-6">
                  <div className="w-full h-full bg-blue-600 rounded-full flex items-center justify-center text-5xl font-bold text-white shadow-inner">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                </div>

                <h1 className="text-2xl font-bold text-gray-900 mb-1">{user.name}</h1>
                <p className="text-gray-500 font-medium mb-4">{user.email}</p>

                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-50 text-green-700 text-xs font-bold uppercase tracking-wide rounded-full border border-green-100">
                  <ShieldCheck size={14} /> Verified Account
                </div>
              </div>
            </div>

            {/* NAVIGATION */}
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
              <nav className="p-2">
                <Link to="/my-bookings" className="flex items-center gap-4 px-4 py-4 text-gray-700 hover:bg-gray-50 rounded-2xl transition group">
                  <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Calendar size={20} />
                  </div>
                  <div className="flex-1">
                    <span className="font-bold text-gray-900 block">My Bookings</span>
                    <span className="text-xs text-gray-400 font-medium">View your trip history</span>
                  </div>
                  <ArrowRight size={16} className="text-gray-300 group-hover:text-blue-600 transition-colors" />
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-4 px-4 py-4 text-red-600 hover:bg-red-50 rounded-2xl transition group text-left mt-2"
                >
                  <div className="w-10 h-10 bg-red-50 text-red-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <LogOut size={20} />
                  </div>
                  <div className="flex-1">
                    <span className="font-bold block">Sign Out</span>
                    <span className="text-xs text-red-400 font-medium opacity-80">Securely logout</span>
                  </div>
                </button>
              </nav>
            </div>
          </div>

          {/* RIGHT: DETAILS & STATS */}
          <div className="lg:col-span-2 space-y-6 lg:mt-10">

            {/* STATS ROW */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition">
                <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Member Status</p>
                  <p className="text-xl font-bold text-gray-900">Gold Tier</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition">
                <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center">
                  <Calendar size={24} />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Trips</p>
                  <p className="text-xl font-bold text-gray-900">0</p>
                </div>
              </div>
            </div>

            {/* PERSONAL INFO CARD */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                  <User size={20} className="text-blue-600" /> Personal Details
                </h3>
                <button className="text-sm font-bold text-blue-600 hover:text-blue-700">Edit Profile</button>
              </div>

              <div className="p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Full Name</label>
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-400 shadow-sm">
                        <User size={16} />
                      </div>
                      <span className="font-semibold text-gray-900">{user.name}</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Phone Number</label>
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-400 shadow-sm">
                        <Phone size={16} />
                      </div>
                      <span className="font-semibold text-gray-900">{user.phone || "Not provided"}</span>
                    </div>
                  </div>

                  <div className="md:col-span-2 space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Email Address</label>
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-400 shadow-sm">
                        <Mail size={16} />
                      </div>
                      <span className="font-semibold text-gray-900 flex-1">{user.email}</span>
                      <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded-full flex items-center gap-1">
                        <ShieldCheck size={12} /> Verified
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ADVERTISEMENT / PROMO */}
            <div className="relative rounded-3xl overflow-hidden bg-black text-white p-8 md:p-12">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1503376763036-066120622c74?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-40"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent"></div>

              <div className="relative z-10 max-w-md">
                <span className="inline-block py-1 px-3 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-xs font-bold mb-4 uppercase tracking-wider">
                  Premium Fleet
                </span>
                <h3 className="text-3xl font-bold mb-4">Upgrade your drive today</h3>
                <p className="text-gray-300 mb-8 leading-relaxed">Experience our new collection of sports and luxury vehicles. Exclusive discounts for Gold Tier members.</p>
                <Link to="/cars" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black rounded-xl font-bold hover:bg-gray-100 transition shadow-lg">
                  Explore Fleet <ArrowRight size={18} />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
