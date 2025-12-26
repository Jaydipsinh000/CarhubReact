import { useEffect, useState } from "react";
import { getCars } from "../Services/adminApi.js";
import AdminLayout from "./AdminLayout.jsx";

const AdminDashboard = () => {
  const [totalCars, setTotalCars] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCars()
      .then((res) => setTotalCars(res.data.total))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-100 p-6">
        {/* PAGE HEADER */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-800">
            Admin Dashboard
          </h1>
          <p className="text-gray-500 mt-1">
            Monitor system statistics & performance
          </p>
        </div>

        {/* STATS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* TOTAL CARS */}
          <div className="bg-white rounded-2xl shadow hover:shadow-lg transition p-6 flex items-center gap-6">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-3xl">
              🚗
            </div>

            <div>
              <p className="text-sm text-gray-500">Total Cars</p>
              <h2 className="text-4xl font-bold text-gray-800 mt-1">
                {loading ? "…" : totalCars}
              </h2>
            </div>
          </div>

          {/* BOOKINGS (COMING SOON) */}
          <div className="bg-white rounded-2xl shadow p-6 flex items-center gap-6 opacity-60 cursor-not-allowed">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-3xl">
              📦
            </div>

            <div>
              <p className="text-sm text-gray-500">Total Bookings</p>
              <h2 className="text-3xl font-semibold text-gray-700 mt-1">
                Coming Soon
              </h2>
            </div>
          </div>

          {/* USERS (COMING SOON) */}
          <div className="bg-white rounded-2xl shadow p-6 flex items-center gap-6 opacity-60 cursor-not-allowed">
            <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center text-3xl">
              👥
            </div>

            <div>
              <p className="text-sm text-gray-500">Total Users</p>
              <h2 className="text-3xl font-semibold text-gray-700 mt-1">
                Coming Soon
              </h2>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
