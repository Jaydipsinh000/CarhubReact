import React, { useEffect, useState } from "react";
import SellerLayout from "./SellerLayout.jsx";
import { Link, useNavigate } from "react-router-dom";
import api from "../Services/api.js";
import {
    Edit,
    Trash2,
    Plus,
    Fuel,
    Users,
    Zap,
    Search,
    Filter,
    Car,
    Eye,
    Calendar,
    DollarSign,
    MoreHorizontal
} from "lucide-react";
import { getCarImage } from "../utils/imageUtils";
import { toast } from "react-toastify";

const SellerCars = () => {
    const [cars, setCars] = useState([]);
    const [filteredCars, setFilteredCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState("all");
    const navigate = useNavigate();

    useEffect(() => {
        fetchMyCars();
    }, []);

    useEffect(() => {
        filterCars();
    }, [searchTerm, filterType, cars]);

    const fetchMyCars = async () => {
        try {
            const res = await api.get("/cars/my-cars");
            setCars(res.data.cars);
            setFilteredCars(res.data.cars);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load cars");
        } finally {
            setLoading(false);
        }
    };

    const filterCars = () => {
        let filtered = cars;

        if (searchTerm) {
            filtered = filtered.filter(car =>
                car.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                car.brand.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (filterType !== "all") {
            filtered = filtered.filter(car => car.listingType === filterType);
        }

        setFilteredCars(filtered);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this car?")) return;
        try {
            await api.delete(`/cars/delete/${id}`);
            toast.success("Car deleted successfully!");
            fetchMyCars();
        } catch (error) {
            toast.error("Failed to delete car");
        }
    };

    // Stats
    const totalCars = cars.length;
    const rentCars = cars.filter(c => c.listingType === "Rent").length;
    const sellCars = cars.filter(c => c.listingType === "Sell").length;

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

                {/* HEADER SECTION */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
                    <div>
                        <h1 className="text-4xl font-black text-gray-900 font-display tracking-tight">
                            My Fleet <span className="text-blue-600">.</span>
                        </h1>
                        <p className="text-gray-500 mt-2 font-medium">
                            Manage your vehicle inventory and listings
                        </p>
                    </div>
                    <Link
                        to="/seller/add-car"
                        className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3.5 rounded-2xl font-black text-sm hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/20 transition-all duration-300"
                    >
                        <Plus size={20} /> Add New Vehicle
                    </Link>
                </div>

                {/* STATS OVERVIEW */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all duration-500">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-bl-[4rem] transition-transform group-hover:scale-110"></div>
                        <div className="relative z-10 flex flex-col h-full justify-between">
                            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
                                <Car size={24} />
                            </div>
                            <div>
                                <h3 className="text-3xl font-black text-gray-900 mb-1">{totalCars}</h3>
                                <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Total Vehicles</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all duration-500">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50/50 rounded-bl-[4rem] transition-transform group-hover:scale-110"></div>
                        <div className="relative z-10 flex flex-col h-full justify-between">
                            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-4">
                                <Calendar size={24} />
                            </div>
                            <div>
                                <h3 className="text-3xl font-black text-gray-900 mb-1">{rentCars}</h3>
                                <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">For Rent</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all duration-500">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50/50 rounded-bl-[4rem] transition-transform group-hover:scale-110"></div>
                        <div className="relative z-10 flex flex-col h-full justify-between">
                            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-4">
                                <DollarSign size={24} />
                            </div>
                            <div>
                                <h3 className="text-3xl font-black text-gray-900 mb-1">{sellCars}</h3>
                                <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">For Sale</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* FILTERS & CONTENT */}
                <div className="bg-white p-2 rounded-[2.5rem] border border-gray-100 shadow-sm">
                    {/* TOOLBAR */}
                    <div className="p-4 flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative group">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                            <input
                                type="text"
                                placeholder="Search inventory..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-6 py-4 bg-gray-50/50 border-none rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all outline-none font-medium placeholder:text-gray-400"
                            />
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Filter size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                <select
                                    value={filterType}
                                    onChange={(e) => setFilterType(e.target.value)}
                                    className="pl-12 pr-10 py-4 bg-gray-50/50 hover:bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-100 outline-none font-bold text-gray-700 cursor-pointer appearance-none min-w-[160px]"
                                >
                                    <option value="all">All Vehicles</option>
                                    <option value="Rent">For Rent</option>
                                    <option value="Sell">For Sale</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* GRID */}
                    <div className="p-4">
                        {filteredCars.length === 0 ? (
                            <div className="text-center py-20 bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-100">
                                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                                    <Car size={32} className="text-gray-300" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">No vehicles found</h3>
                                <p className="text-gray-500 max-w-xs mx-auto">
                                    Try adjusting your search or add a new vehicle to your fleet.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredCars.map(car => (
                                    <div
                                        key={car._id}
                                        className="group bg-white rounded-[2rem] border border-gray-100 overflow-hidden hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-300 relative"
                                    >
                                        {/* IMAGE AREA */}
                                        <div className="h-64 overflow-hidden relative">
                                            <div className="absolute top-4 left-4 z-10 flex gap-2">
                                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md shadow-sm border ${car.listingType === "Rent"
                                                        ? "bg-white/90 text-blue-600 border-white/50"
                                                        : "bg-white/90 text-amber-600 border-white/50"
                                                    }`}>
                                                    {car.listingType}
                                                </span>
                                            </div>

                                            <img
                                                src={getCarImage(car)}
                                                alt={car.name}
                                                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                                            />

                                            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent"></div>

                                            <div className="absolute bottom-4 left-6 text-white">
                                                <p className="text-xs font-bold uppercase tracking-wider opacity-90 mb-1">{car.brand}</p>
                                                <h3 className="text-xl font-black tracking-tight">{car.name}</h3>
                                            </div>
                                        </div>

                                        {/* INFO AREA */}
                                        <div className="p-6">
                                            {/* SPECS ROW */}
                                            <div className="flex items-center justify-between gap-2 mb-6 text-xs font-bold text-gray-500">
                                                <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-2 rounded-xl">
                                                    <Fuel size={14} className="text-blue-500" />
                                                    {car.fuelType}
                                                </div>
                                                <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-2 rounded-xl">
                                                    <Zap size={14} className="text-amber-500" />
                                                    {car.transmission}
                                                </div>
                                                <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-2 rounded-xl">
                                                    <Users size={14} className="text-emerald-500" />
                                                    {car.seats} Seats
                                                </div>
                                            </div>

                                            {/* PRICE & ACTIONS */}
                                            <div className="flex items-end justify-between border-t border-gray-50 pt-6">
                                                <div>
                                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Price</p>
                                                    <div className="flex items-baseline gap-1">
                                                        <span className="text-2xl font-black text-gray-900">₹{car.pricePerDay.toLocaleString()}</span>
                                                        <span className="text-xs font-bold text-gray-400">/{car.listingType === "Sell" ? "total" : "day"}</span>
                                                    </div>
                                                </div>

                                                <div className="flex gap-2">
                                                    <Link
                                                        to={`/seller/cars/update/${car._id}`}
                                                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 text-gray-600 hover:bg-black hover:text-white transition-colors"
                                                        title="Edit Vehicle"
                                                    >
                                                        <Edit size={18} />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(car._id)}
                                                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                                                        title="Delete Vehicle"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </SellerLayout>
    );
};

export default SellerCars;
