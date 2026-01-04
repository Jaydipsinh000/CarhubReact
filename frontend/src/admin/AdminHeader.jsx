import { Bell, Search, User } from "lucide-react";
import { Link } from "react-router-dom";

const AdminHeader = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="flex justify-between items-center px-8 py-4">
      {/* Search Bar - hidden on mobile, visible on lg */}
      <div className="hidden lg:flex items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 w-96 transition-all focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-400">
        <Search size={18} className="text-gray-400" />
        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent border-none outline-none text-gray-600 text-sm ml-2 w-full placeholder-gray-400"
        />
      </div>

      {/* Mobile Title (visible when search is hidden) */}
      <div className="lg:hidden">
        <h2 className="text-lg font-bold text-gray-800">Carent Admin</h2>
      </div>

      <div className="flex items-center gap-6">
        <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>

        <div className="flex items-center gap-3 pl-6 border-l border-gray-100">
          <div className="text-right hidden md:block">
            <p className="text-sm font-semibold text-gray-800 leading-tight">
              {user?.name || "Admin User"}
            </p>
            <p className="text-xs text-gray-500 font-medium">
              {user?.email || "admin@carent.com"}
            </p>
          </div>

          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-200">
            <span className="font-bold text-sm">
              {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
