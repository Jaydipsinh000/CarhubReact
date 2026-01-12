import React from "react";
import { X, Calendar, User, Car, CreditCard, Mail, Phone } from "lucide-react";
import { getCarImage } from "../utils/imageUtils";

const AdminBookingDetails = ({ booking, onClose }) => {
    if (!booking) return null;

    const handlePrintInvoice = () => {
        const invoiceContent = `
            <html>
                <head>
                    <title>Invoice #${booking._id}</title>
                    <style>
                        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; color: #333; }
                        .header { display: flex; justify-content: space-between; margin-bottom: 40px; border-bottom: 2px solid #eee; padding-bottom: 20px; }
                        .logo { font-size: 24px; font-weight: bold; color: #2563eb; }
                        .invoice-title { font-size: 32px; font-weight: bold; color: #111; }
                        .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 40px; }
                        .section-title { font-size: 14px; color: #666; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 5px; }
                        .amount-box { background: #f8fafc; padding: 20px; border-radius: 8px; text-align: right; }
                        .total-label { font-size: 14px; color: #666; }
                        .total-amount { font-size: 28px; font-weight: bold; color: #111; margin-top: 5px; }
                        .status { display: inline-block; padding: 5px 10px; border-radius: 4px; font-size: 12px; font-weight: bold; text-transform: uppercase; background: #dcfce7; color: #166534; }
                        .status.pending { background: #fef3c7; color: #92400e; }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <div class="logo">Carent.</div>
                        <div style="text-align: right;">
                            <div class="invoice-title">INVOICE</div>
                            <div>#${booking._id.toUpperCase().slice(-8)}</div>
                            <div>Date: ${new Date().toLocaleDateString()}</div>
                        </div>
                    </div>

                    <div class="details-grid">
                        <div>
                            <div class="section-title">Billed To</div>
                            <div style="font-weight: bold; font-size: 18px;">${booking.user?.name}</div>
                            <div>${booking.user?.email || 'N/A'}</div>
                            <div>${booking.user?.phone || 'N/A'}</div>
                        </div>
                        <div style="text-align: right;">
                            <div class="section-title">Car Details</div>
                            <div style="font-weight: bold; font-size: 18px;">${booking.carId?.name}</div>
                            <div>${booking.carId?.brand} • ${booking.carId?.year}</div>
                            <div>Owner: ${booking.carId?.createdBy?.name || 'Admin'}</div>
                        </div>
                    </div>

                    <div class="details-grid">
                         <div>
                            <div class="section-title">Booking Period</div>
                             <div>From: <strong>${new Date(booking.startDate).toLocaleDateString()}</strong></div>
                             <div>To: <strong>${new Date(booking.endDate).toLocaleDateString()}</strong></div>
                         </div>
                    </div>

                    <div class="amount-box">
                        <div class="total-label">Total Amount Paid</div>
                        <div class="total-amount">₹${booking.amount?.toLocaleString()}</div>
                        <div style="margin-top: 10px;">
                            Status: <span class="status ${booking.paymentStatus === 'pending' ? 'pending' : ''}">${booking.paymentStatus}</span>
                        </div>
                    </div>

                    <div style="margin-top: 50px; text-align: center; color: #999; font-size: 12px;">
                        Thank you for choosing Carent. This is a computer-generated invoice.
                    </div>
                    <script>window.print();</script>
                </body>
            </html>
        `;

        const printWindow = window.open('', '', 'width=800,height=600');
        printWindow.document.write(invoiceContent);
        printWindow.document.close();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-slide-up">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 font-display">
                            Booking Details
                        </h2>
                        <p className="text-sm text-gray-500">ID: {booking._id}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[80vh]">
                    {/* Status Banner */}
                    <div className="flex items-center justify-between bg-blue-50 border border-blue-100 p-4 rounded-xl mb-6">
                        <div className="flex items-center gap-3">
                            <div
                                className={`w-3 h-3 rounded-full ${booking.paymentStatus === "paid" ? "bg-green-500" : "bg-yellow-500"
                                    }`}
                            />
                            <span className="font-semibold text-blue-900 capitalize">
                                Status: {booking.paymentStatus}
                            </span>
                        </div>
                        <span className="text-lg font-bold text-blue-700">
                            ₹{booking.amount?.toLocaleString()}
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* User Info */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                <User size={14} /> Customer Info
                            </h3>
                            <div className="bg-gray-50 p-4 rounded-xl space-y-3">
                                <div className="flex items-center gap-3 pb-3 border-b border-gray-200/50">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 text-white flex items-center justify-center font-bold">
                                        {booking.user?.name?.charAt(0) || "U"}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900">
                                            {booking.user?.name || "N/A"}
                                        </p>
                                        <p className="text-xs text-gray-500">Customer</p>
                                    </div>
                                </div>
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Mail size={14} /> {booking.user?.email || "N/A"}
                                    </div>
                                    {booking.user?.phone && (
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Phone size={14} /> {booking.user.phone}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Car Info */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                <Car size={14} /> Vehicle Details
                            </h3>
                            <div className="bg-gray-50 p-4 rounded-xl space-y-3">
                                <div className="w-full h-32 rounded-lg mb-2 overflow-hidden border border-gray-200">
                                    <img
                                        src={getCarImage(booking.carId)}
                                        alt="Car"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900 text-lg">
                                        {booking.carId?.name || "Deleted Car"}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {booking.carId?.brand} • {booking.carId?.year}
                                    </p>
                                </div>
                                {booking.carId?.createdBy && (
                                    <div className="text-xs text-gray-500 pt-2 border-t border-gray-200">
                                        Owner: {booking.carId.createdBy.name}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Dates */}
                        <div className="md:col-span-2 space-y-4">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                <Calendar size={14} /> Booking Timeline
                            </h3>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex-1 bg-gray-50 p-4 rounded-xl border border-gray-100">
                                    <p className="text-xs text-gray-500 mb-1">Start Date</p>
                                    <p className="font-bold text-gray-900">
                                        {new Date(booking.startDate).toLocaleDateString(undefined, {
                                            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                                        })}
                                    </p>
                                </div>
                                <div className="flex-1 bg-gray-50 p-4 rounded-xl border border-gray-100">
                                    <p className="text-xs text-gray-500 mb-1">End Date</p>
                                    <p className="font-bold text-gray-900">
                                        {new Date(booking.endDate).toLocaleDateString(undefined, {
                                            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Payment Info */}
                        <div className="md:col-span-2 space-y-4">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                <CreditCard size={14} /> Payment Details
                            </h3>
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex justify-between items-center">
                                <div>
                                    <p className="text-sm font-medium text-gray-700">Total Amount Paid</p>
                                    <p className="text-xs text-gray-500">Via {booking.paymentMethod || "Online"}</p>
                                </div>
                                <div className="text-xl font-bold text-gray-900">₹{booking.amount}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3 rounded-b-2xl">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-white hover:border-gray-300 transition"
                    >
                        Close
                    </button>
                    <button
                        onClick={handlePrintInvoice}
                        className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition shadow-lg shadow-blue-200"
                    >
                        Download Invoice
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminBookingDetails;
