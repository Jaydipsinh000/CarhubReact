import React from "react";
import { Navigate } from "react-router-dom";

const SellerRoute = ({ children }) => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user && (user.role === "seller" || user.role === "admin")) {
        return children;
    } else {
        return <Navigate to="/" />;
    }
};

export default SellerRoute;
