import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getWishlist, toggleWishlist } from "../Services/wishlistApi";
import { getCarImage } from "../utils/imageUtils";
import { Calendar, Gauge, Fuel, Users, ArrowRight, Heart, Trash2, MapPin } from "lucide-react";
import CarLoader from "../Components/CarLoader";

const Wishlist = () => {
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchWishlist();
    }, []);

    const fetchWishlist = async () => {
        try {
            const res = await getWishlist();
            setWishlist(res.data.wishlist || []);
        } catch (error) {
            console.error("Failed to fetch wishlist", error);
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (carId) => {
        try {
            await toggleWishlist(carId);
            // Remove from local state immediately
            setWishlist((prev) => prev.filter((car) => car._id !== carId));
        } catch (error) {
            console.error("Failed to remove from wishlist", error);
        }
    };

    if (loading) return <div className="min-h-screen flex justify-center items-center"><CarLoader /></div>;

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            {/* HEADER */}
            <div className="bg-[#0F172A] text-white pt-32 pb-16 px-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="max-w-7xl mx-auto relative z-10 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold font-display tracking-tight mb-4">
                        Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-red-400">Wishlist</span>
                    </h1>
                    <p className="text-gray-400 text-lg">Saved vehicles for your future adventures.</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-12">
                {wishlist.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
                        <div className="w-20 h-20 bg-red-50 text-red-400 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Heart size={40} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
                        <p className="text-gray-500 mb-8">Start exploring our fleet and save your favorites here.</p>
                        <Link to="/cars" className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-700 transition">
                            Explore Cars <ArrowRight size={18} />
                        </Link>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {wishlist.map((car) => (
                            <div key={car._id} className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col relative">

                                {/* Remove Button */}
                                <button
                                    onClick={() => handleRemove(car._id)}
                                    className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur p-2 rounded-full text-red-500 hover:bg-red-50 transition shadow-sm"
                                    title="Remove from Wishlist"
                                >
                                    <Trash2 size={18} />
                                </button>

                                {/* IMAGE */}
                                <div onClick={() => navigate(`/cars/${car._id}`)} className="h-56 overflow-hidden relative cursor-pointer bg-gray-100">
                                    <img
                                        src={getCarImage(car)}
                                        alt={car.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 content-end p-4">
                                        <p className="text-white font-bold flex items-center gap-2">
                                            <MapPin size={16} className="text-blue-400" /> View Details
                                        </p>
                                    </div>
                                </div>

                                {/* CONTENT */}
                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="mb-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <h2 onClick={() => navigate(`/cars/${car._id}`)} className="text-xl font-bold text-gray-900 font-display hover:text-blue-600 transition cursor-pointer line-clamp-1">{car.name}</h2>
                                            <span className="bg-blue-50 text-blue-600 text-xs font-bold px-2 py-1 rounded-lg border border-blue-100">{car.brand}</span>
                                        </div>

                                        <div className="flex items-center gap-4 text-gray-500 text-sm mt-3">
                                            <div className="flex items-center gap-1"><Fuel size={14} /> {car.fuelType}</div>
                                            <div className="flex items-center gap-1"><Gauge size={14} /> {car.transmission}</div>
                                            <div className="flex items-center gap-1"><Users size={14} /> {car.seats} Seats</div>
                                        </div>
                                    </div>

                                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100">
                                        <div>
                                            <p className="text-2xl font-bold text-gray-900">₹{car.pricePerDay}</p>
                                            <p className="text-xs text-gray-400 font-medium">/ day</p>
                                        </div>
                                        <button
                                            onClick={() => navigate(`/cars/${car._id}`)}
                                            className="bg-black text-white px-5 py-2.5 rounded-full font-bold text-sm hover:bg-gray-800 transition shadow-lg shadow-gray-200"
                                        >
                                            Book Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Wishlist;
