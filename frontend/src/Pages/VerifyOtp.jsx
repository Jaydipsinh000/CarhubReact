import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../Services/api.js";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Email not found. Please register again.");
      return;
    }

    try {
      // 🔹 VERIFY OTP API
      const res = await api.post("/user/verify-otp", { email, otp });

      /*
        Assume backend response:
        {
          success: true,
          token: "...",
          user: { id, name, email }
        }
      */

      const { token, user } = res.data;

      // 🔹 STORE DATA IN LOCALSTORAGE
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      toast.success("OTP verified successfully 🎉");

      // 🔹 NAVIGATE TO HOME
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "OTP verification failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* LEFT SIDE */}
      <div className="md:w-1/2 bg-blue-600 text-white flex flex-col justify-center items-center p-10">
        <h1 className="text-5xl font-bold mb-4">CarRent</h1>
        <p className="text-lg text-center mb-6">
          Verify your OTP and start renting cars easily and securely.
        </p>
        <img
          src="https://cdn-icons-png.flaticon.com/512/743/743131.png"
          alt="Car"
          className="w-64 h-64"
        />
      </div>

      {/* RIGHT SIDE */}
      <div className="md:w-1/2 flex justify-center items-center bg-gray-100 p-10">
        <div className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-md">
          <h2 className="text-3xl font-bold text-center mb-6">
            Verify OTP
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-400"
              required
            />

            <button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg"
            >
              Verify
            </button>
          </form>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default VerifyOtp;
