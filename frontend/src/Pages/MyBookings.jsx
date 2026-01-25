import React, { useEffect, useState } from "react";
import { getMyBookings, createOrder, verifyPayment } from "../Services/paymentApi.js";
import { Calendar, MapPin, CreditCard, Clock, ArrowRight, Car, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import { getCarImage } from "../utils/imageUtils";
import CarLoader from "../Components/CarLoader";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await getMyBookings();
        setBookings(res.data || []);
        setError(null);
      } catch (err) {
        console.error("Fetch Bookings Error:", err);
        setError(err.response?.data?.message || "Failed to load bookings. Please try again.");
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  /* ================= HANDLE PAYMENT ================= */
  const handlePayNow = async (booking) => {
    const amountToPay = booking.amount - (booking.paidAmount || 0);
    if (amountToPay <= 0) return;

    if (!window.Razorpay) {
      toast.error("Payment gateway failed to load.");
      return;
    }

    setProcessingId(booking._id);

    try {
      // 1. Create Order for Remaining Amount
      const orderRes = await createOrder({
        amount: amountToPay,
        bookingId: booking._id
      });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderRes.data.amount,
        currency: "INR",
        name: "Carent Pay",
        description: `Ref: ${booking._id.slice(-6).toUpperCase()}`,
        order_id: orderRes.data.id,
        handler: async function (response) {
          try {
            await verifyPayment({
              bookingId: booking._id,
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              signature: response.razorpay_signature,
            });

            toast.success("Payment Successful!");

            // Update local state with new paid amount
            setBookings(prev => prev.map(b =>
              b._id === booking._id
                ? {
                  ...b,
                  paidAmount: (b.paidAmount || 0) + amountToPay,
                  paymentStatus: 'paid' // Assuming full payment cleans it up, backend handles partial logic too if needed but here we pay remaning full
                }
                : b
            ));
          } catch (err) {
            toast.error("Payment verification failed.");
          } finally {
            setProcessingId(null);
          }
        },
        prefill: {
          name: booking.fullName,
          email: booking.email,
          contact: booking.phone
        },
        theme: { color: "#000000" },
        modal: {
          ondismiss: () => {
            setProcessingId(null);
            toast.info("Payment Cancelled");
          }
        }
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();

    } catch (err) {
      console.error("Payment Init Error:", err);
      toast.error(err.response?.data?.message || "Could not initiate payment.");
      setProcessingId(null);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <CarLoader />
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 pt-20 sm:pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="mb-6 sm:mb-10">
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 font-display tracking-tight">
            My Bookings
          </h1>
          <p className="text-gray-500 mt-1 sm:mt-2 text-base sm:text-lg">
            Manage your upcoming trips and payments
          </p>
        </div>

        {/* ERROR STATE */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-center">
            <p className="font-medium">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 text-sm underline hover:no-underline"
            >
              Tap to retry
            </button>
          </div>
        )}

        {bookings.length === 0 && !error ? (
          /* EMPTY STATE */
          <div className="flex flex-col items-center justify-center py-16 sm:py-20 bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 text-center px-4">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-4 sm:mb-6">
              <Car size={40} className="sm:hidden" />
              <Car size={48} className="hidden sm:block" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 font-display">No bookings yet</h2>
            <p className="text-gray-500 max-w-md mb-6 sm:mb-8 text-sm sm:text-base">
              You haven't booked any cars yet. Start your journey by exploring our premium fleet.
            </p>
            <Link
              to="/cars"
              className="px-6 sm:px-8 py-3 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 hover:scale-105 transition-all shadow-lg shadow-blue-200 text-sm sm:text-base"
            >
              Explore Cars
            </Link>
          </div>
        ) : (
          /* BOOKINGS GRID */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col"
              >
                {/* IMAGE */}
                <div className="relative h-48 sm:h-56 overflow-hidden">
                  <img
                    src={getCarImage(booking.carId)}
                    alt={booking.carId?.name || "Car"}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

                  <div className="absolute top-4 right-4 flex gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm backdrop-blur-md text-white
                          ${booking.paymentStatus === "paid" ? "bg-emerald-500/90" : "bg-yellow-500/90"}`}
                    >
                      {booking.paymentStatus}
                    </span>
                    {booking.status === "active" && (
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm backdrop-blur-md bg-blue-500/90 text-white">
                        Picked Up
                      </span>
                    )}
                    {booking.status === "completed" && (
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm backdrop-blur-md bg-gray-600/90 text-white">
                        Completed
                      </span>
                    )}
                  </div>
                </div>

                {/* CONTENT */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div className="space-y-4">
                    {/* DATES */}
                    <div className="bg-gray-50 rounded-xl p-3 flex items-center justify-between text-sm">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs text-gray-400 font-semibold uppercase">Start</span>
                        <div className="flex items-center gap-2 text-gray-700 font-medium">
                          <Calendar size={14} className="text-blue-500" />
                          {new Date(booking.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </div>
                      </div>
                      <ArrowRight size={16} className="text-gray-300" />
                      <div className="flex flex-col gap-1 text-right">
                        <span className="text-xs text-gray-400 font-semibold uppercase">End</span>
                        <div className="flex items-center gap-2 text-gray-700 font-medium justify-end">
                          {new Date(booking.endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          <Calendar size={14} className="text-blue-500" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* FOOTER */}
                  <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-400 font-medium uppercase">Payment Status</span>
                      <div className="flex items-baseline gap-1">
                        {booking.paymentStatus === 'paid' ? (
                          <span className="text-xl font-bold text-emerald-600 font-display">Fully Paid</span>
                        ) : (
                          <>
                            <span className="text-xl font-bold text-gray-900 font-display">
                              ₹{(booking.paidAmount || 0).toLocaleString()}
                            </span>
                            <span className="text-xs text-gray-400 font-medium">
                              / ₹{booking.amount?.toLocaleString()}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {booking.paymentStatus !== 'paid' && (
                      <button
                        onClick={() => handlePayNow(booking)}
                        disabled={processingId === booking._id}
                        className="px-5 py-2.5 bg-black text-white text-xs font-bold rounded-xl hover:bg-gray-800 transition shadow-lg shadow-black/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 active:scale-95 transform duration-100"
                      >
                        {processingId === booking._id ? (
                          <>Processing...</>
                        ) : (
                          <>Pay Remaining ₹{(booking.amount - (booking.paidAmount || 0)).toLocaleString()}</>
                        )}
                      </button>
                    )}
                    {booking.paymentStatus === 'paid' && (
                      <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center border border-emerald-100">
                        <Check size={18} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
