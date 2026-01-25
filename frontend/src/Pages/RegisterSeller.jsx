import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../Services/api.js";
import { Mail, Lock, User, Phone, ArrowRight, Briefcase } from "lucide-react";
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";

const RegisterSeller = () => {
    const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });
    const [file, setFile] = useState(null); // File state
    const navigate = useNavigate();

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
    const handleFileChange = (e) => setFile(e.target.files[0]);

    // Handle Google Sign-in for Sellers
    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            const decoded = jwtDecode(credentialResponse.credential);

            // Call Google Login endpoint with ROLE="seller"
            const res = await api.post("/user/google", {
                name: decoded.name,
                email: decoded.email,
                googleId: decoded.sub,
                photo: decoded.picture,
                role: "seller" // IMPORTANT: Request seller role
            });

            const userData = res.data.user;
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(userData));

            toast.success("Account Created via Google!");
            navigate("/seller/dashboard"); // They will see "Pending" screen if needed
        } catch (err) {
            console.error(err);
            toast.error("Google Sign-in Failed");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (!file) {
                toast.error("Please upload ID/Business Proof");
                return;
            }

            const fd = new FormData();
            fd.append("name", form.name);
            fd.append("email", form.email);
            fd.append("password", form.password);
            fd.append("phone", form.phone);
            fd.append("role", "seller");
            fd.append("document", file); // Must match backend field name

            // Make sure headers are set correctly by axios (multipart/form-data)
            const res = await api.post("/user/register", fd, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            toast.success(res.data.message || "Application Submitted! Please Login.");
            navigate("/login");
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Registration failed");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] p-4 relative overflow-hidden">
            {/* BACKGROUND ELEMENTS */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
                <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
            </div>

            <div className="bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl w-full max-w-5xl flex overflow-hidden border border-white/50 z-10 relative">

                {/* LEFT BRANDING AREA (Seller Themed) */}
                <div className="hidden md:flex flex-col justify-center items-center w-5/12 bg-gray-900 text-white p-12 relative overflow-hidden">
                    <div className="absolute inset-0 bg-yellow-600/20 blur-3xl z-0"></div>
                    <div className="relative z-10 text-center">
                        <h1 className="text-4xl font-bold font-display tracking-tight mb-6">Become a <span className="text-yellow-500">Partner</span></h1>
                        <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                            List your cars, manage bookings, and earn with Carent. Join our network of premium sellers today.
                        </p>
                        <div className="bg-white/10 p-4 rounded-xl border border-white/10 backdrop-blur-sm">
                            <Briefcase size={40} className="text-yellow-500 mx-auto mb-2" />
                            <p className="text-sm font-medium">Business Dashboard Access</p>
                        </div>
                    </div>
                </div>

                {/* RIGHT FORM AREA */}
                <div className="w-full md:w-7/12 p-8 md:p-12 lg:p-16 bg-white">
                    <div className="max-w-md mx-auto">
                        <div className="text-center md:text-left mb-8">
                            <h2 className="text-3xl font-bold text-gray-900 font-display">Seller Registration</h2>
                            <p className="text-gray-500 mt-2">Start your car rental business.</p>
                        </div>

                        {/* REGISTER FORM */}
                        <div className="mb-6 flex justify-center">
                            <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={() => toast.error("Google Sign-in Failed")}
                                useOneTap
                                theme="filled_blue"
                                size="large"
                                text="signup_with"
                                shape="pill"
                                width="300"
                            />
                        </div>

                        <div className="relative flex items-center justify-center mb-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200"></div>
                            </div>
                            <span className="relative bg-white px-4 text-sm text-gray-500 font-medium uppercase tracking-wide">Or via form</span>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Name */}
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Full Name / Business Name"
                                        value={form.name}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 outline-none transition text-sm"
                                        required
                                    />
                                </div>
                                {/* Phone */}
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        name="phone"
                                        placeholder="Business Phone"
                                        value={form.phone}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 outline-none transition text-sm"
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
                                    placeholder="Business Email"
                                    value={form.email}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 outline-none transition text-sm"
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
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 outline-none transition text-sm"
                                    required
                                />
                            </div>

                            {/* Document Upload */}
                            <div className="relative group">
                                <label className="flex items-center gap-4 px-4 py-3 bg-gray-50 border border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-100 transition-all">
                                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                                        <Briefcase size={20} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-gray-800 text-sm truncate">
                                            {file ? file.name : "Upload Business Proof or ID"}
                                        </p>
                                        <p className="text-xs text-gray-400">Required for manual verification</p>
                                    </div>
                                    <input
                                        type="file"
                                        onChange={handleFileChange}
                                        accept="image/*,.pdf"
                                        className="hidden"
                                        required
                                    />
                                </label>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-black hover:bg-gray-800 text-white font-bold py-3.5 rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-2 mt-4"
                            >
                                Submit Application <ArrowRight size={18} />
                            </button>
                        </form>

                        <p className="mt-8 text-center text-gray-600">
                            Not a seller?{" "}
                            <Link to="/register" className="text-blue-600 font-bold hover:underline">
                                User Sign Up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
};

export default RegisterSeller;
