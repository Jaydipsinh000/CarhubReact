import AdminLayout from "./AdminLayout.jsx";
import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/admin/bookings",
          { headers: { Authorization: `Bearer ${token}` } }
        );
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
                  <th className="px-4 py-2 text-gray-600 text-sm">User</th>
                  <th className="px-4 py-2 text-gray-600 text-sm">Car</th>
                  <th className="px-4 py-2 text-gray-600 text-sm">Dates</th>
                  <th className="px-4 py-2 text-gray-600 text-sm">Amount</th>
                  <th className="px-4 py-2 text-gray-600 text-sm">Payment</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {bookings.map((b, i) => (
                  <tr key={b._id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3">{i + 1}</td>
                    <td className="px-4 py-3">
                      {b.user?.name} <br />
                      <small className="text-gray-500">{b.user?.email}</small>
                    </td>
                    <td className="px-4 py-3">{b.carId?.brand} {b.carId?.name}</td>
                    <td className="px-4 py-3">
                      {new Date(b.startDate).toLocaleDateString()} –{" "}
                      {new Date(b.endDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 font-semibold">₹{b.amount}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          b.paymentStatus === "paid"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {b.paymentStatus}
                      </span>
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
