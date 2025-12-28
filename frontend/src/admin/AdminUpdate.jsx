import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCarById, updateCar } from "../Services/adminApi.js";
import AdminLayout from "./AdminLayout.jsx";

const AdminUpdateCar = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    pricePerDay: "",
    fuelType: "Petrol",
    seats: "",
    transmission: "Manual",
    images: [""],
  });

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const res = await getCarById(id);
        const car = res.data.car || res.data;

        setFormData({
          name: car.name || "",
          brand: car.brand || "",
          pricePerDay: car.pricePerDay || "",
          fuelType: car.fuelType || "Petrol",
          seats: car.seats || "",
          transmission: car.transmission || "Manual",
          images: car.images && car.images.length ? car.images : [car.image || ""],
        });
      } catch (err) {
        setError("Failed to load car data");
      } finally {
        setPageLoading(false);
      }
    };

    fetchCar();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (index, value) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData({ ...formData, images: newImages });
  };

  const addImageInput = () => {
    setFormData({ ...formData, images: [...formData.images, ""] });
  };

  const removeImageInput = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!formData.images[0]) {
      setError("At least one image is required");
      setLoading(false);
      return;
    }

    try {
      await updateCar(id, {
        ...formData,
        image: formData.images[0],
        pricePerDay: Number(formData.pricePerDay),
        seats: Number(formData.seats),
      });

      alert("Car updated successfully 🚗");
      navigate("/admin/cars");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update car");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return <AdminLayout><div className="p-6">Loading car details...</div></AdminLayout>;
  }

  return (
    <AdminLayout>
      <div className="p-6 bg-gray-100 min-h-screen">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Update Car</h1>
          <p className="text-gray-500 mt-1">Edit car details listed on platform</p>
        </div>

        <div className="max-w-3xl bg-white rounded-xl shadow p-6">
          {error && <div className="mb-4 text-red-600 bg-red-50 px-4 py-2 rounded">{error}</div>}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Car Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required className="input" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Brand</label>
              <input type="text" name="brand" value={formData.brand} onChange={handleChange} required className="input" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Price Per Day (₹)</label>
              <input type="number" name="pricePerDay" value={formData.pricePerDay} onChange={handleChange} required className="input" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Seats</label>
              <input type="number" name="seats" value={formData.seats} onChange={handleChange} required className="input" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Fuel Type</label>
              <select name="fuelType" value={formData.fuelType} onChange={handleChange} className="input">
                <option>Petrol</option>
                <option>Diesel</option>
                <option>Electric</option>
                <option>Hybrid</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Transmission</label>
              <select name="transmission" value={formData.transmission} onChange={handleChange} className="input">
                <option>Manual</option>
                <option>Automatic</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Car Images (First image is main)</label>
              <div className="flex flex-col gap-2">
                {formData.images.map((img, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={img}
                      onChange={(e) => handleImageChange(idx, e.target.value)}
                      className="input flex-1"
                      placeholder="Image URL"
                    />
                    {formData.images.length > 1 && (
                      <button type="button" onClick={() => removeImageInput(idx)} className="bg-red-500 text-white px-3 py-1 rounded">
                        Delete
                      </button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={addImageInput} className="bg-blue-600 text-white px-4 py-2 rounded mt-2">
                  Add Image
                </button>
              </div>
            </div>

            {formData.images.map((img, idx) => img && (
              <div key={idx} className="md:col-span-2">
                <img src={img} alt={`preview-${idx}`} className="h-40 rounded-lg object-cover border mb-2" />
              </div>
            ))}

            <div className="md:col-span-2 flex gap-4">
              <button type="submit" disabled={loading} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50">
                {loading ? "Updating..." : "Update Car"}
              </button>
              <button type="button" onClick={() => navigate("/admin/cars")} className="px-6 py-3 border rounded-lg hover:bg-gray-100">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminUpdateCar;
