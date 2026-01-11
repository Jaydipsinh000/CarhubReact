import React, { useEffect, useState } from "react";
import SellerLayout from "./SellerLayout.jsx";
import { Link, useNavigate } from "react-router-dom";
import api from "../Services/api.js";
import { Edit, Trash2, Plus, Fuel, Armchair, Zap } from "lucide-react";
import { getCarImage } from "../utils/imageUtils"; // Import the utility
import { toast } from "react-toastify";

const SellerCars = () => {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchMyCars();
    }, []);

    const fetchMyCars = async () => {
        try {
            const res = await api.get("/cars/my-cars");
            setCars(res.data.cars);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this car?")) return;
        try {
            await api.delete(`/cars/delete/${id}`);
            toast.success("Car deleted!");
            fetchMyCars();
        } catch (error) {
            toast.error("Failed to delete car");
        }
    }

    return (
        <SellerLayout>
            <div className="max-w-6xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold font-display text-gray-900">My Fleet</h1>
                        <p className="text-gray-500 text-sm">Manage your listed vehicles</p>
                    </div>
                    <Link
                        to="/seller/add-car"
                        className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-xl font-medium hover:bg-gray-800 transition"
                    >
                        <Plus size={18} /> Add Car
                    </Link>
                </div>

                {loading ? (
                    <div className="text-center py-20">Loading...</div>
                ) : cars.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 border-dashed">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                            <Car size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">No cars listed yet</h3>
                        <p className="text-gray-500 mb-6">Start earning by adding your first vehicle.</p>
                        <Link
                            to="/seller/add-car"
                            className="inline-flex items-center gap-2 bg-yellow-500 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-yellow-600 transition shadow-lg shadow-yellow-500/30"
                        >
                            <Plus size={18} /> Add First Car
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {cars.map(car => (
                            <div key={car._id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
                                <div className="h-48 overflow-hidden relative">
                                    <img
                                        src={getCarImage(car)}
                                        alt={car.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-sm px-3 py-1 rounded-md text-xs font-bold text-white uppercase tracking-wider">
                                        {car.listingType || "Rent"}
                                    </div>
                                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wider">
                                        ₹{car.pricePerDay}/{car.listingType === "Sell" ? "total" : "day"}
                                    </div>
                                </div>
                                <div className="p-5">
                                    <h3 className="font-bold text-lg text-gray-900 mb-1">{car.name}</h3>
                                    <p className="text-gray-500 text-sm mb-4">{car.brand}</p>

                                    <div className="flex gap-2 text-xs text-gray-500 mb-6">
                                        <span className="bg-gray-50 px-2 py-1 rounded border border-gray-100 flex items-center gap-1">
                                            <Fuel size={12} /> {car.fuelType}
                                        </span>
                                        <span className="bg-gray-50 px-2 py-1 rounded border border-gray-100 flex items-center gap-1">
                                            <Armchair size={12} /> {car.seats} Seats
                                        </span>
                                    </div>

                                    <div className="flex gap-2 pt-4 border-t border-gray-100">
                                        <Link
                                            to={`/seller/cars/update/${car._id}`}
                                            className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition"
                                        >
                                            <Edit size={16} /> Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(car._id)}
                                            className="flex items-center justify-center p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </SellerLayout>
    );
};

export default SellerCars;
