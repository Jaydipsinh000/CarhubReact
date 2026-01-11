import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SellerLayout from "./SellerLayout.jsx";
import { Upload, X, Save, ArrowLeft, Info } from "lucide-react";
import { updateCar } from "../Services/adminApi.js";
import api from "../Services/api.js";
import { getCarImage } from "../utils/imageUtils";

const SellerUpdateCar = () => {
    const navigate = useNavigate();
    const { id } = useParams();

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
    const [existingImages, setExistingImages] = useState([]);

    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchCar = async () => {
            try {
                const res = await api.get(`/cars/${id}`);
                const car = res.data.car;
                setFormData({
                    name: car.name,
                    brand: car.brand,
                    pricePerDay: car.pricePerDay,
                    fuelType: car.fuelType,
                    seats: car.seats,
                    transmission: car.transmission,
                    listingType: car.listingType || "Rent",
                    images: [],
                });
                setExistingImages(car.images || []);
            } catch (err) {
                setError("Failed to fetch car details");
            } finally {
                setFetchLoading(false);
            }
        };
        fetchCar();
    }, [id]);

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
            fd.append("listingType", formData.listingType);

            // New Images
            formData.images.forEach((img) => fd.append("images", img));

            // Note: Currently, backend typically replaces images if new ones are sent, 
            // or we might need logic to keep existing ones. 
            // For now, if new images are added, they are sent. 
            // If we want to strictly keep old images + new images, backend needs to handle it.
            // Assuming simplified update logic for now: if new images provided, they are added to the set.

            await updateCar(id, fd);

            navigate("/seller/cars");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update car");
        } finally {
            setLoading(false);
        }
    };

    if (fetchLoading) return <SellerLayout><div className="p-10 text-center">Loading...</div></SellerLayout>;

    return (
        <SellerLayout>
            <div className="max-w-4xl mx-auto space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight font-display">Update Vehicle</h1>
                    <p className="text-gray-500 text-sm">Edit details for <b>{formData.name}</b></p>
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
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-yellow-400"
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
                                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-yellow-400"
                                            required
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Price ({formData.listingType === "Sell" ? "Total" : "/ Day"})</label>
                                            <input
                                                type="number"
                                                name="pricePerDay"
                                                value={formData.pricePerDay}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-yellow-400"
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
                                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-yellow-400"
                                                required
                                            />
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
                                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-yellow-400"
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
                                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-yellow-400"
                                        >
                                            <option>Manual</option>
                                            <option>Automatic</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Listing Type</label>
                                        <select
                                            name="listingType"
                                            value={formData.listingType}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-yellow-400"
                                        >
                                            <option value="Rent">Rent (Daily)</option>
                                            <option value="Sell">Sell (One-time)</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Add New Images</label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => document.getElementById("imageUpload").click()}>
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="hidden"
                                            id="imageUpload"
                                        />
                                        <Upload size={20} className="mx-auto text-gray-400 mb-2" />
                                        <p className="text-xs text-gray-500">Click to upload</p>
                                    </div>
                                </div>

                                {/* EXISTING IMAGES PREVIEW */}
                                {existingImages.length > 0 && (
                                    <div>
                                        <p className="text-xs font-bold text-gray-500 mb-2">Current Images:</p>
                                        <div className="flex gap-2 overflow-x-auto pb-2">
                                            {existingImages.map((img, idx) => (
                                                <img key={idx} src={getCarImage({ images: [img] })} className="w-16 h-16 object-cover rounded-lg border" />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* NEW IMAGES PREVIEW */}
                                {formData.images.length > 0 && (
                                    <div>
                                        <p className="text-xs font-bold text-gray-500 mb-2">New Images to Upload:</p>
                                        <div className="flex gap-2 overflow-x-auto pb-2">
                                            {formData.images.map((img, idx) => (
                                                <div key={idx} className="relative w-16 h-16 shrink-0">
                                                    <img src={URL.createObjectURL(img)} className="w-full h-full object-cover rounded-lg border" />
                                                </div>
                                            ))}
                                        </div>
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
                                {loading ? "Updating..." : "Update Vehicle"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </SellerLayout>
    );
};

export default SellerUpdateCar;
