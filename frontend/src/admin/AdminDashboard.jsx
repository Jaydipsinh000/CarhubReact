import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAdminStats } from "../Services/adminApi.js";
import AdminLayout from "./AdminLayout.jsx";
import { getCarImage } from "../utils/imageUtils";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from "recharts";
import {
  Car,
  Users,
  TrendingUp,
  Calendar,
  ArrowRight,
  DollarSign,
  Activity,
} from "lucide-react";

const COLORS = ["#10b981", "#ef4444"];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    totalCars: 0,
    unavailableCars: 0,
    totalBookings: 0,
    totalUsers: 0,
    recentBookings: [],
    monthlyStats: [],
  });

  const [loading, setLoading] = useState(true);



  useEffect(() => {
    // Fetch Dashboard Stats
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/admin/stats", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          setData({
            ...data.stats,
            recentBookings: data.recentBookings,
            monthlyStats: data.chartData
          });
        }
      } catch (error) {
        console.error("Dashboard fetch error", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  /* CARD DATA */
  const cards = [
    {
      title: "Total Revenue",
      value: `₹${(data.totalRevenue || 0).toLocaleString()}`,
      desc: "Total earnings",
      icon: DollarSign,
      color: "bg-emerald-500",
      bg: "bg-emerald-50",
      text: "text-emerald-600",
      trend: "+12.5%",
    },
    {
      title: "Total Bookings",
      value: data.totalBookings || 0,
      desc: "All time bookings",
      icon: Calendar,
      color: "bg-blue-500",
      bg: "bg-blue-50",
      text: "text-blue-600",
      trend: "+5%",
    },
    {
      title: "Total Cars",
      value: data.totalCars || 0,
      desc: "Fleet size",
      icon: Car,
      color: "bg-purple-500",
      bg: "bg-purple-50",
      text: "text-purple-600",
      trend: "+2",
    },
    {
      title: "Total Users",
      value: data.totalUsers || 0,
      desc: "Registered users",
      icon: Users,
      color: "bg-orange-500",
      bg: "bg-orange-50",
      text: "text-orange-600",
      trend: "+18%",
    },
  ];

  /* CHART DATA */
  const chartData = data.monthlyStats?.length > 0 ? data.monthlyStats : [];

  const carPieData = [
    {
      name: "Available",
      value: (data.totalCars || 0) - (data.unavailableCars || 0),
    },
    { name: "Unavailable", value: data.unavailableCars || 0 },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8 pb-10">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight font-display">
              Dashboard Overview
            </h1>
            <p className="text-gray-500 mt-1">
              Welcome back! Here's your daily performance summary.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500 font-medium bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm flex items-center gap-2">
              <Calendar size={14} className="text-gray-400" />
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            <button
              onClick={() => navigate("/admin/reports")}
              className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition shadow-lg flex items-center gap-2"
            >
              <Activity size={16} /> View Reports
            </button>
          </div>
        </div>

        {/* STAT CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {cards.map((card, i) => (
            <div
              key={i}
              className="group bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 relative overflow-hidden"
            >
              <div
                className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10 transition-transform group-hover:scale-110 ${card.bg.replace(
                  "bg-",
                  "bg-"
                )}`}
              />

              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${card.bg} ${card.text} ring-1 ring-inset ring-black/5`}>
                  <card.icon size={24} />
                </div>
                <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100">
                  {card.trend} <TrendingUp size={12} />
                </div>
              </div>

              <div>
                <h3 className="text-3xl font-bold text-gray-900 font-display tracking-tight">
                  {loading ? (
                    <div className="h-8 w-24 bg-gray-100 animate-pulse rounded" />
                  ) : (
                    card.value
                  )}
                </h3>
                <p className="text-gray-500 text-sm font-medium mt-1">
                  {card.title}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CHARTS SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* AREA CHART */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-lg font-bold text-gray-900 font-display">
                  Revenue Analytics
                </h2>
                <p className="text-sm text-gray-500">
                  Income trends over the past 6 months
                </p>
              </div>
            </div>

            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#6b7280", fontSize: 12, fontWeight: 500 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#6b7280", fontSize: 12 }}
                    tickFormatter={(value) => `₹${value / 1000}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid #e5e7eb",
                      boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                    }}
                    formatter={(value) => [`₹${value.toLocaleString()}`, "Revenue"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* PIE CHART */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 flex flex-col">
            <h2 className="text-lg font-bold text-gray-900 font-display mb-1">
              Fleet Status
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Real-time vehicle availability
            </p>

            <div className="flex-1 min-h-[250px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={carPieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={100}
                    paddingAngle={5}
                    cornerRadius={5}
                  >
                    {carPieData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index]} strokeWidth={0} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>

              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-bold text-gray-900">
                  {data.totalCars || 0}
                </span>
                <span className="text-xs text-gray-400 uppercase tracking-widest font-medium">
                  Total Cars
                </span>
              </div>
            </div>

            <div className="space-y-3 mt-6">
              <div className="flex justify-between items-center p-3 rounded-xl bg-gray-50 border border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="text-sm font-medium text-gray-700">Available</span>
                </div>
                <span className="text-sm font-bold text-gray-900">{carPieData[0].value}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-gray-50 border border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <span className="text-sm font-medium text-gray-700">Unavailable</span>
                </div>
                <span className="text-sm font-bold text-gray-900">{carPieData[1].value}</span>
              </div>
            </div>
          </div>
        </div>

        {/* RECENT BOOKINGS TABLE */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
            <div>
              <h2 className="text-lg font-bold text-gray-900 font-display">
                Recent Activity
              </h2>
              <p className="text-sm text-gray-500">
                Latest transactions and property bookings
              </p>
            </div>
            <button
              onClick={() => navigate('/admin/bookings')}
              className="text-sm text-blue-600 font-medium hover:bg-blue-50 px-4 py-2 rounded-lg transition flex items-center gap-1"
            >
              View All <ArrowRight size={16} />
            </button>
          </div>

          {loading ? (
            <div className="p-12 text-center text-gray-500">
              <div className="animate-spin h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-3"></div>
              Loading activity...
            </div>
          ) : data.recentBookings?.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              No recent bookings found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50/50 border-b border-gray-100">
                  <tr className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <th className="px-6 py-4">Transaction Details</th>
                    <th className="px-6 py-4">Status & Amount</th>
                    <th className="px-6 py-4">Customer Info</th>
                    <th className="px-6 py-4">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {data.recentBookings?.map((booking) => (
                    <tr
                      key={booking._id}
                      className="hover:bg-blue-50/30 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-12 rounded-lg bg-gray-100 overflow-hidden border border-gray-200 flex-shrink-0">
                            <img
                              src={getCarImage(booking.carId)}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">
                              {booking.carId?.name || "Unknown Car"}
                            </p>
                            <p className="text-xs text-gray-500">
                              {booking.carId?.brand}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col items-start gap-1">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${booking.status === "confirmed"
                              ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                              : "bg-yellow-50 text-yellow-600 border-yellow-100"
                              }`}
                          >
                            {booking.status || "Pending"}
                          </span>
                          <span className="font-bold text-gray-900 text-sm">
                            ₹{booking.amount?.toLocaleString()}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-bold">
                            {booking.user?.name?.charAt(0) || "U"}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{booking.user?.name || "User"}</p>
                            <p className="text-xs text-gray-400">{booking.user?.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-500">
                        {new Date(booking.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
