import React, { useEffect, useState } from "react";
import SellerLayout from "./SellerLayout.jsx";
import { getSellerStats } from "../Services/sellerApi.js";
import {
    Car,
    TrendingUp,
    CalendarCheck,
    DollarSign,
    ArrowRight,
    ArrowUpRight,
    ChevronRight,
    Smartphone,
    CreditCard,
    MoreHorizontal
} from "lucide-react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Cell
} from 'recharts';

const SellerDashboard = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const [stats, setStats] = useState({
        totalCars: 0,
        totalBookings: 0,
        totalEarnings: 0,
        recentBookings: [],
        chartData: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const res = await getSellerStats();
                if (res.data.success) {
                    setStats(res.data);
                }
            } catch (err) {
                console.error("Error fetching seller stats:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const hour = new Date().getHours();
    const greeting = hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";

    if (loading) {
        return (
            <SellerLayout>
                <div className="flex items-center justify-center h-[60vh]">
                    <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
            </SellerLayout>
        );
    }

    return (
        <SellerLayout>
            <div className="max-w-7xl mx-auto space-y-8">

                {/* HERO SECTION */}
                <div className="relative bg-gradient-to-r from-indigo-900 via-indigo-800 to-indigo-900 rounded-[2.5rem] p-8 md:p-12 overflow-hidden shadow-2xl shadow-indigo-900/20 text-white">
                    {/* Background Patterns */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-sky-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                        <div>
                            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 mb-4">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                                <span className="text-xs font-bold tracking-wide text-indigo-100 uppercase">Live Dashboard</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black font-display tracking-tight mb-2">
                                {greeting}, {user?.name?.split(" ")[0]}
                            </h1>
                            <p className="text-indigo-200 text-lg font-medium max-w-xl leading-relaxed">
                                Here's your business overview. You have <span className="text-white font-bold">{stats.recentBookings.filter(b => b.status === "Active").length} active bookings</span> today.
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button className="px-6 py-3 bg-white text-indigo-950 font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2">
                                <Smartphone size={18} /> Mobile App
                            </button>
                            <button className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-900/40 hover:bg-indigo-500 transition-all flex items-center gap-2">
                                <ArrowUpRight size={18} /> View Reports
                            </button>
                        </div>
                    </div>
                </div>

                {/* STATS GRID - EXECUTIVE STYLE */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Revenue Card */}
                    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 relative group overflow-hidden">
                        <div className="absolute right-0 top-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                            <DollarSign size={80} className="text-indigo-600" />
                        </div>
                        <div className="flex flex-col h-full justify-between relative z-10">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
                                    <CreditCard size={24} />
                                </div>
                                <span className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg text-xs font-bold">
                                    <TrendingUp size={14} /> +12%
                                </span>
                            </div>
                            <div>
                                <p className="text-slate-500 font-bold text-xs uppercase tracking-wider mb-1">Total Earnings</p>
                                <h3 className="text-3xl font-black text-slate-900">₹{(stats.totalEarnings / 1000).toFixed(1)}k</h3>
                            </div>
                        </div>
                    </div>

                    {/* Bookings Card */}
                    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 relative group overflow-hidden">
                        <div className="absolute right-0 top-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                            <CalendarCheck size={80} className="text-violet-600" />
                        </div>
                        <div className="flex flex-col h-full justify-between relative z-10">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-violet-50 rounded-2xl text-violet-600">
                                    <CalendarCheck size={24} />
                                </div>
                                <span className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg text-xs font-bold">
                                    <TrendingUp size={14} /> +5%
                                </span>
                            </div>
                            <div>
                                <p className="text-slate-500 font-bold text-xs uppercase tracking-wider mb-1">Total Bookings</p>
                                <h3 className="text-3xl font-black text-slate-900">{stats.totalBookings}</h3>
                            </div>
                        </div>
                    </div>

                    {/* Cars Card */}
                    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 relative group overflow-hidden">
                        <div className="absolute right-0 top-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Car size={80} className="text-sky-600" />
                        </div>
                        <div className="flex flex-col h-full justify-between relative z-10">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-sky-50 rounded-2xl text-sky-600">
                                    <Car size={24} />
                                </div>
                                <div className="h-6 px-2 bg-sky-100 text-sky-700 rounded-lg text-xs font-bold flex items-center">
                                    Fleet
                                </div>
                            </div>
                            <div>
                                <p className="text-slate-500 font-bold text-xs uppercase tracking-wider mb-1">Active Vehicles</p>
                                <h3 className="text-3xl font-black text-slate-900">{stats.totalCars}</h3>
                            </div>
                        </div>
                    </div>
                </div>

                {/* MAIN ANALYTICS ROW */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
                    {/* AREA CHART */}
                    <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm flex flex-col">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h3 className="text-xl font-black text-slate-900 font-display">Revenue Analytics</h3>
                                <p className="text-sm text-slate-400 font-medium">Income trend over last 7 days</p>
                            </div>
                            <div className="flex gap-2">
                                <button className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 hover:text-indigo-600 transition-colors">
                                    <MoreHorizontal size={20} />
                                </button>
                            </div>
                        </div>
                        <div className="flex-1 min-h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={stats.chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                                        dy={15}
                                    />
                                    <YAxis hide />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                        itemStyle={{ color: '#1e293b', fontWeight: 700 }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="earnings"
                                        stroke="#6366f1"
                                        strokeWidth={4}
                                        fillOpacity={1}
                                        fill="url(#colorEarnings)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* DEMAND BAR CHART - VERTICAL */}
                    <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm flex flex-col">
                        <div className="mb-6">
                            <h3 className="text-xl font-black text-slate-900 font-display">Demand</h3>
                            <p className="text-sm text-slate-400 font-medium">Daily booking frequency</p>
                        </div>
                        <div className="flex-1">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={stats.chartData}>
                                    <Bar dataKey="bookings" radius={[8, 8, 8, 8]} barSize={40}>
                                        {stats.chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.bookings > 2 ? '#8b5cf6' : '#bfdbfe'} />
                                        ))}
                                    </Bar>
                                    <Tooltip
                                        cursor={{ fill: 'transparent' }}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-4 pt-4 border-t border-slate-50 flex justify-between items-center text-sm">
                            <span className="text-slate-500 font-bold">Peak Day</span>
                            <span className="text-slate-900 font-black">Saturday</span>
                        </div>
                    </div>
                </div>

                {/* RECENT ACTIVITY - CLEAN LIST */}
                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                        <div>
                            <h3 className="text-xl font-black text-slate-900 font-display">Recent Activity</h3>
                        </div>
                        <button className="text-indigo-600 font-bold text-sm hover:text-indigo-700 flex items-center gap-1">
                            View All <ArrowRight size={16} />
                        </button>
                    </div>
                    <div className="divide-y divide-slate-50">
                        {stats.recentBookings.map((b) => (
                            <div key={b.id} className="p-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-lg">
                                        {b.user.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900 text-sm mb-0.5">{b.user}</p>
                                        <p className="text-xs text-slate-500 flex items-center gap-1">
                                            <Car size={12} /> {b.car}
                                        </p>
                                    </div>
                                </div>

                                <div className="hidden md:block">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Date</p>
                                    <p className="text-sm font-bold text-slate-700">{b.date}</p>
                                </div>

                                <div className="hidden md:block">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Status</p>
                                    <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wide ${b.status === 'Active' ? 'bg-emerald-50 text-emerald-600' :
                                            b.status === 'Upcoming' ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-500'
                                        }`}>
                                        {b.status}
                                    </span>
                                </div>

                                <div className="text-right">
                                    <p className="font-black text-slate-900">₹{b.amount.toLocaleString()}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </SellerLayout>
    );
};

export default SellerDashboard;
