import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* BRAND */}
        <div className="footer-section">
          <h2>
            Car<span>ent</span>
          </h2>
          <p>
            Premium car rental service offering comfort, luxury,
            and affordability across India.
          </p>
        </div>

        {/* LINKS */}
        <div className="footer-section">
          <h3>Quick Links</h3>
          <Link to="/">Home</Link>
          <Link to="/cars">Cars</Link>
          <Link to="/brands">Brands</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
        </div>

        {/* SUPPORT */}
        <div className="footer-section">
          <h3>Support</h3>
          <p>📍 Ahmedabad, India</p>
          <p>📞 +91 98765 43210</p>
          <p>✉ support@carent.com</p>
        </div>
      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} Carent. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
