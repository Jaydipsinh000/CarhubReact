import React, { useEffect, useState } from "react";
import SellerLayout from "./SellerLayout.jsx";
import api from "../Services/api.js";
import {
    Calendar,
    User,
    Phone,
    MapPin,
    Clock,
    Search,
    Filter,
    ChevronDown,
    MoreHorizontal,
    CheckCircle,
    XCircle,
    Download
} from "lucide-react";
import { getCarImage } from "../utils/imageUtils";

const SellerBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const res = await api.get("/bookings/seller-bookings");
                setBookings(res.data.bookings);
            } catch (error) {
                console.error("Failed to fetch bookings:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBookings();
    }, []);

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'paid': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'pending': return 'bg-amber-50 text-amber-600 border-amber-100';
            case 'cancelled': return 'bg-red-50 text-red-600 border-red-100';
            default: return 'bg-gray-50 text-gray-500 border-gray-100';
        }
    };

    const filteredBookings = bookings.filter(b =>
        b.carId?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.fullName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <SellerLayout>
                <div className="flex items-center justify-center h-[70vh]">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
            </SellerLayout>
        );
    }

    return (
        <SellerLayout>
            <div className="max-w-7xl mx-auto space-y-8">

                {/* HEADER */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
                    <div>
                        <h1 className="text-4xl font-black text-gray-900 font-display tracking-tight">
                            Bookings & Orders <span className="text-blue-600">.</span>
                        </h1>
                        <p className="text-gray-500 mt-2 font-medium">
                            Track and manage your vehicle reservations
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button className="flex items-center gap-2 px-5 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition shadow-sm">
                            <Download size={18} /> Export CSV
                        </button>
                    </div>
                </div>

                {/* FILTERS */}
                <div className="bg-white p-2 rounded-[2.5rem] border border-gray-100 shadow-sm">
                    <div className="p-4 flex gap-4">
                        <div className="flex-1 relative group">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                            <input
                                type="text"
                                placeholder="Search by customer or vehicle..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-6 py-4 bg-gray-50/50 border-none rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all outline-none font-medium placeholder:text-gray-400"
                            />
                        </div>
                        <div className="relative">
                            <Filter size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                            <select className="pl-12 pr-10 py-4 bg-gray-50/50 hover:bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-100 outline-none font-bold text-gray-700 cursor-pointer appearance-none min-w-[160px]">
                                <option value="all">All Status</option>
                                <option value="paid">Paid</option>
                                <option value="pending">Pending</option>
                            </select>
                        </div>
                    </div>

                    {/* TABLE */}
                    <div className="overflow-x-auto pb-4 px-4">
                        {filteredBookings.length === 0 ? (
                            <div className="text-center py-20">
                                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
                                    <Calendar size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">No bookings found</h3>
                                <p className="text-gray-500">
                                    We couldn't find any bookings matching your search.
                                </p>
                            </div>
                        ) : (
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">
                                        <th className="px-6 py-6 font-black">Vehicle Info</th>
                                        <th className="px-6 py-6 font-black">Customer</th>
                                        <th className="px-6 py-6 font-black">Schedule</th>
                                        <th className="px-6 py-6 font-black">Amount</th>
                                        <th className="px-6 py-6 font-black">Status</th>
                                        <th className="px-6 py-6 font-black text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {filteredBookings.map((booking) => (
                                        <tr key={booking._id} className="group hover:bg-blue-50/30 transition-colors">
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-16 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0 border border-gray-100">
                                                        <img
                                                            src={getCarImage(booking.carId)}
                                                            alt={booking.carId?.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-gray-900 text-sm">{booking.carId?.name}</p>
                                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-0.5">{booking.carId?.brand}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center text-xs font-black">
                                                        {booking.fullName.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-900 text-sm">{booking.fullName}</p>
                                                        <p className="text-xs text-gray-500 font-medium">{booking.phone}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-xs font-bold text-gray-600 flex items-center gap-1.5">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                                        {formatDate(booking.startDate)}
                                                    </span>
                                                    <span className="text-xs font-bold text-gray-600 flex items-center gap-1.5">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                                                        {formatDate(booking.endDate)}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className="font-black text-gray-900">₹{booking.amount?.toLocaleString()}</span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${getStatusColor(booking.paymentStatus)}`}>
                                                    {booking.paymentStatus}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-white rounded-xl transition-all border border-transparent hover:border-gray-100 hover:shadow-sm">
                                                    <MoreHorizontal size={20} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </SellerLayout>
    );
};

export default SellerBookings;
