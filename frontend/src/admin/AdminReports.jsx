import React, { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import { getAdminStats } from "../Services/adminApi";
import { Printer, Download, TrendingUp, Users, Car, Calendar } from "lucide-react";

const AdminReports = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAdminStats()
            .then((res) => setData(res.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const handlePrint = () => {
        window.print();
    };

    const handleDownloadCSV = () => {
        // Basic CSV download logic for bookings
        if (!data?.recentBookings) return;

        const headers = ["Booking ID,Customer,Car,Amount,Date,Status\n"];
        const rows = data.recentBookings.map(b =>
            `${b._id},${b.fullName},${b.carId?.name || 'Unknown'},${b.amount},${new Date(b.createdAt).toLocaleDateString()},${b.paymentStatus}`
        );

        const csvContent = "data:text/csv;charset=utf-8," + headers + rows.join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "carent_report.csv");
        document.body.appendChild(link);
        link.click();
    };

    if (loading) return <AdminLayout><div className="p-10 text-center">Generated Report...</div></AdminLayout>;

    return (
        <AdminLayout>
            <div className="max-w-4xl mx-auto space-y-8 pb-10 print:p-0 print:max-w-none">

                {/* HEADER ACTIONS */}
                <div className="flex justify-between items-center print:hidden">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 font-display">System Reports</h1>
                        <p className="text-gray-500">Generate and export platform analytics.</p>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={handleDownloadCSV} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 shadow-sm transition">
                            <Download size={18} /> Export CSV
                        </button>
                        <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md transition">
                            <Printer size={18} /> Print Report
                        </button>
                    </div>
                </div>

                {/* PRINTABLE AREA */}
                <div className="bg-white shadow-xl rounded-2xl p-10 border border-gray-100 print:shadow-none print:border-none">

                    {/* REPORT HEADER */}
                    <div className="border-b border-gray-100 pb-8 mb-8 flex justify-between items-start">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Carent Monthly Performance</h2>
                            <p className="text-gray-500 text-sm mt-1">Generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}</p>
                        </div>
                        <div className="text-right">
                            <div className="text-3xl font-bold text-blue-600">CarRent Admin</div>
                            <div className="text-sm text-gray-400">confidential internal report</div>
                        </div>
                    </div>

                    {/* KEY METRICS GRID */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <div className="flex items-center gap-2 text-gray-500 text-sm mb-1"><Users size={16} /> Total Users</div>
                            <div className="text-2xl font-bold text-gray-900">{data.totalUsers}</div>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <div className="flex items-center gap-2 text-gray-500 text-sm mb-1"><Car size={16} /> Fleet Size</div>
                            <div className="text-2xl font-bold text-gray-900">{data.totalCars}</div>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <div className="flex items-center gap-2 text-gray-500 text-sm mb-1"><Calendar size={16} /> Bookings</div>
                            <div className="text-2xl font-bold text-gray-900">{data.totalBookings}</div>
                        </div>
                        <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                            <div className="flex items-center gap-2 text-emerald-700 text-sm mb-1"><TrendingUp size={16} /> Revenue (Est)</div>
                            <div className="text-2xl font-bold text-emerald-700">
                                ₹{(data.monthlyStats?.reduce((acc, curr) => acc + curr.revenue, 0) || 0).toLocaleString()}
                            </div>
                        </div>
                    </div>

                    {/* REVENUE TABLE */}
                    <div className="mb-10">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Revenue Breakdown (Last 6 Months)</h3>
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="py-2 text-sm font-semibold text-gray-600">Month</th>
                                    <th className="py-2 text-sm font-semibold text-gray-600 text-right">Bookings</th>
                                    <th className="py-2 text-sm font-semibold text-gray-600 text-right">Revenue</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.monthlyStats?.map((m, i) => (
                                    <tr key={i} className="border-b border-gray-100">
                                        <td className="py-3 text-sm text-gray-900">{m.name}</td>
                                        <td className="py-3 text-sm text-gray-600 text-right">{m.bookings}</td>
                                        <td className="py-3 text-sm font-bold text-gray-900 text-right">₹{m.revenue.toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* FOOTER */}
                    <div className="mt-12 pt-8 border-t border-gray-100 text-center text-xs text-gray-400">
                        End of Report • Carent Inc. • Printed by Admin
                    </div>

                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminReports;
