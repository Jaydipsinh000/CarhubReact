import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const location = useLocation();

  const token = localStorage.getItem("token");
  const userRaw = localStorage.getItem("user");

  /* ❌ No token or user */
  if (!token || !userRaw) {
    return (
      <Navigate
        to="/login"
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  let user;
  try {
    user = JSON.parse(userRaw);
  } catch (err) {
    localStorage.clear();
    return <Navigate to="/login" replace />;
  }

  /* ❌ Not admin */
  if (user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  /* ✅ Admin allowed */
  return children;
};

export default AdminRoute;
