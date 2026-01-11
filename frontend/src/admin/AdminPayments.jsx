import AdminLayout from "./AdminLayout.jsx";
import React, { useEffect, useState } from "react";
import api from "../Services/api.js";

const AdminPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
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
    fetchPayments();
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">💳 Payments</h1>

        {loading ? (
          <p className="text-gray-500">Loading payments...</p>
        ) : (
          <div className="bg-white shadow-lg rounded-2xl p-6 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-gray-600 text-sm">#</th>
                  <th className="px-4 py-2 text-gray-600 text-sm">Payer</th>
                  <th className="px-4 py-2 text-gray-600 text-sm">To (Owner)</th>
                  <th className="px-4 py-2 text-gray-600 text-sm">Amount</th>
                  <th className="px-4 py-2 text-gray-600 text-sm">Status</th>
                  <th className="px-4 py-2 text-gray-600 text-sm">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {payments.map((p, i) => (
                  <tr key={p._id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3">{i + 1}</td>

                    {/* PAYER */}
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{p.user?.name}</div>
                      <div className="text-xs text-gray-500">{p.user?.email}</div>
                    </td>

                    {/* OWNER */}
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-900">{p.carId?.name}</div>
                      {p.carId?.createdBy ? (
                        <div className="text-xs text-yellow-600 font-medium">Seller: {p.carId.createdBy.name}</div>
                      ) : (
                        <div className="text-xs text-gray-400">Admin</div>
                      )}
                    </td>

                    <td className="px-4 py-3 font-semibold">₹{p.amount}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${p.paymentStatus === "paid"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                          }`}
                      >
                        {p.paymentStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-sm">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminPayments;
