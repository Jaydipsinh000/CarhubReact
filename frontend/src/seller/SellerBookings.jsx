import React, { useEffect, useState } from "react";
import SellerLayout from "./SellerLayout.jsx";
import api from "../Services/api.js";
import { Calendar, User, Phone, MapPin, Clock } from "lucide-react";
import { getCarImage } from "../utils/imageUtils";

const SellerBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

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

    return (
        <SellerLayout>
            <div className="max-w-6xl mx-auto space-y-6">
                <div>
                    <h1 className="text-2xl font-bold font-display text-gray-900">Bookings & Sales</h1>
                    <p className="text-gray-500 text-sm">Track orders for your vehicles</p>
                </div>

                {loading ? (
                    <div className="text-center py-20">Loading...</div>
                ) : bookings.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 border-dashed">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                            <Calendar size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">No bookings yet</h3>
                        <p className="text-gray-500">Wait for customers to book or buy your cars.</p>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {bookings.map((booking) => (
                            <div key={booking._id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col md:flex-row gap-6">
                                {/* CAR IMAGE */}
                                <div className="w-full md:w-48 h-32 shrink-0 rounded-xl overflow-hidden bg-gray-100">
                                    <img
                                        src={getCarImage(booking.carId)}
                                        alt={booking.carId?.name || "Car"}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* DETAILS */}
                                <div className="flex-1 space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-bold text-lg text-gray-900">{booking.carId?.name}</h3>
                                            <p className="text-sm text-gray-500">{booking.carId?.brand}</p>
                                        </div>
                                        <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${booking.paymentStatus === "paid" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                                            }`}>
                                            {booking.paymentStatus}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <User size={16} className="text-gray-400" />
                                            <span className="font-medium">{booking.fullName}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Phone size={16} className="text-gray-400" />
                                            <span>{booking.phone}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Calendar size={16} className="text-gray-400" />
                                            <span>{formatDate(booking.startDate)} — {formatDate(booking.endDate)}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock size={16} className="text-gray-400" />
                                            <span>Total: <span className="font-bold text-black">₹{booking.amount}</span></span>
                                        </div>
                                    </div>

                                    {booking.address && (
                                        <div className="flex items-start gap-2 text-sm text-gray-500 pt-2 border-t border-gray-50">
                                            <MapPin size={16} className="text-gray-400 mt-0.5 shrink-0" />
                                            <span>{booking.address}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </SellerLayout>
    );
};

export default SellerBookings;
