import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCarById, updateCar } from "../Services/adminApi.js";
import AdminLayout from "./AdminLayout.jsx";
import { Save, ArrowLeft, Upload, X } from "lucide-react";

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
    address: "",
    lat: null,
    lng: null,
    images: [], // FILES
  });

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState("");

  // ======================
  // FETCH CAR
  // ======================
  useEffect(() => {
    const fetchCar = async () => {
      try {
        const res = await getCarById(id);
        const car = res.data.car;

        setFormData({
          name: car.name || "",
          brand: car.brand || "",
          pricePerDay: car.pricePerDay || "",
          fuelType: car.fuelType || "Petrol",
          seats: car.seats || "",
          transmission: car.transmission || "Manual",
          address: car.location?.address || "",
          lat: car.location?.lat || null,
          lng: car.location?.lng || null,
          images: [], // ⚠️ fresh upload only
        });
      } catch (err) {
        setError("Failed to load car data");
      } finally {
        setPageLoading(false);
      }
    };

    fetchCar();
  }, [id]);

  // ======================
  // HANDLERS
  // ======================
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

    try {
      setLoading(true);

      const fd = new FormData();
      fd.append("name", formData.name);
      fd.append("brand", formData.brand);
      fd.append("pricePerDay", Number(formData.pricePerDay));
      fd.append("fuelType", formData.fuelType);
      fd.append("seats", Number(formData.seats));
      fd.append("transmission", formData.transmission);

      if (formData.lat) fd.append("lat", formData.lat);
      if (formData.lng) fd.append("lng", formData.lng);
      if (formData.address) fd.append("address", formData.address);

      formData.images.forEach((img) => fd.append("images", img));

      await updateCar(id, fd);

      navigate("/admin/cars");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update car");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* HEADER */}
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition">
            <ArrowLeft size={20} className="text-gray-500" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight font-display">Update Vehicle</h1>
            <p className="text-gray-500 text-sm">Modify details for {formData.name || "Vehicle"}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {error && (
            <div className="p-4 bg-red-50 text-red-600 border-b border-red-100 text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* LEFT COLUMN - BASIC INFO */}
              <div className="space-y-6">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b pb-2">Vehicle Details</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:bg-white transition-all outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                    <input
                      type="text"
                      name="brand"
                      value={formData.brand}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:bg-white transition-all outline-none"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Price / Day (₹)</label>
                      <input
                        type="number"
                        name="pricePerDay"
                        value={formData.pricePerDay}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:bg-white transition-all outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Seats</label>
                      <input
                        type="number"
                        name="seats"
                        value={formData.seats}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:bg-white transition-all outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-gray-100">
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Location</h4>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Address / City</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          name="address"
                          placeholder="e.g. Times Square, New York"
                          value={formData.address || ""}
                          onChange={handleChange}
                          onBlur={async (e) => {
                            if (!e.target.value) return;
                            try {
                              const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${e.target.value}`);
                              const data = await res.json();
                              if (data && data.length > 0) {
                                setFormData(prev => ({ ...prev, lat: data[0].lat, lng: data[0].lon }));
                              }
                            } catch (err) {
                              console.error("Geocoding failed", err);
                            }
                          }}
                          className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-100"
                        />
                      </div>
                      <p className="text-xs text-gray-400 mt-1">Coordinates will be auto-detected when you type an address.</p>

                      {(formData.lat && formData.lng) && (
                        <div className="mt-2 text-xs text-green-600 bg-green-50 px-2 py-1 rounded inline-block font-medium">
                          📍 Detected: {parseFloat(formData.lat).toFixed(4)}, {parseFloat(formData.lng).toFixed(4)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN - SPECS & IMAGES */}
              <div className="space-y-6">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b pb-2">Specs & Media</h3>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fuel Type</label>
                    <select
                      name="fuelType"
                      value={formData.fuelType}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:bg-white transition-all outline-none"
                    >
                      <option>Petrol</option>
                      <option>Diesel</option>
                      <option>Electric</option>
                      <option>Hybrid</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Transmission</label>
                    <select
                      name="transmission"
                      value={formData.transmission}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:bg-white transition-all outline-none"
                    >
                      <option>Manual</option>
                      <option>Automatic</option>
                    </select>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">Update Images</label>
                    <span className="text-xs text-orange-500 bg-orange-50 px-2 py-0.5 rounded">Replaces existing</span>
                  </div>

                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => document.getElementById("imageUpload").click()}>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="imageUpload"
                    />
                    <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Upload size={20} />
                    </div>
                    <p className="text-sm text-gray-600 font-medium">Click to upload new images</p>
                  </div>
                </div>

                {formData.images.length > 0 && (
                  <div className="grid grid-cols-4 gap-2">
                    {formData.images.map((img, idx) => (
                      <div key={idx} className="relative aspect-square group rounded-lg overflow-hidden border border-gray-200">
                        <img
                          src={URL.createObjectURL(img)}
                          className="w-full h-full object-cover"
                          alt="preview"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, images: formData.images.filter((_, i) => i !== idx) })}
                            className="p-1.5 bg-white text-red-500 rounded-full hover:scale-110 transition-transform"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-gray-100 mt-8 pt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => navigate("/admin/cars")}
                className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition shadow disabled:opacity-50"
              >
                {loading ? <div className="animate-spin h-4 w-4 border-2 border-white/50 border-t-white rounded-full" /> : <Save size={18} />}
                {loading ? "Updating..." : "Update Vehicle"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminUpdateCar;
