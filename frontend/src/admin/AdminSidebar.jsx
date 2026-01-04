import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Car, Upload, LogOut } from "lucide-react";

const AdminSidebar = () => {
  const location = useLocation();

  const isActive = (path) =>
    location.pathname === path
      ? "bg-accent/10 text-accent border-r-2 border-accent"
      : "text-slate-400 hover:bg-slate-800 hover:text-white transition-all";

  const navItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Manage Cars", path: "/admin/cars", icon: Car },
    { name: "Bulk Add", path: "/admin/cars/bulk", icon: Upload },
  ];

  return (
    <div className="h-full flex flex-col bg-slate-900 border-r border-slate-800">
      {/* LOGO */}
      <div className="px-6 py-8">
        <h1 className="text-2xl font-bold font-display tracking-tight text-white flex items-center gap-2">
          Car<span className="text-accent">ent</span>
          <span className="text-[10px] py-0.5 px-2 rounded-full bg-slate-800 text-slate-400 border border-slate-700 uppercase tracking-wider">Admin</span>
        </h1>
      </div>

      {/* MENU */}
      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3.5 rounded-lg text-sm font-medium transition-all group ${isActive(
              item.path
            )}`}
          >
            <item.icon className={`w-5 h-5 ${location.pathname === item.path ? "text-accent" : "text-slate-500 group-hover:text-white"}`} />
            {item.name}
          </Link>
        ))}
      </nav>

      {/* FOOTER */}
      <div className="p-4 border-t border-slate-800">
        <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700">
          <p className="text-xs text-slate-400 font-medium">Logged in as Admin</p>
          <p className="text-[10px] text-slate-500 mt-1">v1.0.0 Dashboard</p>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
