import { Link, useLocation } from "react-router-dom";

const AdminSidebar = () => {
  const location = useLocation();

  const isActive = (path) =>
    location.pathname === path
      ? "bg-blue-600 text-white"
      : "text-gray-300 hover:bg-gray-800 hover:text-white";

  return (
    <div className="h-full flex flex-col">
      {/* LOGO */}
      <div className="px-6 py-5 border-b border-gray-800">
        <h1 className="text-2xl font-bold text-white">
          Car<span className="text-blue-500">Rent</span>
        </h1>
        <p className="text-xs text-gray-400 mt-1">Admin Panel</p>
      </div>

      {/* MENU */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        <Link
          to="/admin/dashboard"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${isActive(
            "/admin/dashboard"
          )}`}
        >
          📊 <span className="font-medium">Dashboard</span>
        </Link>

        <Link
          to="/admin/cars"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${isActive(
            "/admin/cars"
          )}`}
        >
          🚗 <span className="font-medium">Manage Cars</span>
        </Link>
      </nav>

      {/* FOOTER */}
      <div className="px-6 py-4 border-t border-gray-800 text-sm text-gray-400">
        © {new Date().getFullYear()} CarRent
      </div>
    </div>
  );
};

export default AdminSidebar;
