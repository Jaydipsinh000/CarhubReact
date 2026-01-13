
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../Services/api.js";
import { Mail, Lock, User, Phone, ArrowRight } from "lucide-react";
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import registerBg from "../assets/register-bg.png";

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/user/register", form);
      toast.success("Registered successfully! OTP sent to your email.");
      navigate("/verify-otp", { state: { email: form.email } });
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
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

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      toast.success("Registered with Google!");
      navigate("/");
    } catch (err) {
      console.error(err);
      toast.error("Google Signup Failed");
    }
  };

  const handleSocialLogin = (provider) => {
    toast.info(`${provider} signup coming soon!`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] p-4 relative overflow-hidden">
      {/* BACKGROUND ELEMENTS */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl w-full max-w-5xl flex overflow-hidden border border-white/50 z-10 relative">

        {/* LEFT BRANDING AREA */}
        <div className="hidden md:flex flex-col justify-center items-center w-5/12 bg-black text-white p-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-blue-900/20 blur-3xl z-0"></div>
          {/* Background Image Overlay */}
          <div className="absolute inset-0 z-0 opacity-40">
            <img src={registerBg} alt="Background" className="w-full h-full object-cover" />
          </div>
          <div className="relative z-10 text-center">
            <h1 className="text-5xl font-bold font-display tracking-tight mb-6 drop-shadow-lg">Join <span className="text-blue-500">Us</span></h1>
            <p className="text-gray-200 text-lg mb-8 leading-relaxed drop-shadow-md">
              Start your journey with us. Premium cars, seamless booking, unforgettable memories.
            </p>
          </div>
          {/* Abstract circles */}
          <div className="absolute -bottom-24 -left-24 w-64 h-64 border border-white/10 rounded-full z-10"></div>
        </div>

        {/* RIGHT FORM AREA */}
        <div className="w-full md:w-7/12 p-8 md:p-12 lg:p-16 bg-white">
          <div className="max-w-md mx-auto">
            <div className="text-center md:text-left mb-8">
              <h2 className="text-3xl font-bold text-gray-900 font-display">Create Account</h2>
              <p className="text-gray-500 mt-2">Sign up to get started.</p>
            </div>

            {/* SOCIAL BUTTONS */}
            <div className="space-y-3 mb-8">
              <div className="w-full flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => {
                    toast.error("Google Signup Failed");
                  }}
                  useOneTap
                  theme="outline"
                  size="large"
                  text="signup_with"
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
                <span className="font-medium">Sign up with Apple</span>
              </button>
            </div>

            <div className="relative flex items-center justify-center mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <span className="relative bg-white px-4 text-sm text-gray-500 font-medium uppercase tracking-wide">Or via email</span>
            </div>

            {/* REGISTER FORM */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition text-sm"
                    required
                  />
                </div>
                {/* Phone */}
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    name="phone"
                    placeholder="Phone Number"
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition text-sm"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition text-sm"
                  required
                />
              </div>

              {/* Password */}
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition text-sm"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 transition-all duration-300 flex items-center justify-center gap-2 mt-4"
              >
                Create Account <ArrowRight size={18} />
              </button>
            </form>

            <div className="mt-8 pt-8 border-t border-gray-100">
              <p className="text-center text-sm text-gray-500 mb-4">Looking to list your car?</p>
              <Link
                to="/register-seller"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-yellow-50 text-yellow-700 font-bold rounded-xl border border-yellow-200 hover:bg-yellow-100 transition-colors"
              >
                Register as a Seller
              </Link>
            </div>

            <p className="mt-6 text-center text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600 font-bold hover:underline">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Register;
