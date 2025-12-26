import { useState } from "react";
import { addCar } from "../Services/adminApi.js";
import AdminLayout from "./AdminLayout.jsx";
import { useNavigate } from "react-router-dom";

const AdminAddCar = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    pricePerDay: "",
    fuelType: "Petrol",
    seats: "",
    transmission: "Manual",
    image: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await addCar({
        ...formData,
        pricePerDay: Number(formData.pricePerDay),
        seats: Number(formData.seats),
      });

      alert("Car added successfully 🚗");
      navigate("/admin/cars");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add car");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 bg-gray-100 min-h-screen">
        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Add New Car</h1>
          <p className="text-gray-500 mt-1">
            Enter car details to list on platform
          </p>
        </div>

        {/* FORM CARD */}
        <div className="max-w-3xl bg-white rounded-xl shadow p-6">
          {error && (
            <div className="mb-4 text-red-600 bg-red-50 px-4 py-2 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* CAR NAME */}
            <div>
              <label className="block text-sm font-medium mb-1">Car Name</label>
              <input
                type="text"
                name="name"
                required
                onChange={handleChange}
                className="input"
                placeholder="BMW X5"
              />
            </div>

            {/* BRAND */}
            <div>
              <label className="block text-sm font-medium mb-1">Brand</label>
              <input
                type="text"
                name="brand"
                required
                onChange={handleChange}
                className="input"
                placeholder="BMW"
              />
            </div>

            {/* PRICE */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Price Per Day (₹)
              </label>
              <input
                type="number"
                name="pricePerDay"
                required
                onChange={handleChange}
                className="input"
                placeholder="5000"
              />
            </div>

            {/* SEATS */}
            <div>
              <label className="block text-sm font-medium mb-1">Seats</label>
              <input
                type="number"
                name="seats"
                required
                onChange={handleChange}
                className="input"
                placeholder="5"
              />
            </div>

            {/* FUEL */}
            <div>
              <label className="block text-sm font-medium mb-1">Fuel Type</label>
              <select
                name="fuelType"
                onChange={handleChange}
                className="input"
              >
                <option>Petrol</option>
                <option>Diesel</option>
                <option>Electric</option>
                <option>Hybrid</option>
              </select>
            </div>

            {/* TRANSMISSION */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Transmission
              </label>
              <select
                name="transmission"
                onChange={handleChange}
                className="input"
              >
                <option>Manual</option>
                <option>Automatic</option>
              </select>
            </div>

            {/* IMAGE */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">
                Image URL
              </label>
              <input
                type="text"
                name="image"
                required
                onChange={handleChange}
                className="input"
                placeholder="https://image-url.jpg"
              />
            </div>

            {/* IMAGE PREVIEW */}
            {formData.image && (
              <div className="md:col-span-2">
                <img
                  src={formData.image}
                  alt="preview"
                  className="h-40 rounded-lg object-cover border"
                />
              </div>
            )}

            {/* BUTTON */}
            <div className="md:col-span-2 flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
              >
                {loading ? "Adding..." : "Add Car"}
              </button>

              <button
                type="button"
                onClick={() => navigate("/admin/cars")}
                className="px-6 py-3 border rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminAddCar;
