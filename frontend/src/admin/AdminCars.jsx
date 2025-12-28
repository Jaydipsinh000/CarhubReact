import { useEffect, useState } from "react";
import { getCars, deleteCar } from "../Services/adminApi";
import AdminLayout from "./AdminLayout";
import { useNavigate } from "react-router-dom";

const AdminCars = () => {
  const navigate = useNavigate();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <AdminLayout>
      <div className="p-6 bg-gray-100 min-h-screen">
        {/* PAGE HEADER */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Manage Cars</h1>
            <p className="text-gray-500 mt-1">
              Add, edit or remove cars from platform
            </p>
          </div>

          {/* FUTURE ADD BUTTON */}
          <button
            onClick={() => navigate("/admin/addCar")}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
          >
            + Add Car
          </button>
        </div>

        {/* TABLE CARD */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          {loading ? (
            <div className="p-6 text-center text-gray-500">Loading cars...</div>
          ) : cars.length === 0 ? (
            <div className="p-6 text-center text-gray-500">No cars found</div>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b">
                <tr className="text-sm text-gray-600 uppercase">
                  <th className="px-6 py-4">Car</th>
                  <th className="px-6 py-4">Brand</th>
                  <th className="px-6 py-4">Price / Day</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {cars.map((car) => (
                  <tr
                    key={car._id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-4 font-medium text-gray-800">
                      {car.name}
                    </td>

                    <td className="px-6 py-4 text-gray-600">{car.brand}</td>

                    <td className="px-6 py-4 font-semibold text-gray-700">
                      ₹{car.pricePerDay}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-4">
                        {/* EDIT (future) */}
                        <button
                          onClick={() =>
                            navigate(`/admin/cars/update/${car._id}`)
                          }
                          className="px-3 py-1 bg-yellow-500 text-white rounded"
                        >
                          Edit
                        </button>

                        {/* DELETE */}
                        <button
                          onClick={() => handleDelete(car._id)}
                          className="text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminCars;
