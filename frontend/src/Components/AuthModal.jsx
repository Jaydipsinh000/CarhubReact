import React from "react";
import { X, LogIn, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AuthModal = ({ isOpen, onClose }) => {
    const navigate = useNavigate();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* BACKDROP */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* MODAL */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fadeIn scale-100">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <X size={20} className="text-gray-500" />
                </button>

                <div className="p-8 text-center">
                    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <LogIn size={32} />
                    </div>

                    <h2 className="text-2xl font-bold font-display text-gray-900 mb-2">
                        Login Required
                    </h2>
                    <p className="text-gray-500 mb-8">
                        Please login or create an account to book your premium ride.
                    </p>

                    <div className="space-y-3">
                        <button
                            onClick={() => navigate("/login")}
                            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-transform active:scale-95"
                        >
                            <LogIn size={18} />
                            Login to Continue
                        </button>

                        <button
                            onClick={() => navigate("/register")}
                            className="w-full py-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
                        >
                            <UserPlus size={18} />
                            Create New Account
                        </button>

                        <button
                            onClick={onClose}
                            className="w-full py-2 text-gray-400 hover:text-gray-600 text-sm font-medium transition-colors"
                        >
                            Maybe later
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthModal;
