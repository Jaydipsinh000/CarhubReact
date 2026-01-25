import React, { useEffect, useState } from "react";
import SellerLayout from "./SellerLayout.jsx";
import api from "../Services/api.js";
import { updateBookingStatus } from "../Services/sellerApi.js";
import { toast } from "react-toastify";
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
import { getCarImage } from "../utils/imageUtils.js";

const SellerBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedBooking, setSelectedBooking] = useState(null); // Modal State

    const toggleModal = (booking) => {
        setSelectedBooking(booking);
    };

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

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await updateBookingStatus(id, newStatus);
            toast.success(`Booking marked as ${newStatus}`);
            // Refresh local state
            setBookings(prev => prev.map(b => b._id === id ? { ...b, status: newStatus } : b));
        } catch (error) {
            console.error("Update Status Error:", error);
            toast.error("Failed to update status");
        }
    };

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
            case 'partial': return 'bg-blue-50 text-blue-600 border-blue-100';
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
                                                <div className="text-[10px] text-gray-400 font-medium">
                                                    Paid: ₹{(booking.paidAmount || 0).toLocaleString()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex flex-col gap-1 items-start">
                                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${getStatusColor(booking.paymentStatus)}`}>
                                                        {booking.paymentStatus}
                                                    </span>
                                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">
                                                        {booking.status || "CONFIRMED"}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <div className="flex justify-end gap-2 items-center">
                                                    <button
                                                        onClick={() => toggleModal(booking)}
                                                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                                        title="View Details"
                                                    >
                                                        <Search size={18} />
                                                    </button>
                                                    {(!booking.status || booking.status === "confirmed") && (
                                                        <button
                                                            onClick={() => handleStatusUpdate(booking._id, "active")}
                                                            className="px-3 py-1.5 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider rounded-lg hover:bg-blue-700 transition"
                                                        >
                                                            Pickup
                                                        </button>
                                                    )}
                                                    {booking.status === "active" && (
                                                        <button
                                                            onClick={() => handleStatusUpdate(booking._id, "completed")}
                                                            className="px-3 py-1.5 bg-green-600 text-white text-[10px] font-bold uppercase tracking-wider rounded-lg hover:bg-green-700 transition"
                                                        >
                                                            Return
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
            {/* MODAL */}
            {selectedBooking && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 text-left">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedBooking(null)}></div>
                    <div className="relative bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in-95 duration-200">

                        {/* Modal Header */}
                        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-8 py-6 border-b border-gray-100 flex items-center justify-between z-10">
                            <div>
                                <h2 className="text-xl font-black text-gray-900 font-display">Booking Details</h2>
                                <p className="text-sm text-gray-500 font-medium">#{selectedBooking._id.slice(-8).toUpperCase()}</p>
                            </div>
                            <button
                                onClick={() => setSelectedBooking(null)}
                                className="p-2 bg-gray-50 text-gray-400 hover:text-gray-900 rounded-full hover:bg-gray-100 transition"
                            >
                                <XCircle size={24} />
                            </button>
                        </div>

                        <div className="p-8 space-y-8">
                            {/* Section 1: Vehicle & Status */}
                            <div className="flex flex-col sm:flex-row gap-6 items-start">
                                <div className="w-full sm:w-32 h-24 bg-gray-100 rounded-xl overflow-hidden shrink-0 border border-gray-200">
                                    <img
                                        src={getCarImage(selectedBooking.carId)}
                                        alt="Car"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-gray-900">{selectedBooking.carId?.name || "Deleted Car"}</h3>
                                    <p className="text-gray-500 font-medium mb-3">{selectedBooking.carId?.brand || "Unknown Brand"}</p>
                                    <div className="flex flex-wrap gap-2">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getStatusColor(selectedBooking.paymentStatus)}`}>
                                            Payment: {selectedBooking.paymentStatus}
                                        </span>
                                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600 border border-gray-200 uppercase tracking-wider">
                                            Status: {selectedBooking.status || "Confirmed"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Section 2: Customer Details */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100 space-y-3">
                                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                        <User size={14} /> Customer Info
                                    </h4>
                                    <div>
                                        <p className="font-bold text-gray-900 text-lg">{selectedBooking.fullName}</p>
                                        <p className="text-sm text-gray-600 flex items-center gap-2 mt-1"><Phone size={14} /> {selectedBooking.phone}</p>
                                        <p className="text-sm text-gray-600 flex items-center gap-2 mt-1"><span className="text-xs font-bold bg-blue-100 text-blue-600 px-1 rounded">@</span> {selectedBooking.email}</p>
                                    </div>
                                    <div className="pt-3 border-t border-gray-200">
                                        <p className="text-xs font-bold text-gray-400 uppercase mb-1">Address</p>
                                        <p className="text-sm text-gray-700 leading-relaxed font-medium">{selectedBooking.address || "No address provided"}</p>
                                    </div>
                                </div>

                                <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100 space-y-3">
                                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                        <CheckCircle size={14} /> Verification & Emergency
                                    </h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-xs font-bold text-gray-400 uppercase">License No.</p>
                                            <p className="font-bold text-gray-900 text-sm mt-0.5">{selectedBooking.licenseNumber || "N/A"}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-400 uppercase">Expiry</p>
                                            <p className="font-bold text-gray-900 text-sm mt-0.5">{selectedBooking.licenseExpiry || "N/A"}</p>
                                        </div>
                                    </div>
                                    <div className="pt-3 border-t border-gray-200">
                                        <p className="text-xs font-bold text-gray-400 uppercase mb-1">Emergency Contact</p>
                                        <p className="text-sm font-bold text-gray-900">{selectedBooking.emergencyName || "N/A"}</p>
                                        <p className="text-xs text-gray-600 font-medium">{selectedBooking.emergencyPhone}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Section 3: Timeline & Payment */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="p-5 bg-blue-50/50 rounded-2xl border border-blue-100 space-y-4">
                                    <h4 className="text-xs font-black text-blue-400 uppercase tracking-wider flex items-center gap-2">
                                        <Calendar size={14} /> Schedule
                                    </h4>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-xs font-bold text-gray-400 uppercase">Pickup</p>
                                            <p className="font-bold text-gray-900 text-lg">{formatDate(selectedBooking.startDate)}</p>
                                        </div>
                                        <div className="h-px flex-1 bg-blue-200 mx-4"></div>
                                        <div className="text-right">
                                            <p className="text-xs font-bold text-gray-400 uppercase">Dropoff</p>
                                            <p className="font-bold text-gray-900 text-lg">{formatDate(selectedBooking.endDate)}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-5 bg-emerald-50/50 rounded-2xl border border-emerald-100 space-y-4">
                                    <h4 className="text-xs font-black text-emerald-500 uppercase tracking-wider flex items-center gap-2">
                                        Payment Summary
                                    </h4>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-bold text-gray-500">Total Amount</span>
                                        <span className="text-lg font-black text-gray-900">₹{selectedBooking.amount?.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-2 border-t border-emerald-100">
                                        <span className="text-sm font-bold text-gray-500">Paid So Far</span>
                                        <span className="text-lg font-black text-emerald-600">₹{(selectedBooking.paidAmount || 0).toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </SellerLayout>
    );
};

export default SellerBookings;
