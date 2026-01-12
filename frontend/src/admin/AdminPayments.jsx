import AdminLayout from "./AdminLayout.jsx";
import React, { useEffect, useState } from "react";
import api from "../Services/api.js";
import { Search, CreditCard, DollarSign, Calendar, User } from "lucide-react";

const AdminPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await api.get("/admin/payments");
      setPayments(res.data.payments);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredPayments = payments.filter(
    (p) =>
      p.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.carId?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight font-display">
            Payment History
          </h1>
          <p className="text-gray-500 mt-1">Track all transaction records and financial status.</p>
        </div>

        {/* CONTROLS */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="relative max-w-md">
            <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by payer or car..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition"
            />
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-gray-500">
              <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              Loading payments...
            </div>
          ) : filteredPayments.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <DollarSign size={48} className="mx-auto mb-4 text-gray-300" />
              <p>No payments found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50/50 border-b border-gray-100">
                  <tr className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <th className="px-6 py-4">Transaction Details</th>
                    <th className="px-6 py-4">Payer</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredPayments.map((p) => (
                    <tr key={p._id} className="hover:bg-blue-50/30 transition group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                            <CreditCard size={18} />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{p.carId?.name || "Deleted Car"}</p>
                            <p className="text-xs text-gray-500">
                              {p.carId?.createdBy ? `Owner: ${p.carId.createdBy.name}` : "Owner: Admin"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <User size={14} className="text-gray-400" />
                          <div>
                            <p className="font-medium text-gray-900 text-sm">{p.user?.name}</p>
                            <p className="text-xs text-gray-500">{p.user?.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-bold text-gray-900">
                        ₹{p.amount?.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${p.paymentStatus === "paid"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                            : "bg-yellow-50 text-yellow-700 border-yellow-100"
                            }`}
                        >
                          {p.paymentStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500 text-xs">
                        <div className="flex items-center gap-1">
                          <Calendar size={12} />
                          {new Date(p.createdAt).toLocaleDateString()}{" "}
                          {new Date(p.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminPayments;
