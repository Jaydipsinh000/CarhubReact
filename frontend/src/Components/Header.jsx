import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";

const Header = ({ user, setUser }) => {
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <div className="header">
      <header>
        <div className="container">
          <div className="logo">
            <Link to="/">
              Car<span>ent</span>
            </Link>
          </div>

          <nav className="nav">
            <Link to="/">Home</Link>
            <Link to="/cars">Cars</Link>
            <Link to="/brands">Brands</Link>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
          </nav>

          <div className="auth">
            {user ? (
              <>
                <Link to="/profile" className="btn register">
                  {user.name || "Profile"}
                </Link>
                <button
                  onClick={handleLogout}
                  className="btn login"
                  style={{ marginLeft: "10px" }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn login">
                  Login
                </Link>
                <Link to="/register" className="btn register">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;
