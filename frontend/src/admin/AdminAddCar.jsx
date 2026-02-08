import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addCar } from "../Services/adminApi.js";
import AdminLayout from "./AdminLayout.jsx";
import { Upload, X, Save, ArrowLeft, Image as ImageIcon } from "lucide-react";

const AdminAddCar = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    pricePerDay: "",
    fuelType: "Petrol",
    seats: "",
    seats: "",
    transmission: "Manual",
    listingType: "Rent",
    reservationFee: "",
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
      fd.append("listingType", formData.listingType);
      if (formData.listingType === "Sell") fd.append("reservationFee", Number(formData.reservationFee));

      if (formData.lat) fd.append("lat", formData.lat);
      if (formData.lng) fd.append("lng", formData.lng);
      if (formData.address) fd.append("address", formData.address);

      formData.images.forEach((img) => fd.append("images", img));

      await addCar(fd);

      navigate("/admin/cars");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add car");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* HEADER */}
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition">
            <ArrowLeft size={20} className="text-gray-500" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight font-display">Add New Car</h1>
            <p className="text-gray-500 text-sm">Fill in the details to list a new premium vehicle</p>
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
                      placeholder="e.g. BMW X7"
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
                      placeholder="e.g. BMW"
                      value={formData.brand}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:bg-white transition-all outline-none"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Listing Type</label>
                      <select
                        name="listingType"
                        value={formData.listingType}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:bg-white transition-all outline-none"
                      >
                        <option value="Rent">Rent</option>
                        <option value="Sell">Sell</option>
                      </select>
                    </div>
                    {/* Placeholder to keep grid aligned or remove this grid wrapping if preferred, sticking to grid for now for consistency */}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Price / Day (₹)</label>
                      <input
                        type="number"
                        name="pricePerDay"
                        placeholder="0.00"
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
                        placeholder="4"
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

                  {formData.listingType === "Sell" && (
                    <div className="animate-fade-in mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Reservation Fee (₹)</label>
                      <input
                        type="number"
                        name="reservationFee"
                        placeholder="e.g. 5000"
                        value={formData.reservationFee}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:bg-white transition-all outline-none"
                        required
                      />
                    </div>
                  )}
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Images</label>
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
                    <p className="text-sm text-gray-600 font-medium">Click to upload images</p>
                    <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</p>
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
                {loading ? "Saving..." : "Save Vehicle"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminAddCar;
