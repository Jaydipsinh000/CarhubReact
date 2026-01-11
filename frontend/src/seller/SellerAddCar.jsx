import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SellerLayout from "./SellerLayout.jsx";
import { Upload, X, Save, ArrowLeft, Info } from "lucide-react";
import { addCar } from "../Services/adminApi.js"; // We can reuse this API call as it points to the same endpoint

const SellerAddCar = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        brand: "",
        pricePerDay: "",
        fuelType: "Petrol",
        seats: "",
        transmission: "Manual",
        listingType: "Rent",
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

            formData.images.forEach((img) => fd.append("images", img));

            await addCar(fd); // This uses axios instance which handles Token automatically

            navigate("/seller/cars");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to add car");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SellerLayout>
            <div className="max-w-4xl mx-auto space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight font-display">Add New Vehicle</h1>
                    <p className="text-gray-500 text-sm">List a new car for rent on the platform.</p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {error && (
                        <div className="p-4 bg-red-50 text-red-600 border-b border-red-100 text-sm font-medium flex items-center gap-2">
                            <Info size={16} /> {error}
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
                                            placeholder="e.g. Maruti Swift"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-100 focus:border-yellow-400 focus:bg-white transition-all outline-none"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                                        <input
                                            type="text"
                                            name="brand"
                                            placeholder="e.g. Maruti Suzuki"
                                            value={formData.brand}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-100 focus:border-yellow-400 focus:bg-white transition-all outline-none"
                                            required
                                        />
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
                                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-100 focus:border-yellow-400 focus:bg-white transition-all outline-none"
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
                                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-100 focus:border-yellow-400 focus:bg-white transition-all outline-none"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Listing Type</label>
                                            <select
                                                name="listingType"
                                                value={formData.listingType}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-100 focus:border-yellow-400 focus:bg-white transition-all outline-none"
                                            >
                                                <option value="Rent">Rent (Daily)</option>
                                                <option value="Sell">Sell (One-time)</option>
                                            </select>
                                        </div>
                                        <div>
                                            {/* Empty placeholder or move Price here if we want 2 items per row */}
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
                                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-100 focus:border-yellow-400 focus:bg-white transition-all outline-none"
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
                                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-100 focus:border-yellow-400 focus:bg-white transition-all outline-none"
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
                                        <div className="w-12 h-12 bg-yellow-50 text-yellow-500 rounded-full flex items-center justify-center mx-auto mb-3">
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
                                onClick={() => navigate("/seller/cars")}
                                className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex items-center gap-2 px-6 py-2.5 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition shadow disabled:opacity-50"
                            >
                                {loading ? <div className="animate-spin h-4 w-4 border-2 border-white/50 border-t-white rounded-full" /> : <Save size={18} />}
                                {loading ? "Saving..." : "Save Vehicle"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </SellerLayout>
    );
};

export default SellerAddCar;
