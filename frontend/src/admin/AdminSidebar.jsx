import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Car,
  Upload,
  Users,
  ClipboardList,
  CreditCard,
  LogOut,
  ChevronRight,
} from "lucide-react";

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) =>
    location.pathname.startsWith(path)
      ? "bg-blue-600/10 text-blue-500 border-r-2 border-blue-500"
      : "text-slate-400 hover:bg-white/5 hover:text-white transition-all";

  const navItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Users", path: "/admin/users", icon: Users },
    { name: "Manage Cars", path: "/admin/cars", icon: Car },
    { name: "Bulk Add Cars", path: "/admin/cars/bulk", icon: Upload },
    { name: "Bookings", path: "/admin/bookings", icon: ClipboardList },
    { name: "Payments", path: "/admin/payments", icon: CreditCard },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="h-full flex flex-col bg-slate-950 border-r border-slate-900 shadow-2xl">
      {/* LOGO */}
      <div className="px-6 py-8 flex items-center justify-between">
        <Link to="/admin/dashboard" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-900/50">
            C
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold tracking-tight text-white font-display">
              Carent<span className="text-blue-500">.</span>
            </h1>
            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-medium">
              Admin Panel
            </span>
          </div>
        </Link>
      </div>

      {/* MENU */}
      <nav className="flex-1 px-3 space-y-1">
        <p className="px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2 mt-4">
          Main Menu
        </p>
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium group transition-all duration-200 ${isActive(
              item.path
            )}`}
          >
            <item.icon
              className={`w-5 h-5 transition-colors ${location.pathname.startsWith(item.path)
                  ? "text-blue-500"
                  : "text-slate-500 group-hover:text-white"
                }`}
            />
            <span className="flex-1">{item.name}</span>
            {location.pathname.startsWith(item.path) && (
              <ChevronRight size={14} className="text-blue-500" />
            )}
          </Link>
        ))}
      </nav>

      {/* FOOTER */}
      <div className="p-4 border-t border-slate-900 space-y-3">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/50 border border-slate-800/50">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-xs text-white font-bold">
            A
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-200 truncate">
              Admin Account
            </p>
            <p className="text-xs text-slate-500 truncate">System Admin</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all border border-transparent hover:border-red-500/20"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
