import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    Car,
    PlusCircle,
    LogOut,
    Menu,
    X,
    CreditCard,
    ShoppingBag
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
        { label: "My Cars", path: "/seller/cars", icon: Car },
        { label: "Bookings", path: "/seller/bookings", icon: ShoppingBag },
        { label: "Add New Car", path: "/seller/add-car", icon: PlusCircle },
        // { label: "Earnings", path: "/seller/earnings", icon: CreditCard }, // Future scope
    ];

    return (
        <div className="flex bg-[#F8FAFC] min-h-screen">
            {/* MOBILE OVERLAY */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-20 bg-black/50 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* SIDEBAR */}
            <aside className={`
        fixed lg:static inset-y-0 left-0 z-30
        w-64 bg-white border-r border-gray-100 flex flex-col text-gray-800 transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
                {/* LOGO */}
                <div className="h-16 flex items-center px-6 border-b border-gray-100">
                    <Link to="/" className="text-2xl font-bold font-display tracking-tight">
                        Car<span className="text-yellow-500">Partner</span>
                    </Link>
                    <button className="ml-auto lg:hidden" onClick={() => setSidebarOpen(false)}>
                        <X size={20} />
                    </button>
                </div>

                {/* PROFILE */}
                <div className="p-6 border-b border-gray-100 bg-yellow-50/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-yellow-500 text-white flex items-center justify-center font-bold text-lg">
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="overflow-hidden">
                            <p className="font-bold text-sm truncate">{user?.name}</p>
                            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                        </div>
                    </div>
                </div>

                {/* NAV LINKS */}
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                  ${isActive
                                        ? "bg-black text-white shadow-lg shadow-black/20"
                                        : "text-gray-600 hover:bg-gray-100 hover:text-black"
                                    }
                `}
                            >
                                <Icon size={20} className={isActive ? "text-yellow-400" : "text-gray-400 group-hover:text-black"} />
                                <span className="font-medium text-sm">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* LOGOUT */}
                <div className="p-4 border-t border-gray-100">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
                    >
                        <LogOut size={20} />
                        <span className="font-medium text-sm">Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className="flex-1 min-w-0 overflow-hidden flex flex-col">
                {/* TOP HEADER (Mobile Only) */}
                <header className="h-16 bg-white border-b border-gray-100 flex items-center px-4 lg:hidden sticky top-0 z-10">
                    <button onClick={() => setSidebarOpen(true)}>
                        <Menu size={24} />
                    </button>
                    <span className="ml-4 font-bold text-gray-900">Partner Dashboard</span>
                </header>

                {/* PAGE CONTENT */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default SellerLayout;
