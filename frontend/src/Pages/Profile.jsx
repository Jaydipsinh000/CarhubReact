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
        <div className="text-center">
          <p className="text-gray-500 mb-4">Please login to view your profile</p>
          <Link to="/login" className="px-6 py-2 bg-black text-white rounded-lg font-medium">Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 font-display mb-8">My Account</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* LEFT SIDEBAR */}
          <div className="col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
              <div className="w-24 h-24 bg-blue-600 text-white rounded-full flex items-center justify-center text-4xl font-bold mx-auto mb-4 shadow-lg shadow-blue-500/30">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
              <p className="text-gray-500 text-sm">{user.email}</p>
              <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 text-xs font-bold uppercase tracking-wide rounded-full">
                <ShieldCheck size={14} /> Verified Member
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
              <nav className="space-y-1">
                <Link to="/my-bookings" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl transition">
                  <Calendar size={18} /> My Bookings
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition text-left"
                >
                  <LogOut size={18} /> Logout
                </button>
              </nav>
            </div>
          </div>

          {/* MAIN CONTENT */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <User size={20} className="text-blue-600" /> Personal Information
              </h3>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Full Name</label>
                    <div className="p-3 bg-gray-50 rounded-xl font-medium text-gray-800 border border-gray-100">
                      {user.name}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Email Address</label>
                    <div className="p-3 bg-gray-50 rounded-xl font-medium text-gray-800 border border-gray-100 flex items-center justify-between">
                      {user.email}
                      <ShieldCheck size={16} className="text-green-500" />
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Phone Number</label>
                  <div className="p-3 bg-gray-50 rounded-xl font-medium text-gray-800 border border-gray-100 flex items-center gap-3">
                    <Phone size={16} className="text-gray-400" />
                    {user.phone || "Not Provided"}
                  </div>
                </div>
              </div>
            </div>

            {/* Banner */}
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-8 rounded-2xl text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-2">Ready for your next trip?</h3>
                <p className="text-gray-300 mb-6 max-w-sm">Explore our new premium fleet additions and travel in ultimate comfort.</p>
                <Link to="/cars" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-black font-bold rounded-xl hover:bg-gray-100 transition">
                  Browse Cars <ArrowRight size={18} />
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
