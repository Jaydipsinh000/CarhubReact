import React, { useState, useEffect } from 'react';
import SellerLayout from './SellerLayout';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { Download, Printer, Calendar, TrendingUp, Car, DollarSign } from 'lucide-react';

const SellerReports = () => {
    const [dateRange, setDateRange] = useState('6m');

    const [loading, setLoading] = useState(true);
    const [reportData, setReportData] = useState({
        chartData: [],
        kpi: { revenue: 0, bookings: 0, cars: 0 }
    });

    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        const fetchReports = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem("token");
                const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/seller/reports?range=${dateRange}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await res.json();
                if (data.success) {
                    setReportData(data);
                }
            } catch (err) {
                console.error("Failed to fetch seller reports", err);
            } finally {
                setLoading(false);
            }
        };
        fetchReports();
    }, [dateRange]);

    const { chartData, kpi } = reportData;

    const handlePrint = () => {
        window.print();
    };

    const handleDownloadCSV = () => {
        const headers = ["Month", "Revenue", "Platform Fees", "Bookings", "Net Income"];
        const csvContent = [
            headers.join(","),
            ...reportData.chartData.map(row => `${row.name},${row.revenue},${row.expenses},${row.bookings},${row.netIncome}`)
        ].join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `Carent_Seller_Report_${user?.name || 'Partner'}.csv`);
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <SellerLayout>
            <div className="space-y-8 pb-10 print:p-0 print:max-w-none">
                {/* Header for Screen */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight font-display">
                            Business Reports
                        </h1>
                        <p className="text-gray-500 mt-1">
                            Detailed analysis of your earnings and fleet performance
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <select
                            value={dateRange}
                            onChange={(e) => setDateRange(e.target.value)}
                            className="bg-white border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 shadow-sm"
                        >
                            <option value="1m">Last 30 Days</option>
                            <option value="6m">Last 6 Months</option>
                            <option value="1y">Last Year</option>
                        </select>
                        <button
                            onClick={handleDownloadCSV}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition shadow-sm"
                        >
                            <Download size={16} /> Export CSV
                        </button>
                        <button
                            onClick={handlePrint}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition shadow-lg shadow-indigo-200"
                        >
                            <Printer size={16} /> Print Report
                        </button>
                    </div>
                </div>

                {/* Print Header */}
                <div className="hidden print:block mb-8">
                    <h1 className="text-2xl font-bold text-black">Carent Partner Report</h1>
                    <p className="text-gray-600">Generated for {user?.name} on {new Date().toLocaleDateString()}</p>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm print:border-gray-300">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                                <DollarSign size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium">Total Revenue</p>
                                <h3 className="text-2xl font-bold text-gray-900">
                                    ₹{kpi.revenue.toLocaleString()}
                                </h3>
                                <p className="text-xs text-emerald-600 flex items-center gap-1 mt-1">
                                    <TrendingUp size={12} /> Gross Earnings
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm print:border-gray-300">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-violet-50 text-violet-600 rounded-xl">
                                <Car size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium">Cars in Fleet</p>
                                <h3 className="text-2xl font-bold text-gray-900">{kpi.cars.toLocaleString()}</h3>
                                <p className="text-xs text-violet-600 flex items-center gap-1 mt-1">
                                    <TrendingUp size={12} /> Total Vehicles
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm print:border-gray-300">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                                <Calendar size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium">Total Bookings</p>
                                <h3 className="text-2xl font-bold text-gray-900">{kpi.bookings.toLocaleString()}</h3>
                                <p className="text-xs text-amber-600 flex items-center gap-1 mt-1">
                                    <TrendingUp size={12} /> Successful Rentals
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Financial Chart */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm print:break-inside-avoid print:border-gray-300">
                    <h2 className="text-lg font-bold text-gray-900 mb-6">Financial Performance</h2>
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorRevenue3" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorExpenses2" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} tickFormatter={(val) => `₹${val / 1000}k`} />
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    formatter={(value) => [`₹${value.toLocaleString()}`, ""]}
                                />
                                <Legend />
                                <Area type="monotone" dataKey="revenue" stackId="1" stroke="#10b981" fill="url(#colorRevenue3)" name="Revenue" strokeWidth={3} />
                                <Area type="monotone" dataKey="expenses" stackId="1" stroke="#6366f1" fill="url(#colorExpenses2)" name="Platform Fees (Est. 10%)" strokeWidth={3} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Growth Chart */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm print:break-inside-avoid print:border-gray-300">
                    <h2 className="text-lg font-bold text-gray-900 mb-6">Booking Activity</h2>
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip
                                    cursor={{ fill: '#F3F4F6' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Legend />
                                <Bar dataKey="bookings" name="Bookings" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={30} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Detailed Table for Print */}
                <div className="bg-white rounded-xl border border-gray-200 mt-8 overflow-hidden print:border-gray-300">
                    <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                        <h3 className="font-bold text-gray-900">Detailed Financial Data</h3>
                    </div>
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 font-medium text-gray-500">Period</th>
                                <th className="px-6 py-3 font-medium text-gray-500">Revenue</th>
                                <th className="px-6 py-3 font-medium text-gray-500">Platform Fees (10%)</th>
                                <th className="px-6 py-3 font-medium text-gray-500">Active Bookings</th>
                                <th className="px-6 py-3 font-medium text-gray-500">Net Income</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {chartData.map((row) => (
                                <tr key={row.name}>
                                    <td className="px-6 py-3 font-medium text-gray-900">{row.name}</td>
                                    <td className="px-6 py-3 text-emerald-600">₹{row.revenue.toLocaleString()}</td>
                                    <td className="px-6 py-3 text-rose-500">₹{row.expenses.toLocaleString()}</td>
                                    <td className="px-6 py-3 text-gray-600">{row.bookings}</td>
                                    <td className="px-6 py-3 font-bold text-gray-900">₹{row.netIncome.toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>
        </SellerLayout>
    );
};

export default SellerReports;
