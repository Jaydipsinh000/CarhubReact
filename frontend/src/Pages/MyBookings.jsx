import React, { useEffect, useState } from "react";
import { getMyBookings } from "../Services/paymentApi.js";
import { Calendar, MapPin, CreditCard, Clock, ArrowRight, Car } from "lucide-react";
import { Link } from "react-router-dom";

import { getCarImage } from "../utils/imageUtils";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await getMyBookings();
        setBookings(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full"></div>
          <p className="text-gray-500 font-medium animate-pulse">Loading your adventures...</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 font-display tracking-tight">
            My Bookings
          </h1>
          <p className="text-gray-500 mt-2 text-lg">
            Manage your upcoming trips and viewing history
          </p>
        </div>

        {bookings.length === 0 ? (
          /* EMPTY STATE */
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100 text-center">
            <div className="w-24 h-24 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-6">
              <Car size={48} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2 font-display">No bookings yet</h2>
            <p className="text-gray-500 max-w-md mb-8">
              You haven't booked any cars yet. Start your journey by exploring our premium fleet.
            </p>
            <Link
              to="/cars"
              className="px-8 py-3 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 hover:scale-105 transition-all shadow-lg shadow-blue-200"
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

                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="text-xl font-bold font-display tracking-wide truncate">
                      {booking.carId?.name}
                    </h3>
                    <p className="text-sm opacity-90 flex items-center gap-1">
                      <Car size={14} /> {booking.carId?.brand}
                    </p>
                  </div>

                  <div className="absolute top-4 right-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm backdrop-blur-md
                          ${booking.paymentStatus === "paid"
                          ? "bg-emerald-500/90 text-white"
                          : "bg-yellow-500/90 text-white"
                        }`}
                    >
                      {booking.paymentStatus}
                    </span>
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

                    {/* DETAILS */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Clock size={16} className="text-gray-400" />
                          <span>Duration</span>
                        </div>
                        <span className="font-medium text-gray-900">
                          {Math.ceil((new Date(booking.endDate) - new Date(booking.startDate)) / (1000 * 60 * 60 * 24)) + 1} Days
                        </span>
                      </div>
                      {booking.carId?.transmission && (
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Car size={16} className="text-gray-400" />
                            <span>Type</span>
                          </div>
                          <span className="font-medium text-gray-900">{booking.carId?.transmission}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* FOOTER */}
                  <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-400 font-medium uppercase">Total Paid</span>
                      <span className="text-xl font-bold text-gray-900 font-display">
                        ₹{booking.amount?.toLocaleString() || 0}
                      </span>
                    </div>

                    <button className="p-2 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-full transition-colors border border-gray-200">
                      <ArrowRight size={20} />
                    </button>
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
