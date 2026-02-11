import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-10">
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* BRAND */}
        <div>
          <h2 className="text-2xl font-bold mb-2">
            Car<span className="text-blue-500">ent</span>
          </h2>
          <p className="text-gray-300">
            Premium car rental service offering comfort, luxury,
            and affordability across India.
          </p>
        </div>

        {/* QUICK LINKS */}
        <div>
          <h3 className="text-xl font-semibold mb-2">Quick Links</h3>
          <ul className="space-y-1">
            <li>
              <Link to="/" className="hover:text-blue-400 transition">Home</Link>
            </li>
            <li>
              <Link to="/cars" className="hover:text-blue-400 transition">Cars</Link>
            </li>
            <li>
              <Link to="/brands" className="hover:text-blue-400 transition">Brands</Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-blue-400 transition">About</Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-blue-400 transition">Contact</Link>
            </li>
          </ul>
        </div>

        {/* SUPPORT */}
        <div>
          <h3 className="text-xl font-semibold mb-2">Support</h3>
          <p className="text-gray-300">📍 Lilapur Village, Sanand, Ahmedabad, India</p>
          <p className="text-gray-300">📞 +91 98765 43210</p>
          <p className="text-gray-300">✉ support@carent.com</p>
          <div className="mt-4">
            <Link to="/terms" className="text-sm text-gray-400 hover:text-white transition underline">Terms & Conditions</Link>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 text-gray-400 text-center py-4 mt-4">
        © {new Date().getFullYear()} Carent. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
