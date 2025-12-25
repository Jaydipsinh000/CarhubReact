import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../Services/api.js";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/user/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      toast.success("Logged in successfully!");
      navigate("/"); // Replace with your dashboard route
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side */}
      <div className="md:w-1/2 bg-blue-600 text-white flex flex-col justify-center items-center p-10">
        <h1 className="text-5xl font-bold mb-4">CarRent</h1>
        <p className="text-lg text-center mb-6">
          Welcome back to CarRent! Login to manage your rentals, track vehicles, and enjoy a seamless car renting experience.
        </p>
        <img src="https://cdn-icons-png.flaticon.com/512/743/743131.png" alt="Car Illustration" className="w-64 h-64 object-contain" />
      </div>

      {/* Right side */}
      <div className="md:w-1/2 flex justify-center items-center bg-gray-100 p-10">
        <div className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-md">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Login</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all duration-300"
            >
              Login
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link to="/register" className="text-blue-600 font-semibold hover:underline">
                Register
              </Link>
            </p>
            <p className="text-gray-500 mt-2 text-sm">
              Forgot password?{" "}
              <Link to="/forgot-password" className="hover:underline text-blue-500">Reset here</Link>
            </p>
          </div>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Login;
