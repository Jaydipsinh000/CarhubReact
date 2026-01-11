import AdminLayout from "./AdminLayout.jsx";
import React, { useEffect, useState } from "react";
import api from "../Services/api.js";

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await api.get("/admin/bookings");
        setBookings(res.data.bookings);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">📅 Bookings</h1>

        {loading ? (
          <p className="text-gray-500">Loading bookings...</p>
        ) : (
          <div className="bg-white shadow-lg rounded-2xl p-6 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-gray-600 text-sm">#</th>
                  <th className="px-4 py-2 text-gray-600 text-sm">Booked By</th>
                  <th className="px-4 py-2 text-gray-600 text-sm">Car & Owner</th>
                  <th className="px-4 py-2 text-gray-600 text-sm">Dates</th>
                  <th className="px-4 py-2 text-gray-600 text-sm">Amount</th>
                  <th className="px-4 py-2 text-gray-600 text-sm">Payment</th>
                  <th className="px-4 py-2 text-end text-gray-600 text-sm">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {bookings.map((b, i) => (
                  <tr key={b._id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3">{i + 1}</td>

                    {/* BOOKED BY */}
                    <td className="px-4 py-3">
                      <div className="font-bold text-gray-900">{b.user?.name}</div>
                      <div className="text-xs text-gray-500">{b.user?.email}</div>
                    </td>

                    {/* CAR & OWNER */}
                    <td className="px-4 py-3">
                      <div className="font-bold text-gray-900">{b.carId?.name || "Deleted Car"}</div>
                      {b.carId?.createdBy ? (
                        <div className="text-xs text-gray-500">
                          Owner: <span className="font-medium text-yellow-600">{b.carId.createdBy.name}</span>
                        </div>
                      ) : (
                        <div className="text-xs text-gray-400">Owner: Admin</div>
                      )}
                    </td>

                    <td className="px-4 py-3">
                      {new Date(b.startDate).toLocaleDateString()} –{" "}
                      {new Date(b.endDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 font-semibold">₹{b.amount}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${b.paymentStatus === "paid"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                          }`}
                      >
                        {b.paymentStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-end">
                      <button
                        onClick={() => handleDeleteBooking(b._id)}
                        className="text-red-600 hover:text-red-800 font-medium text-sm"
                      >
                        Delete
                      </button>
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

export default AdminBookings;

