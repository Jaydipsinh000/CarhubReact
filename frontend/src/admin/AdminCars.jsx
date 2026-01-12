import { useEffect, useState } from "react";
import { getCars, deleteCar } from "../Services/adminApi";
import AdminLayout from "./AdminLayout";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Edit2, Trash2, Car, Fuel, Zap, Settings, Download } from "lucide-react";
import { getCarImage } from "../utils/imageUtils";

const AdminCars = () => {
  const navigate = useNavigate();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");


  const loadCars = async () => {
    try {
      const res = await getCars();
      setCars(res.data.cars);
    } catch (err) {
      console.error("Failed to load cars", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCars();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this car?")) return;

    try {
      await deleteCar(id);
      loadCars();
    } catch (err) {
      alert("Failed to delete car");
    }
  };

  const filteredCars = cars.filter(
    (car) =>
      car.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExportCSV = () => {
    if (!filteredCars.length) return;
    const headers = ["Name", "Brand", "Year", "Fuel", "Transmission", "Price", "Owner"];
    const csvContent = [
      headers.join(","),
      ...filteredCars.map(car => [
        `"${car.name}"`,
        `"${car.brand}"`,
        car.year,
        car.fuelType,
        car.transmission,
        car.pricePerDay,
        `"${car.createdBy?.name || 'Admin'}"`
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `cars_inventory_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* PAGE HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight font-display">
              Vehicle Inventory
            </h1>
            <p className="text-gray-500 mt-1">
              Manage your fleet, add new cars, and update availability.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleExportCSV}
              className="px-4 py-2 border border-gray-200 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition shadow-sm font-medium text-sm flex items-center gap-2"
            >
              <Download size={16} /> Export CSV
            </button>
            <button
              onClick={() => navigate("/admin/cars/bulk")}
              className="px-4 py-2 border border-gray-200 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition shadow-sm font-medium text-sm"
            >
              Bulk Upload
            </button>
            <button
              onClick={() => navigate("/admin/addCar")}
              className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-all font-medium text-sm"
            >
              <Plus size={18} />
              Add Vehicle
            </button>
          </div>
        </div>

        {/* SEARCH & FILTERS */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by car name or brand..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all text-sm"
            />
          </div>
        </div>

        {/* TABLE CARD */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-gray-500">
              <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              Loading vehicles...
            </div>
          ) : filteredCars.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <Car size={48} className="mx-auto mb-4 text-gray-300" />
              <p>No vehicles found matching your criteria.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50/50 border-b border-gray-100">
                  <tr className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <th className="px-6 py-4">Vehicle</th>
                    <th className="px-6 py-4">Specs</th>
                    <th className="px-6 py-4">Price / Day</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Owner</th>
                    <th className="px-6 py-4 text-end">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredCars.map((car) => (
                    <tr
                      key={car._id}
                      className="group hover:bg-blue-50/30 transition-colors duration-200"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-200">
                            <img
                              src={getCarImage(car)}
                              alt={car.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{car.name}</p>
                            <p className="text-xs text-gray-500">{car.brand}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3 text-xs text-gray-600">
                          <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded"><Fuel size={12} /> {car.fuelType}</span>
                          <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded"><Settings size={12} /> {car.transmission}</span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className="font-bold text-gray-900">₹{car.pricePerDay.toLocaleString("en-IN")}</span>
                      </td>

                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${true ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-red-50 text-red-600 border-red-100"}`}>
                          Available
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        {car.createdBy ? (
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-yellow-100 text-yellow-700 flex items-center justify-center text-[10px] font-bold">
                              {car.createdBy.name.charAt(0)}
                            </div>
                            <div>
                              <p className="text-xs font-medium text-gray-900">{car.createdBy.name}</p>
                              <p className="text-[10px] text-gray-500">Partner</p>
                            </div>
                          </div>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                            Admin
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4 text-end">
                        <div className="flex items-center justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => navigate(`/admin/cars/update/${car._id}`)}
                            className="p-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition"
                            title="Edit"
                          >
                            <Edit2 size={16} />
                          </button>

                          <button
                            onClick={() => handleDelete(car._id)}
                            className="p-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
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

export default AdminCars;
