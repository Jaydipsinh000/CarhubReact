import React from "react";
import SellerLayout from "./SellerLayout.jsx";
import { Car, TrendingUp, CalendarCheck } from "lucide-react";

const SellerDashboard = () => {
    // Determine greeting based on time of day
    const hour = new Date().getHours();
    const greeting = hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";
    const user = JSON.parse(localStorage.getItem("user"));

    return (
        <SellerLayout>
            <div className="max-w-6xl mx-auto space-y-8">

                {/* WELCOME BANNER */}
                <div className="bg-black text-white p-8 rounded-3xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500 rounded-full blur-[80px] opacity-20 -mr-16 -mt-16"></div>
                    <div className="relative z-10">
                        <h1 className="text-3xl font-bold font-display mb-2">{greeting}, {user?.name?.split(" ")[0]}! 👋</h1>
                        <p className="text-gray-400 max-w-lg">
                            Manage your fleet and track your earnings. You are currently on the Partner plan.
                        </p>
                    </div>
                </div>

                {/* STATS GRID */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-40">
                        <div className="flex justify-between items-start">
                            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                                <Car size={24} />
                            </div>
                            <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded-md">Live</span>
                        </div>
                        <div>
                            <h3 className="text-3xl font-bold text-gray-900">0</h3>
                            <p className="text-sm text-gray-500 font-medium">Active Listings</p>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-40">
                        <div className="flex justify-between items-start">
                            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                                <CalendarCheck size={24} />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-3xl font-bold text-gray-900">0</h3>
                            <p className="text-sm text-gray-500 font-medium">Total Bookings</p>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-40">
                        <div className="flex justify-between items-start">
                            <div className="p-3 bg-yellow-50 text-yellow-600 rounded-xl">
                                <TrendingUp size={24} />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-3xl font-bold text-gray-900">₹0</h3>
                            <p className="text-sm text-gray-500 font-medium">Total Earnings</p>
                        </div>
                    </div>
                </div>

            </div>
        </SellerLayout>
    );
};

export default SellerDashboard;
