import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    Car,
    PlusCircle,
    LogOut,
    Menu,
    X,
    ShoppingBag,
    Bell,
    ChevronRight,
    Search
} from "lucide-react";

const SellerLayout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user"));

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    const navItems = [
        { label: "Dashboard", path: "/seller/dashboard", icon: LayoutDashboard },
        { label: "My Fleet", path: "/seller/cars", icon: Car },
        { label: "Bookings", path: "/seller/bookings", icon: ShoppingBag },
        { label: "Add Vehicle", path: "/seller/add-car", icon: PlusCircle },
    ];

    return (
        <div className="flex bg-[#F1F5F9] min-h-screen font-sans">
            {/* MOBILE OVERLAY */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-indigo-950/60 backdrop-blur-sm lg:hidden transition-opacity duration-300"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* FLOATING SIDEBAR */}
            <aside className={`
                fixed lg:static inset-y-0 left-0 z-50
                w-72 p-4 flex flex-col transition-all duration-300 ease-in-out
                ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
            `}>
                <div className="flex flex-col h-full bg-[#1e1b4b] rounded-[2rem] shadow-2xl shadow-indigo-900/20 px-6 py-8 text-white relative overflow-hidden">
                    {/* Background Accents */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-600/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>

                    {/* LOGO AREA */}
                    <div className="relative z-10 flex items-center justify-between mb-10">
                        <Link to="/" className="flex items-center gap-3 group">
                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform">
                                <Car className="text-white" size={20} />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold font-display tracking-tight leading-none text-white">
                                    Carent
                                </h1>
                                <p className="text-[10px] text-indigo-300 font-bold uppercase tracking-widest mt-0.5">Partner</p>
                            </div>
                        </Link>
                        <button
                            className="lg:hidden p-2 text-indigo-200 hover:text-white"
                            onClick={() => setSidebarOpen(false)}
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* USER CARD (Mini) */}
                    <div className="relative z-10 mb-8 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-sm shadow-inner shadow-black/20 text-white">
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-bold text-white truncate">{user?.name}</p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                                <span className="text-[10px] text-indigo-200 font-medium">Online</span>
                            </div>
                        </div>
                    </div>

                    {/* NAV LINKS */}
                    <nav className="relative z-10 flex-1 space-y-2 overflow-y-auto custom-scrollbar-dark">
                        {navItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            const Icon = item.icon;

                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`
                                        flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 group relative overflow-hidden
                                        ${isActive
                                            ? "bg-white text-indigo-950 shadow-lg shadow-white/10"
                                            : "hover:bg-white/10 text-indigo-100 hover:text-white"
                                        }
                                    `}
                                >
                                    <Icon size={20} className={`${isActive ? "text-indigo-600" : "text-indigo-300 group-hover:text-white"} transition-colors`} />
                                    <span className="font-bold text-sm tracking-wide">{item.label}</span>
                                    {isActive && (
                                        <ChevronRight size={16} className="ml-auto text-indigo-400" />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* LOGOUT */}
                    <div className="relative z-10 pt-6 mt-6 border-t border-white/10">
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 w-full px-4 py-3 text-indigo-300 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300 font-medium text-sm group"
                        >
                            <LogOut size={18} className="group-hover:text-rose-400 transition-colors" />
                            <span>Sign Out</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* MAIN CONTENT AREA */}
            <main className="flex-1 min-w-0 h-screen flex flex-col relative overflow-hidden">
                {/* HEADER */}
                <header className="h-24 flex items-center justify-between px-8 md:px-12 py-6">
                    <div className="flex items-center gap-4 lg:hidden">
                        <button
                            className="p-2.5 bg-white text-indigo-950 rounded-xl shadow-sm border border-indigo-50"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <Menu size={22} />
                        </button>
                    </div>

                    {/* Breadcrumbs / Page Title */}
                    <div className="hidden lg:block">
                        <div className="flex items-center gap-2 text-sm font-medium text-indigo-300/80 mb-1">
                            <span>Seller Portal</span>
                            <span className="text-indigo-200">/</span>
                            <span className="text-indigo-950">{location.pathname.split("/").pop().replace("-", " ")}</span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-4 ml-auto">
                        <div className="hidden md:flex items-center gap-3 bg-white pl-4 pr-1 py-1 rounded-full border border-indigo-50 shadow-sm focus-within:ring-2 focus-within:ring-indigo-100 transition-all w-64">
                            <Search size={16} className="text-gray-400" />
                            <input
                                type="text"
                                placeholder="Quick search..."
                                className="bg-transparent border-none outline-none text-sm font-medium w-full placeholder:text-gray-400 text-gray-700"
                            />
                        </div>

                        <button className="relative w-11 h-11 bg-white border border-indigo-50 rounded-full flex items-center justify-center text-indigo-900 shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300">
                            <Bell size={20} />
                            <span className="absolute top-2.5 right-3 w-2 h-2 rounded-full bg-rose-500 border border-white"></span>
                        </button>

                        <div className="hidden md:block w-px h-8 bg-indigo-100 mx-2"></div>

                        <div className="flex items-center gap-3">
                            <div className="text-right hidden md:block">
                                <p className="text-xs font-bold text-gray-900">{user?.name}</p>
                                <p className="text-[10px] text-gray-500 font-medium">Auto-Dealer</p>
                            </div>
                            <img
                                src={`https://ui-avatars.com/api/?name=${user?.name}&background=6366f1&color=fff`}
                                alt="Profile"
                                className="w-10 h-10 rounded-full border-2 border-white shadow-md cursor-pointer hover:border-indigo-200 transition-colors"
                            />
                        </div>
                    </div>
                </header>

                {/* CONTENT */}
                <div className="flex-1 overflow-y-auto px-4 md:px-12 pb-12 custom-scrollbar">
                    {children}
                </div>
            </main>

            {/* STYLES */}
            <style dangerouslySetInnerHTML={{
                __html: `
                .font-display { font-family: 'Outfit', sans-serif; }
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
                
                .custom-scrollbar-dark::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar-dark::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar-dark::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
                .custom-scrollbar-dark::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
            ` }} />
        </div>
    );
};

export default SellerLayout;
