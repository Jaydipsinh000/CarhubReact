import React, { useState, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";

import Header from "./Components/Header.jsx";
import Footer from "./Components/Footer.jsx";

// Public Pages
import Home from "./Pages/Home.jsx";
import About from "./Pages/About.jsx";
import Contact from "./Pages/Contact.jsx";
import Register from "./Pages/Register.jsx";
import Login from "./Pages/Login.jsx";
import VerifyOtp from "./Pages/VerifyOtp.jsx";
import Profile from "./Pages/Profile.jsx";
import Cars from "./Pages/Cars.jsx";
import CarDetails from "./Pages/CarDetails.jsx";
import Terms from "./Pages/Terms.jsx";
import RegisterSeller from "./Pages/RegisterSeller.jsx";
import ForgotPassword from "./Pages/ForgotPassword.jsx";
import ResetPassword from "./Pages/ResetPassword.jsx";

// Admin
import AdminDashboard from "./admin/AdminDashboard.jsx";
import AdminReports from "./admin/AdminReports.jsx";
import AdminCars from "./admin/AdminCars.jsx";
import AdminRoute from "./Route/AdminRoute.jsx";
import AdminAddCar from "./admin/AdminAddCar.jsx";
import ProtectedRoute from "./Route/ProtectedRoute.jsx";
import AdminUpdateCar from "./admin/AdminUpdate.jsx";
import BookCar from "./Pages/BookCar.jsx";
import BuyCar from "./Pages/BuyCar.jsx";
import AdminBulkAddCars from "./admin/AdminBulkAddCars.jsx";
import MyBookings from "./Pages/MyBookings.jsx";
import AdminUsers from "./admin/AdminUsers.jsx";
import AdminBookings from "./admin/AdminBookings.jsx";
import AdminPayments from "./admin/AdminPayments.jsx";
import AdminVerifySellers from "./admin/AdminVerifySellers.jsx";

// Seller
import SellerRoute from "./Route/SellerRoute.jsx";
import SellerDashboard from "./seller/SellerDashboard.jsx";
import SellerCars from "./seller/SellerCars.jsx";
import SellerAddCar from "./seller/SellerAddCar.jsx";
import SellerUpdateCar from "./seller/SellerUpdateCar.jsx";
import SellerBookings from "./seller/SellerBookings.jsx";
import SellerReports from "./seller/SellerReports.jsx";

import ScrollToTop from "./Components/ScrollToTop.jsx";

const App = () => {
  const [user, setUser] = useState(null);
  const location = useLocation();

  // 🔁 Load user on refresh
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // 🔐 Hide header/footer on admin routes
  // 🔐 Hide header/footer on admin routes or standalone pages
  // 🔐 Hide header/footer on admin routes, seller routes, or standalone pages
  const isStandalone = location.pathname.startsWith("/admin") || location.pathname.startsWith("/seller") || location.pathname === "/terms";

  return (
    <>
      <ScrollToTop />
      {/* ❌ No Header for Admin/Standalone */}
      {!isStandalone && <Header user={user} setUser={setUser} />}

      <Routes>
        {/* ===== PUBLIC ROUTES ===== */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/cars" element={<Cars />} />
        <Route path="/cars/:id" element={<CarDetails />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/register" element={<Register setUser={setUser} />} />
        <Route path="/register-seller" element={<RegisterSeller />} />
        <Route path="/verify-otp" element={<VerifyOtp setUser={setUser} />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/book/:id" element={<BookCar />} />
        <Route path="/buy/:id" element={<BuyCar />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/terms" element={<Terms />} />

        {/* ===== ADMIN ROUTES ===== */}
        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            </AdminRoute>
          }
        />

        <Route
          path="/admin/cars"
          element={
            <AdminRoute>
              <ProtectedRoute>
                <AdminCars />
              </ProtectedRoute>
            </AdminRoute>
          }
        />

        <Route
          path="/admin/addCar"
          element={
            <AdminRoute>
              <ProtectedRoute>
                <AdminAddCar />
              </ProtectedRoute>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/cars/update/:id"
          element={
            <AdminRoute>
              <ProtectedRoute>
                <AdminUpdateCar />
              </ProtectedRoute>
            </AdminRoute>
          }
        />

        <Route
          path="/admin/cars/bulk"
          element={
            <AdminRoute>
              <ProtectedRoute>
                <AdminBulkAddCars />
              </ProtectedRoute>
            </AdminRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <ProtectedRoute>
                <AdminUsers />
              </ProtectedRoute>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/bookings"
          element={
            <AdminRoute>
              <ProtectedRoute>
                <AdminBookings />
              </ProtectedRoute>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/payments"
          element={
            <AdminRoute>
              <ProtectedRoute>
                <AdminPayments />
              </ProtectedRoute>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/reports"
          element={
            <AdminRoute>
              <ProtectedRoute>
                <AdminReports />
              </ProtectedRoute>
            </AdminRoute>
          }
        />

        <Route
          path="/admin/verify-sellers"
          element={
            <AdminRoute>
              <ProtectedRoute>
                <AdminVerifySellers />
              </ProtectedRoute>
            </AdminRoute>
          }
        />

        {/* ===== SELLER ROUTES ===== */}
        <Route path="/seller/dashboard" element={<SellerRoute><SellerDashboard /></SellerRoute>} />
        <Route path="/seller/cars" element={<SellerRoute><SellerCars /></SellerRoute>} />
        <Route path="/seller/bookings" element={<SellerRoute><SellerBookings /></SellerRoute>} />
        <Route path="/seller/add-car" element={<SellerRoute><SellerAddCar /></SellerRoute>} />
        <Route path="/seller/cars/update/:id" element={<SellerRoute><SellerUpdateCar /></SellerRoute>} />
        <Route path="/seller/reports" element={<SellerRoute><SellerReports /></SellerRoute>} />
      </Routes>

      {/* ❌ No Footer for Admin/Standalone */}
      {!isStandalone && <Footer />}
    </>
  );
};

export default App;
