import React, { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import { getPendingSellers, verifySeller } from "../Services/adminApi";
import { CheckCircle, XCircle, AlertCircle, Search, Mail, Phone, User as UserIcon } from "lucide-react";
import { toast } from "react-toastify";

const AdminVerifySellers = () => {
    const [sellers, setSellers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null); // id of seller being processed

    const fetchSellers = async () => {
        try {
            setLoading(true);
            const res = await getPendingSellers();
            if (res.data.success) {
                setSellers(res.data.sellers);
            }
        } catch (error) {
            console.error("Error fetching pending sellers:", error);
            toast.error("Failed to load pending sellers");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSellers();
    }, []);

    const handleVerify = async (sellerId, status, name) => {
        if (!window.confirm(`Are you sure you want to ${status} ${name}?`)) return;

        try {
            setActionLoading(sellerId);
            const res = await verifySeller(sellerId, status);
            if (res.data.success) {
                toast.success(`Seller ${status} successfully`);
                setSellers(sellers.filter(s => s._id !== sellerId));
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            console.error("Verification error:", error);
            toast.error("Failed to update status");
        } finally {
            setActionLoading(null);
        }
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-[60vh]">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 font-display tracking-tight">
                        Verify Sellers
                    </h1>
                    <p className="text-slate-500 font-medium mt-2">
                        Review and approve new seller accounts
                    </p>
                </div>

                {sellers.length === 0 ? (
                    <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm">
                        <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <CheckCircle size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">All Caught Up!</h3>
                        <p className="text-slate-500">There are no pending seller requests at the moment.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {sellers.map((seller) => (
                            <div key={seller._id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold text-xl uppercase">
                                            {seller.name.charAt(0)}
                                        </div>
                                        <span className="bg-amber-50 text-amber-600 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wide flex items-center gap-1">
                                            <AlertCircle size={12} /> Pending
                                        </span>
                                    </div>

                                    <h3 className="text-lg font-bold text-slate-900 mb-1">{seller.name}</h3>

                                    <div className="space-y-2 mt-4">
                                        <div className="flex items-center gap-2 text-sm text-slate-500">
                                            <Mail size={16} className="text-slate-400" />
                                            <span className="truncate">{seller.email}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-slate-500">
                                            <Phone size={16} className="text-slate-400" />
                                            <span>{seller.phone || "No phone"}</span>
                                        </div>
                                    </div>

                                    <div className="mt-6 pt-6 border-t border-slate-50 text-xs text-slate-400 flex justify-between">
                                        <span>Joined:</span>
                                        <span className="font-medium text-slate-600">
                                            {new Date(seller.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>

                                <div className="bg-slate-50 p-4 flex gap-3">
                                    <button
                                        onClick={() => handleVerify(seller._id, "rejected", seller.name)}
                                        disabled={actionLoading === seller._id}
                                        className="flex-1 py-2.5 rounded-xl border border-rose-200 text-rose-600 font-bold text-sm hover:bg-rose-50 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        <XCircle size={16} /> Reject
                                    </button>
                                    <button
                                        onClick={() => handleVerify(seller._id, "approved", seller.name)}
                                        disabled={actionLoading === seller._id}
                                        className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-200 disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {actionLoading === seller._id ? (
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                <CheckCircle size={16} /> Approve
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default AdminVerifySellers;
