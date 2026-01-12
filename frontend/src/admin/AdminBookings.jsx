import AdminLayout from "./AdminLayout.jsx";
import React, { useEffect, useState } from "react";
import api from "../Services/api.js";
import { getCarImage } from "../utils/imageUtils";
import {
  Search,
  Filter,
  Download,
  Eye,
  Trash2,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Car,
  User,
  ArrowRight,
} from "lucide-react";
import AdminBookingDetails from "./AdminBookingDetails";

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    fetchBookings();
  }, []);

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

  const handleDeleteBooking = async (id) => {
    if (!window.confirm("Are you sure you want to delete this booking?")) return;
    try {
      await api.delete(`/admin/bookings/${id}`);
      setBookings(prev => prev.filter(b => b._id !== id));
    } catch (error) {
      console.error("Failed to delete booking", error);
    }
  }

  // Filter and Search Logic
  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.carId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b._id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || b.paymentStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "pending":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const handleExportCSV = () => {
    if (!filteredBookings.length) return;

    const headers = ["Booking ID", "User Name", "Car Name", "Owner", "Start Date", "End Date", "Amount", "Status"];
    const csvContent = [
      headers.join(","),
      ...filteredBookings.map(b => {
        const ownerName = b.carId?.createdBy?.name || "Admin";
        return [
          b._id,
          `"${b.user?.name || 'N/A'}"`,
          `"${b.carId?.name || 'Unknown'}"`,
          `"${ownerName}"`,
          new Date(b.startDate).toLocaleDateString(),
          new Date(b.endDate).toLocaleDateString(),
          b.amount,
          b.paymentStatus
        ].join(",");
      })
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `bookings_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* HEADER & STATS */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 font-display">Manage Bookings</h1>
            <p className="text-gray-500">Track and manage all vehicle reservations</p>
          </div>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition shadow-sm font-medium"
          >
            <Download size={18} /> Export CSV
          </button>
        </div>

        {/* STATS ROW */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Bookings", value: bookings.length, icon: Calendar, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Active", value: bookings.filter(b => b.paymentStatus === 'paid').length, icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50" },
            { label: "Pending", value: bookings.filter(b => b.paymentStatus === 'pending').length, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
            { label: "Cancelled", value: bookings.filter(b => b.paymentStatus === 'cancelled').length, icon: XCircle, color: "text-red-600", bg: "bg-red-50" },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.bg} ${stat.color}`}>
                <stat.icon size={20} />
              </div>
            </div>
          ))}
        </div>

        {/* MAIN CARD */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          {/* TOOLBAR */}
          <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center bg-gray-50/50">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search by user, car, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition text-sm"
              />
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-9 pr-8 py-2.5 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 text-sm appearance-none cursor-pointer"
                >
                  <option value="all">All Status</option>
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>

          {/* TABLE */}
          {loading ? (
            <div className="p-12 flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 font-medium uppercase tracking-wider text-xs">
                  <tr>
                    <th className="px-6 py-4">Transaction Info</th>
                    <th className="px-6 py-4">Booking Details (User <ArrowRight size={12} className="inline mx-1" /> Owner)</th>
                    <th className="px-6 py-4">Dates</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {paginatedBookings.length > 0 ? (
                    paginatedBookings.map((b) => (
                      <tr key={b._id} className="hover:bg-blue-50/30 transition-colors group">
                        <td className="px-6 py-4 max-w-[200px]">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-10 rounded-lg bg-gray-100 overflow-hidden border border-gray-200 flex-shrink-0">
                              <img
                                src={getCarImage(b.carId)}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-gray-900 truncate" title={b.carId?.name}>{b.carId?.name || "Deleted"}</p>
                              <p className="text-xs text-gray-500 font-mono">#{b._id.slice(-6).toUpperCase()}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1.5">
                            {/* User Line */}
                            <div className="flex items-center gap-2">
                              <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-700">
                                {b.user?.name?.charAt(0)}
                              </div>
                              <span className="text-sm font-medium text-gray-900">{b.user?.name}</span>
                            </div>

                            {/* Connector */}
                            <div className="pl-2 border-l-2 border-gray-200 ml-2.5 h-3"></div>

                            {/* Seller Line */}
                            <div className="flex items-center gap-2">
                              <div className="w-5 h-5 rounded-full bg-yellow-100 flex items-center justify-center text-[10px] font-bold text-yellow-700">
                                {b.carId?.createdBy?.name?.charAt(0) || "A"}
                              </div>
                              <span className="text-xs text-gray-500">
                                {b.carId?.createdBy ? `Owner: ${b.carId.createdBy.name}` : "Owner: Admin"}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col text-xs text-gray-600">
                            <span className="font-medium">{new Date(b.startDate).toLocaleDateString()}</span>
                            <span className="text-gray-400 pl-1 border-l-2 border-gray-200 ml-1">to</span>
                            <span className="font-medium">{new Date(b.endDate).toLocaleDateString()}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-bold text-gray-900">
                          ₹{b.amount?.toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusColor(b.paymentStatus)}`}>
                            {b.paymentStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => setSelectedBooking(b)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                              title="View Details"
                            >
                              <Eye size={18} />
                            </button>
                            <button
                              onClick={() => handleDeleteBooking(b._id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                              title="Delete"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                            <Search size={20} className="text-gray-400" />
                          </div>
                          <p className="font-medium text-gray-900">No bookings found</p>
                          <p className="text-sm">Try adjusting your search or filters</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* PAGINATION */}
          <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
            <span className="text-sm text-gray-500">
              Showing {Math.min((currentPage - 1) * itemsPerPage + 1, filteredBookings.length)} to {Math.min(currentPage * itemsPerPage, filteredBookings.length)} of {filteredBookings.length} results
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* DETAILS MODAL */}
      {selectedBooking && (
        <AdminBookingDetails
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
        />
      )}
    </AdminLayout>
  );
};

export default AdminBookings;
