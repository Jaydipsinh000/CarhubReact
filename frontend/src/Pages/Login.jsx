import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../Services/api.js";
import { Mail, Lock, LogIn, ArrowRight } from "lucide-react";
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import loginBg from "../assets/login-bg.png";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/user/login", form);
      const userData = res.data.user;
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(userData));
      toast.success("Logged in successfully!");
      if (userData.role === "admin") navigate("/admin/dashboard");
      else if (userData.role === "seller") navigate("/seller/dashboard");
      else navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      console.log("Google User:", decoded);

      const res = await api.post("/user/google", {
        name: decoded.name,
        email: decoded.email,
        googleId: decoded.sub,
        photo: decoded.picture
      });

      const userData = res.data.user;
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(userData));
      toast.success("Logged in successfully!");
      if (userData.role === "admin") navigate("/admin/dashboard");
      else if (userData.role === "seller") navigate("/seller/dashboard");
      else navigate("/");
    } catch (err) {
      console.error(err);
      toast.error("Google Login Failed");
    }
  };

  const handleSocialLogin = (provider) => {
    toast.info(`${provider} login coming soon!`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] p-4 relative overflow-hidden">
      {/* BACKGROUND ELEMENTS */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl w-full max-w-5xl flex overflow-hidden border border-white/50 z-10 relative">


        {/* LEFT BRANDING AREA */}
        <div className="hidden md:flex flex-col justify-center items-center w-5/12 bg-black text-white p-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-blue-900/20 blur-3xl z-0"></div>
          {/* Background Image Overlay */}
          <div className="absolute inset-0 z-0 opacity-40">
            <img src={loginBg} alt="Background" className="w-full h-full object-cover" />
          </div>
          <div className="relative z-10 text-center">
            <h1 className="text-5xl font-bold font-display tracking-tight mb-6 drop-shadow-lg">Car<span className="text-blue-500">Rent</span></h1>
            <p className="text-gray-200 text-lg mb-8 leading-relaxed drop-shadow-md">
              Access your premium fleet, manage bookings, and hit the road in style.
            </p>
          </div>
          {/* Abstract circles */}
          <div className="absolute -bottom-24 -left-24 w-64 h-64 border border-white/10 rounded-full z-10"></div>
          <div className="absolute -bottom-24 -left-24 w-80 h-80 border border-white/5 rounded-full z-10"></div>
        </div>

        {/* RIGHT FORM AREA */}
        <div className="w-full md:w-7/12 p-8 md:p-12 lg:p-16 bg-white">
          <div className="max-w-md mx-auto">
            <div className="text-center md:text-left mb-10">
              <h2 className="text-3xl font-bold text-gray-900 font-display">Welcome Back</h2>
              <p className="text-gray-500 mt-2">Please enter your details to sign in.</p>
            </div>

            {/* SOCIAL BUTTONS */}
            <div className="space-y-3 mb-8">
              <div className="w-full flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => {
                    toast.error("Google Login Failed");
                  }}
                  useOneTap
                  theme="outline"
                  size="large"
                  text="continue_with"
                  shape="circle"
                  width="300px"
                />
              </div>

              <button
                onClick={() => handleSocialLogin('Apple')}
                className="w-full py-3 px-4 bg-black text-white rounded-xl flex items-center justify-center gap-3 hover:opacity-90 transition-opacity"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.74 1.18 0 2.45-1.11 4.14-.99 2.11.16 3.45 1.02 4.3 2.27-3.9 1.94-3.21 7.6 1.48 9.5-.78 1.96-1.74 3.48-3.3 5.33l-.7.12zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                </svg>
                <span className="font-medium">Continue with Apple</span>
              </button>
            </div>

            <div className="relative flex items-center justify-center mb-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <span className="relative bg-white px-4 text-sm text-gray-500 font-medium uppercase tracking-wide">Or via email</span>
            </div>

            {/* EMAIL FORM */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-gray-700">Password</label>
                  <Link to="/forgot-password" className="text-xs text-blue-600 hover:text-blue-700 font-medium">Forgot Password?</Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <LogIn size={20} /> Login
              </button>
            </form>

            <p className="mt-8 text-center text-gray-600">
              Don't have an account?{" "}
              <Link to="/register" className="text-blue-600 font-bold hover:underline">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Login;
