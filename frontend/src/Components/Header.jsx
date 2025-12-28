import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  // Safe auth read
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

  const firstLetter = user?.name?.charAt(0).toUpperCase() || "U";

  // Close dropdown on outside click
  useEffect(() => {
    const close = () => setDropdownOpen(false);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  const closeMenuAndNavigate = (path) => {
    setMenuOpen(false);
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.clear();
    setDropdownOpen(false);
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* LOGO */}
          <Link to="/" className="text-2xl font-bold">
            Car<span className="text-blue-600">ent</span>
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex gap-8">
            <Link to="/" className="nav-link">
              Home
            </Link>
            <Link to="/cars" className="nav-link">
              Cars
            </Link>
            <Link to="/about" className="nav-link">
              About
            </Link>
            <Link to="/contact" className="nav-link">
              Contact
            </Link>
          </nav>

          {/* RIGHT SIDE */}
          <div className="hidden md:flex items-center gap-4 relative">
            {!token ? (
              <>
                <Link
                  to="/register"
                  className="px-4 py-2 border rounded-md hover:bg-gray-100"
                >
                  Get Started
                </Link>
              </>
            ) : (
              <>
                {/* Avatar */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setDropdownOpen(!dropdownOpen);
                  }}
                  className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center"
                >
                  {firstLetter}
                </button>

                {/* DROPDOWN */}
                {dropdownOpen && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="absolute right-0 top-14 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-fadeIn"
                  >
                    {/* USER INFO */}
                    <div className="px-5 py-4 bg-gray-50 border-b">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-lg">
                          {user?.name?.charAt(0).toUpperCase() || "U"}
                        </div>

                        <div>
                          <p className="font-semibold text-gray-800">
                            {user?.name || "User"}
                          </p>
                          <p className="text-sm text-gray-500 truncate max-w-[180px]">
                            {user?.email || "user@email.com"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* MENU */}
                    <div className="py-2">
                      <button
                        onClick={() => navigate("/profile")}
                        className="flex items-center gap-3 w-full px-5 py-3 text-gray-700 hover:bg-gray-100 transition"
                      >
                        <span className="text-lg">👤</span>
                        <span className="font-medium">Profile</span>
                      </button>
                      {user?.role === "admin" && (
                        <button
                          onClick={() => navigate("/admin/dashboard")}
                          className="flex items-center gap-3 w-full px-5 py-3 text-gray-700 hover:bg-gray-100 transition"
                        >
                          <span className="text-lg">📊</span>
                          <span className="font-medium">Dashbord</span>
                        </button>
                      )}

                      <button
                        onClick={() => navigate("/bookings")}
                        className="flex items-center gap-3 w-full px-5 py-3 text-gray-700 hover:bg-gray-100 transition"
                      >
                        <span className="text-lg">🚗</span>
                        <span className="font-medium">My Bookings</span>
                      </button>
                    </div>

                    {/* LOGOUT */}
                    <div className="border-t">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-5 py-3 text-red-600 hover:bg-red-50 transition font-medium"
                      >
                        <span className="text-lg">🚪</span>
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-2xl"
          >
            ☰
          </button>
        </div>

        {/* MOBILE MENU */}
        {menuOpen && (
          <div className="md:hidden py-4 space-y-4">
            <Link to="/" className="block" onClick={() => setMenuOpen(false)}>
              Home
            </Link>
            <Link
              to="/cars"
              className="block"
              onClick={() => setMenuOpen(false)}
            >
              Cars
            </Link>
            <Link
              to="/about"
              className="block"
              onClick={() => setMenuOpen(false)}
            >
              About
            </Link>
            <Link
              to="/contact"
              className="block"
              onClick={() => setMenuOpen(false)}
            >
              Contact
            </Link>

            {!token ? (
              <Link
                to="/register"
                className="block text-center py-2 bg-black text-white rounded"
                onClick={() => setMenuOpen(false)}
              >
                Get Started
              </Link>
            ) : (
              <div className="border-t pt-4">
                <button
                  onClick={() => closeMenuAndNavigate("/profile")}
                  className="mobile-btn"
                >
                  👤 Profile
                </button>

                <button
                  onClick={() => closeMenuAndNavigate("/bookings")}
                  className="mobile-btn"
                >
                  🚗 My Bookings
                </button>

                <button
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  className="mobile-btn text-red-600"
                >
                  🚪 Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
