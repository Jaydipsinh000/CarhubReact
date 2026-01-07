import { useEffect, useState } from "react";
import { getAdminStats } from "../Services/adminApi.js";
import AdminLayout from "./AdminLayout.jsx";
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
  CartesianGrid
} from "recharts";
import { Car, AlertCircle, Package, Users, TrendingUp, Calendar, ArrowUpRight, RupeeIcon } from "lucide-react";

const COLORS = ["#10b981", "#ef4444"];

const AdminDashboard = () => {
  const [data, setData] = useState({
    totalCars: 0,
    unavailableCars: 0,
    totalBookings: 0,
    totalUsers: 0,
    recentBookings: [],
    monthlyStats: []
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminStats()
      .then((res) => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  /* CARD DATA */
  const cards = [
    {
      title: "Total Revenue",
      value: `₹${(data.monthlyStats?.reduce((acc, curr) => acc + curr.revenue, 0) || 0).toLocaleString()}`,
      desc: "Last 6 months",
      icon: RupeeIcon,
      color: "bg-emerald-500",
      bg: "bg-emerald-50",
      text: "text-emerald-600",
      trend: "+12.5%"
    },
    {
      title: "Active Bookings",
      value: data.unavailableCars || 0,
      desc: "Cars currently out",
      icon: Calendar,
      color: "bg-blue-500",
      bg: "bg-blue-50",
      text: "text-blue-600",
      trend: "+5%"
    },
    {
      title: "Total Cars",
      value: data.totalCars || 0,
      desc: "Fleet size",
      icon: Car,
      color: "bg-purple-500",
      bg: "bg-purple-50",
      text: "text-purple-600",
      trend: "+2"
    },
    {
      title: "Total Users",
      value: data.totalUsers || 0,
      desc: "Active customers",
      icon: Users,
      color: "bg-orange-500",
      bg: "bg-orange-50",
      text: "text-orange-600",
      trend: "+18%"
    },
  ];

  /* CHART DATA */
  // Use real monthly stats or fallback to mock if empty (for initial view)
  const chartData = data.monthlyStats?.length > 0 ? data.monthlyStats : [
    { name: 'Jan', bookings: 4, revenue: 12000 },
    { name: 'Feb', bookings: 7, revenue: 21000 },
    { name: 'Mar', bookings: 5, revenue: 15000 },
    { name: 'Apr', bookings: 12, revenue: 36000 },
    { name: 'May', bookings: 10, revenue: 30000 },
    { name: 'Jun', bookings: 16, revenue: 48000 },
  ];

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
              Welcome back, here's what's happening today.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500 font-medium bg-white px-3 py-1.5 rounded-lg border border-gray-200">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </div>
        </div>

        {/* STAT CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {cards.map((card, i) => (
            <div
              key={i}
              className="group bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 relative overflow-hidden"
            >
              <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10 ${card.bg.replace("bg-", "bg-")}`} />

              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${card.bg} ${card.text}`}>
                  <card.icon size={24} />
                </div>
                <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                  {card.trend} <TrendingUp size={12} />
                </div>
              </div>

              <div>
                <h3 className="text-3xl font-bold text-gray-900 font-display tracking-tight">
                  {loading ? <div className="h-8 w-24 bg-gray-100 animate-pulse rounded" /> : card.value}
                </h3>
                <p className="text-gray-500 text-sm font-medium mt-1">{card.title}</p>
                <p className="text-xs text-gray-400 mt-2">{card.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CHARTS SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* AREA CHART - REVENUE/BOOKINGS */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-xl font-bold text-gray-900 font-display">Revenue Trend</h2>
                <p className="text-sm text-gray-500">Income over the last 6 months</p>
              </div>
              <button className="text-sm text-blue-600 font-medium hover:bg-blue-50 px-3 py-1 rounded-lg transition">View Report</button>
            </div>

            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#6B7280", fontSize: 12, fontWeight: 500 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#6B7280", fontSize: 12 }}
                    tickFormatter={(value) => `₹${value / 1000}k`}
                  />
                  <Tooltip
                    contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }}
                    formatter={(value) => [`₹${value.toLocaleString()}`, "Revenue"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* PIE CHART - FLEET STATUS */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <h2 className="text-xl font-bold text-gray-900 font-display mb-2">Fleet Status</h2>
            <p className="text-sm text-gray-500 mb-6">Vehicle availability overview</p>

            <div className="h-[250px] w-full flex items-center justify-center relative">
              {/* Center Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-bold text-gray-900">{data.totalCars || 0}</span>
                <span className="text-xs text-gray-400 uppercase tracking-widest">Total</span>
              </div>

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
                    contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-3 mt-6">
              <div className="flex justify-between items-center p-3 rounded-lg bg-gray-50">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-sm font-medium text-gray-700">Available</span>
                </div>
                <span className="text-sm font-bold text-gray-900">{carPieData[0].value}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-gray-50">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="text-sm font-medium text-gray-700">Unavailable</span>
                </div>
                <span className="text-sm font-bold text-gray-900">{carPieData[1].value}</span>
              </div>
            </div>
          </div>
        </div>

        {/* RECENT BOOKINGS TABLE */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Recent Bookings</h2>
              <p className="text-sm text-gray-500">Latest transactions from users</p>
            </div>
            <button className="flex items-center gap-1 text-sm text-blue-600 font-medium hover:underline">
              View All <ArrowUpRight size={16} />
            </button>
          </div>

          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading bookings...</div>
          ) : data.recentBookings?.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No recent bookings found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50/50">
                  <tr className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Vehicle</th>
                    <th className="px-6 py-4">Dates</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {data.recentBookings?.map((booking) => (
                    <tr key={booking._id} className="hover:bg-blue-50/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white flex items-center justify-center text-xs font-bold">
                            {booking.fullName?.charAt(0) || "U"}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{booking.fullName}</p>
                            <p className="text-xs text-gray-500">{booking.phone}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-gray-800">{booking.carId?.name || "Unknown Car"}</p>
                        <p className="text-xs text-gray-500">{booking.carId?.brand}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-xs text-gray-600 space-y-1">
                          <p>From: {new Date(booking.startDate).toLocaleDateString()}</p>
                          <p>To: {new Date(booking.endDate).toLocaleDateString()}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-bold text-gray-900">
                        ₹{booking.amount?.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${booking.paymentStatus === 'paid' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-yellow-50 text-yellow-600 border-yellow-100"}`}>
                          {booking.paymentStatus || "Pending"}
                        </span>
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
