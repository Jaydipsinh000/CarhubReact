import React, { useEffect, useState } from "react";
import { User, Mail, Phone, Calendar, LogOut, ArrowRight, ShieldCheck, Clock, MapPin } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { getMyBookings } from "../Services/paymentApi.js";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      fetchBookings();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await getMyBookings();
      setBookings(res.data || []);
    } catch (err) {
      console.error("Failed to fetch bookings for profile stats");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!user && !loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="text-center p-8 bg-white rounded-3xl shadow-xl border border-gray-100 max-w-md w-full mx-4">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <User size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2 font-display">Guest Access</h2>
          <p className="text-gray-500 mb-6">Please login to manage your bookings and profile.</p>
          <Link
            to="/login"
            className="block w-full py-3 bg-black text-white rounded-xl font-bold hover:bg-gray-900 transition mb-3 shadow-lg shadow-gray-200"
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

  // Helper for Avatar
  const getAvatar = () => {
    if (user?.photo) return user.photo;
    return `https://ui-avatars.com/api/?name=${user?.name}&background=2563eb&color=fff&bold=true`;
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      {/* HEADER BACKGROUND */}
      <div className="h-72 bg-[#0F172A] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 animate-pulse"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] to-transparent"></div>

        {/* Header Content */}
        <div className="absolute bottom-32 left-0 w-full px-4 sm:px-6 max-w-6xl mx-auto">
          <h1 className="text-3xl font-display font-bold text-white mb-1">My Profile</h1>
          <p className="text-blue-200 text-sm">Manage your personal information and trip history</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative -mt-24">
        <div className="grid lg:grid-cols-12 gap-8">

          {/* LEFT: PROFILE CARD (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-200/50 border border-gray-100 text-center relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-blue-50/50 to-transparent"></div>

              <div className="relative">
                <div className="w-32 h-32 mx-auto bg-white p-1.5 rounded-full shadow-2xl mb-6 ring-4 ring-blue-50/50">
                  <img
                    src={getAvatar()}
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover shadow-inner"
                  />
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-1 font-display">{user?.name}</h2>
                <p className="text-gray-500 font-medium mb-4 text-sm">{user?.email}</p>

                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-50 text-green-700 text-xs font-bold uppercase tracking-wide rounded-full border border-green-100 mb-6">
                  <ShieldCheck size={14} /> {user?.role === 'seller' ? 'Partner Account' : 'Verified Member'}
                </div>

                <div className="border-t border-gray-100 pt-6">
                  <div className="grid grid-cols-2 gap-4 text-left">
                    <div>
                      <p className="text-xs text-gray-400 font-bold uppercase">Member Since</p>
                      <p className="font-semibold text-gray-700">{new Date(user?.createdAt || Date.now()).getFullYear()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-bold uppercase">Location</p>
                      <p className="font-semibold text-gray-700">India</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* NAVIGATION */}
            <div className="bg-white rounded-[2rem] shadow-lg shadow-slate-200/50 border border-gray-100 overflow-hidden p-3">
              <nav className="space-y-1">
                <Link to="/my-bookings" className="flex items-center gap-4 px-4 py-4 text-gray-700 hover:bg-blue-50/50 hover:text-blue-700 rounded-2xl transition group">
                  <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Calendar size={20} />
                  </div>
                  <div className="flex-1">
                    <span className="font-bold block">My Bookings</span>
                  </div>
                  <ArrowRight size={18} className="text-gray-300 group-hover:text-blue-600 transition-colors" />
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-4 px-4 py-4 text-red-600 hover:bg-red-50/50 rounded-2xl transition group text-left"
                >
                  <div className="w-10 h-10 bg-red-50 text-red-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <LogOut size={20} />
                  </div>
                  <div className="flex-1">
                    <span className="font-bold block">Sign Out</span>
                  </div>
                </button>
              </nav>
            </div>
          </div>

          {/* RIGHT: DETAILS & STATS (8 cols) */}
          <div className="lg:col-span-8 space-y-6">

            {/* STATS ROW */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col gap-3 hover:shadow-md transition">
                <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <p className="text-2xl font-black text-gray-900 font-display">
                    {bookings.length > 5 ? "Gold" : "Silver"}
                  </p>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tier Status</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col gap-3 hover:shadow-md transition">
                <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center">
                  <Calendar size={20} />
                </div>
                <div>
                  <p className="text-2xl font-black text-gray-900 font-display">
                    {bookings.length}
                  </p>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Trips</p>
                </div>
              </div>
              <div className="hidden lg:flex bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex-col gap-3 hover:shadow-md transition">
                <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                  <Clock size={20} />
                </div>
                <div>
                  <p className="text-2xl font-black text-gray-900 font-display">0</p>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Pending</p>
                </div>
              </div>
            </div>

            {/* PERSONAL INFO CARD */}
            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2 font-display">
                  Personal Details
                </h3>
              </div>

              <div className="p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Full Name</label>
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100/50">
                      <User size={18} className="text-gray-400" />
                      <span className="font-semibold text-gray-900">{user?.name}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Phone Number</label>
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100/50">
                      <Phone size={18} className="text-gray-400" />
                      <span className="font-semibold text-gray-900">{user?.phone || "Not provided"}</span>
                    </div>
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Email Address</label>
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100/50">
                      <Mail size={18} className="text-gray-400" />
                      <span className="font-semibold text-gray-900 flex-1">{user?.email}</span>
                      {user?.isVerified && (
                        <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded-full flex items-center gap-1">
                          <ShieldCheck size={12} /> Verified
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RECENT ACTIVITY */}
            {bookings.length > 0 && (
              <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-8 py-6 border-b border-gray-100">
                  <h3 className="font-bold text-lg text-gray-900 font-display">Recent Activity</h3>
                </div>
                <div>
                  {bookings.slice(0, 3).map((booking, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-6 hover:bg-gray-50 transition border-b border-gray-50 last:border-0">
                      <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                        {new Date(booking.startDate).getDate()}
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-gray-900">{booking.carId?.name || "Unknown Car"}</p>
                        <p className="text-xs text-gray-500 font-medium">
                          {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${booking.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {booking.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                        </span>
                      </div>
                    </div>
                  ))}
                  <div className="p-4 text-center border-t border-gray-100">
                    <Link to="/my-bookings" className="text-sm font-bold text-blue-600 hover:text-blue-700">View All Bookings</Link>
                  </div>
                </div>
              </div>
            )}


            {/* ADVERTISEMENT / PROMO */}
            {bookings.length === 0 && (
              <div className="relative rounded-[2rem] overflow-hidden bg-black text-white p-8 md:p-12">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1503376763036-066120622c74?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-40"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent"></div>

                <div className="relative z-10 max-w-md">
                  <span className="inline-block py-1 px-3 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-xs font-bold mb-4 uppercase tracking-wider">
                    Premium Fleet
                  </span>
                  <h3 className="text-3xl font-bold mb-4 font-display">Start your journey</h3>
                  <p className="text-gray-300 mb-8 leading-relaxed">Book your first ride today and experience our premium service.</p>
                  <Link to="/cars" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black rounded-xl font-bold hover:bg-gray-100 transition shadow-lg">
                    Explore Fleet <ArrowRight size={18} />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
