import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, User, LogOut, LayoutDashboard, Calendar, ChevronDown } from "lucide-react";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

  const firstLetter = user?.name?.charAt(0).toUpperCase() || "U";

  // Handle Scroll Effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const close = () => setDropdownOpen(false);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    localStorage.clear();
    setDropdownOpen(false);
    navigate("/login");
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Cars", path: "/cars" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled || menuOpen
          ? "bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100" // Glassmorphism when scrolled
          : "bg-transparent text-white" // Transparent on top (Hero)
          } ${location.pathname !== "/" ? "!bg-white !text-gray-900 shadow-sm" : ""}`} // Always white on other pages
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            {/* LOGO */}
            <Link to="/" className="flex items-center gap-2 group">
              <span className={`text-2xl font-bold tracking-tighter transition-colors ${(scrolled || location.pathname !== "/") ? "text-gray-900" : "text-white"
                }`}>
                Car<span className="text-blue-600">ent</span>
              </span>
            </Link>

            {/* DESKTOP NAV */}
            <nav className="hidden md:flex gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-medium transition-colors hover:text-blue-500 ${(scrolled || location.pathname !== "/") ? "text-gray-700" : "text-white/90 hover:text-white"
                    }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* RIGHT SIDE ACTIONS */}
            <div className="hidden md:flex items-center gap-4">
              {!token ? (
                <>
                  <Link
                    to="/register-seller"
                    className={`px-4 py-2 text-sm font-medium rounded-full transition-all ${(scrolled || location.pathname !== "/")
                      ? "text-gray-700 hover:bg-gray-100"
                      : "text-white hover:bg-white/10"
                      }`}
                  >
                    Become a Partner
                  </Link>
                  <Link
                    to="/login"
                    className="px-6 py-2.5 text-sm font-bold bg-blue-600 text-white rounded-full hover:bg-blue-700 transition shadow-lg shadow-blue-500/30"
                  >
                    Login
                  </Link>
                </>
              ) : (
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDropdownOpen(!dropdownOpen);
                    }}
                    className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-full border border-gray-200 bg-white/50 backdrop-blur-sm hover:bg-white transition"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-blue-400 text-white flex items-center justify-center font-bold text-sm shadow-md">
                      {firstLetter}
                    </div>
                    <ChevronDown size={16} className={`text-gray-600 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* DROPDOWN */}
                  {dropdownOpen && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="absolute right-0 top-12 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
                    >
                      <div className="px-5 py-4 bg-gray-50/50 border-b border-gray-100">
                        <p className="font-semibold text-gray-900 truncate">{user?.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                      </div>

                      <div className="p-2 space-y-1">
                        {(user?.role === "admin" || user?.role === "seller") && (
                          <Link
                            to={user.role === "admin" ? "/admin/dashboard" : "/seller/dashboard"}
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition"
                          >
                            <LayoutDashboard size={18} /> Dashboard
                          </Link>
                        )}
                        <Link
                          to="/profile"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 transition"
                        >
                          <User size={18} /> Profile
                        </Link>
                        <Link
                          to="/my-bookings"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 transition"
                        >
                          <Calendar size={18} /> My Bookings
                        </Link>
                      </div>

                      <div className="p-2 border-t border-gray-100">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 w-full px-3 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition"
                        >
                          <LogOut size={18} /> Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* MOBILE TOGGLE */}
            <button
              onClick={() => setMenuOpen(true)}
              className={`md:hidden p-2 rounded-lg transition-colors ${(scrolled || location.pathname !== "/") ? "text-gray-900" : "text-white"
                }`}
            >
              <Menu size={28} />
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE SIDE DRAWER (Overlay) */}
      <div
        className={`fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm transition-opacity duration-300 md:hidden ${menuOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
        onClick={() => setMenuOpen(false)}
      />

      {/* MOBILE SIDE DRAWER (Content) */}
      <div
        className={`fixed top-0 right-0 z-[70] w-[80%] max-w-sm h-full bg-white shadow-2xl transform transition-transform duration-300 ease-out md:hidden ${menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="flex flex-col h-full">
          {/* HEADER */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <span className="text-xl font-bold tracking-tighter text-gray-900">
              Car<span className="text-blue-600">ent</span>
            </span>
            <button
              onClick={() => setMenuOpen(false)}
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition"
            >
              <X size={24} />
            </button>
          </div>

          {/* NAV LINKS */}
          <div className="flex-1 overflow-y-auto py-6 px-6 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`block px-4 py-3 text-lg font-medium rounded-xl transition ${location.pathname === link.path
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-50"
                  }`}
              >
                {link.name}
              </Link>
            ))}

            <hr className="my-6 border-gray-100" />

            {!token ? (
              <div className="space-y-3">
                <Link
                  to="/login"
                  className="block w-full text-center py-3.5 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-200"
                >
                  Login / Sign Up
                </Link>
                <Link
                  to="/register-seller"
                  className="block w-full text-center py-3.5 border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50"
                >
                  Become a Partner
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl mb-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                    {firstLetter}
                  </div>
                  <div className="overflow-hidden">
                    <p className="font-semibold text-gray-900 truncate">{user?.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                  </div>
                </div>

                {(user?.role === "admin" || user?.role === "seller") && (
                  <Link
                    to={user.role === "admin" ? "/admin/dashboard" : "/seller/dashboard"}
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 font-medium rounded-xl hover:bg-gray-50"
                  >
                    <LayoutDashboard size={20} /> Dashboard
                  </Link>
                )}
                <Link
                  to="/profile"
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 font-medium rounded-xl hover:bg-gray-50"
                >
                  <User size={20} /> Profile
                </Link>
                <Link
                  to="/my-bookings"
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 font-medium rounded-xl hover:bg-gray-50"
                >
                  <Calendar size={20} /> My Bookings
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-4 py-3 text-red-600 font-medium rounded-xl hover:bg-red-50"
                >
                  <LogOut size={20} /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
