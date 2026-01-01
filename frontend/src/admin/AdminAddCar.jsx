import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addCar } from "../Services/adminApi.js";
import AdminLayout from "./AdminLayout.jsx";

const AdminAddCar = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    pricePerDay: "",
    fuelType: "Petrol",
    seats: "",
    transmission: "Manual",
    images: [],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      images: [...formData.images, ...Array.from(e.target.files)],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.images.length) {
      setError("At least one image is required");
      return;
    }

    try {
      setLoading(true);

      const fd = new FormData();
      fd.append("name", formData.name);
      fd.append("brand", formData.brand);
      fd.append("pricePerDay", Number(formData.pricePerDay));
      fd.append("fuelType", formData.fuelType);
      fd.append("seats", Number(formData.seats));
      fd.append("transmission", formData.transmission);

      formData.images.forEach((img) => fd.append("images", img));

      await addCar(fd);

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
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Add Car</h1>
          <p className="text-gray-500 mt-1">
            Add new luxury or premium car to platform
          </p>
        </div>

        <div className="max-w-3xl bg-white rounded-xl shadow p-6">
          {error && (
            <div className="mb-4 text-red-600 bg-red-50 px-4 py-2 rounded">
              {error}
            </div>
          )}

          <form
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            onSubmit={handleSubmit}
          >
            <div>
              <label className="block text-sm font-medium mb-1">Car Name</label>
              <input
                type="text"
                name="name"
                placeholder="BMW X7 / Rolls Royce Phantom"
                value={formData.name}
                onChange={handleChange}
                className="input"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Brand</label>
              <input
                type="text"
                name="brand"
                placeholder="BMW / Rolls Royce / Mercedes"
                value={formData.brand}
                onChange={handleChange}
                className="input"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Price Per Day (₹)
              </label>
              <input
                type="number"
                name="pricePerDay"
                placeholder="15000"
                value={formData.pricePerDay}
                onChange={handleChange}
                className="input"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Seats</label>
              <input
                type="number"
                name="seats"
                placeholder="4 / 5 / 7"
                value={formData.seats}
                onChange={handleChange}
                className="input"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Fuel Type
              </label>
              <select
                name="fuelType"
                value={formData.fuelType}
                onChange={handleChange}
                className="input"
              >
                <option>Petrol</option>
                <option>Diesel</option>
                <option>Electric</option>
                <option>Hybrid</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Transmission
              </label>
              <select
                name="transmission"
                value={formData.transmission}
                onChange={handleChange}
                className="input"
              >
                <option>Manual</option>
                <option>Automatic</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">
                Car Images
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="imageUpload"
              />
              <button
                type="button"
                onClick={() => document.getElementById("imageUpload").click()}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                ➕ Add More Images
              </button>

              <p className="text-xs text-gray-500 mt-1">
                First image will be used as main image
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {formData.images.map((img, idx) => (
                <div key={idx} className="relative">
                  <img
                    src={URL.createObjectURL(img)}
                    className="h-32 w-full object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        images: formData.images.filter((_, i) => i !== idx),
                      })
                    }
                    className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-1 rounded"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

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
