import { useEffect, useState } from "react";
import { getCars } from "../Services/adminApi.js";
import AdminLayout from "./AdminLayout.jsx";

const AdminDashboard = () => {
  const [totalCars, setTotalCars] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCars()
      .then((res) => setTotalCars(res.data.total))
      .finally(() => setLoading(false));
  }, []);

  const stats = [
    {
      title: "Total Cars",
      value: totalCars,
      icon: "🚗",
      gradient: "bg-gradient-to-r from-blue-500 to-blue-600",
    },
    {
      title: "Unavailable Cars",
      value: "Coming Soon",
      icon: "🛑",
      gradient: "bg-gradient-to-r from-red-500 to-red-600",
      disabled: true,
    },
    {
      title: "Total Bookings",
      value: "Coming Soon",
      icon: "📦",
      gradient: "bg-gradient-to-r from-green-500 to-green-600",
      disabled: true,
    },
    {
      title: "Total Users",
      value: "Coming Soon",
      icon: "👥",
      gradient: "bg-gradient-to-r from-purple-500 to-purple-600",
      disabled: true,
    },
  ];

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50 p-6">
        {/* PAGE HEADER */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 mt-2">
            Monitor system statistics & performance
          </p>
        </div>

        {/* STATS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className={`relative rounded-2xl shadow-lg transition transform hover:scale-105 ${
                stat.disabled ? "opacity-60 cursor-not-allowed" : "hover:shadow-2xl"
              }`}
            >
              {/* Icon Circle */}
              <div
                className={`absolute -top-6 left-6 w-14 h-14 flex items-center justify-center rounded-full text-2xl text-white shadow-lg ${
                  stat.disabled ? "bg-gray-400" : stat.gradient
                }`}
              >
                {stat.icon}
              </div>

              <div className="p-6 pt-8">
                <p className="text-sm text-gray-500">{stat.title}</p>
                <h2 className="text-3xl font-bold text-gray-900 mt-1">
                  {loading && idx === 0 ? "…" : stat.value}
                </h2>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
