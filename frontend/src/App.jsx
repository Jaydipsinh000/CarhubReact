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

// Admin
import AdminDashboard from "./admin/AdminDashboard.jsx";
import AdminCars from "./admin/AdminCars.jsx";
import AdminRoute from "./Route/AdminRoute.jsx";
import AdminAddCar from "./admin/AdminAddCar.jsx";
import ProtectedRoute from "./Route/ProtectedRoute.jsx";
import AdminUpdateCar from "./admin/AdminUpdate.jsx";
import BookCar from "./Pages/BookCar.jsx";
import AdminBulkAddCars from "./admin/AdminBulkAddCars.jsx";
import MyBookings from "./Pages/MyBookings.jsx";
import AdminUsers from "./admin/AdminUsers.jsx";
import AdminBookings from "./admin/AdminBookings.jsx";
import AdminPayments from "./admin/AdminPayments.jsx";

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
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {/* ❌ No Header for Admin */}
      {!isAdminRoute && <Header user={user} setUser={setUser} />}

      <Routes>
        {/* ===== PUBLIC ROUTES ===== */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/cars" element={<Cars />} />
        <Route path="/cars/:id" element={<CarDetails />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/register" element={<Register setUser={setUser} />} />
        <Route path="/verify-otp" element={<VerifyOtp setUser={setUser} />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/book/:id" element={<BookCar />} />
        <Route path="/my-bookings" element={<MyBookings />} />

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
      </Routes>

      {/* ❌ No Footer for Admin */}
      {!isAdminRoute && <Footer />}
    </>
  );
};

export default App;
