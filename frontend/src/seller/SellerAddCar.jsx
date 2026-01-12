import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SellerLayout from "./SellerLayout.jsx";
import { Upload, X, Save, ArrowLeft, Info, HelpCircle } from "lucide-react";
import { addCar } from "../Services/adminApi.js";
import { toast } from "react-toastify";

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

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFormData({
            ...formData,
            images: [...formData.images, ...Array.from(e.target.files)],
        });
    };

    const removeImage = (index) => {
        setFormData({
            ...formData,
            images: formData.images.filter((_, i) => i !== index),
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.images.length) {
            toast.error("At least one image is required");
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

            await addCar(fd);
            toast.success("Vehicle added successfully! 🚀");
            navigate("/seller/cars");
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Failed to add car");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SellerLayout>
            <div className="max-w-5xl mx-auto space-y-6 pb-20">
                {/* PAGE HEADER */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:border-gray-300 transition-all"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 font-display tracking-tight">Add New Vehicle</h1>
                        <p className="text-gray-500 font-medium text-sm mt-0.5">Fill in the details to list your car</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* LEFT COLUMN: MAIN FORM */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* BASIC DETAILS CARD */}
                        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
                            <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-sm font-bold">01</span>
                                Basic Details
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Vehicle Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="e.g. Fortuner Legender"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all outline-none font-bold text-gray-900 placeholder:text-gray-300 placeholder:font-medium"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Brand</label>
                                    <input
                                        type="text"
                                        name="brand"
                                        placeholder="e.g. Toyota"
                                        value={formData.brand}
                                        onChange={handleChange}
                                        className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all outline-none font-bold text-gray-900 placeholder:text-gray-300 placeholder:font-medium"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Price (₹)</label>
                                    <div className="relative">
                                        <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
                                        <input
                                            type="number"
                                            name="pricePerDay"
                                            placeholder="0.00"
                                            value={formData.pricePerDay}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-5 py-3.5 bg-gray-50 border-none rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all outline-none font-bold text-gray-900 placeholder:text-gray-300 placeholder:font-medium"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Listing Type</label>
                                    <div className="relative">
                                        <select
                                            name="listingType"
                                            value={formData.listingType}
                                            onChange={handleChange}
                                            className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all outline-none font-bold text-gray-900 appearance-none cursor-pointer hover:bg-gray-100"
                                        >
                                            <option value="Rent">Rent (Daily Basis)</option>
                                            <option value="Sell">Sell (One-time)</option>
                                        </select>
                                        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none">
                                            <Info size={16} className="text-gray-400" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* SPECS CARD */}
                        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
                            <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm font-bold">02</span>
                                Specifications
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Fuel Type</label>
                                    <select
                                        name="fuelType"
                                        value={formData.fuelType}
                                        onChange={handleChange}
                                        className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-2xl focus:bg-white focus:ring-2 focus:ring-emerald-100 transition-all outline-none font-bold text-gray-900 appearance-none cursor-pointer hover:bg-gray-100"
                                    >
                                        <option>Petrol</option>
                                        <option>Diesel</option>
                                        <option>Electric</option>
                                        <option>Hybrid</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Transmission</label>
                                    <select
                                        name="transmission"
                                        value={formData.transmission}
                                        onChange={handleChange}
                                        className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-2xl focus:bg-white focus:ring-2 focus:ring-emerald-100 transition-all outline-none font-bold text-gray-900 appearance-none cursor-pointer hover:bg-gray-100"
                                    >
                                        <option>Manual</option>
                                        <option>Automatic</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Seats</label>
                                    <input
                                        type="number"
                                        name="seats"
                                        placeholder="4"
                                        value={formData.seats}
                                        onChange={handleChange}
                                        className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-2xl focus:bg-white focus:ring-2 focus:ring-emerald-100 transition-all outline-none font-bold text-gray-900 placeholder:text-gray-300 placeholder:font-medium"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: IMAGES & SUBMIT */}
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 h-full flex flex-col">
                            <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center text-sm font-bold">03</span>
                                Gallery
                            </h3>

                            <div className="flex-1">
                                <label
                                    htmlFor="imageUpload"
                                    className="w-full aspect-[4/3] border-3 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-gray-50 hover:border-blue-400/50 transition-all group"
                                >
                                    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                                        <Upload size={24} />
                                    </div>
                                    <div className="text-center">
                                        <p className="font-bold text-gray-900">Click to upload</p>
                                        <p className="text-xs text-gray-400 font-medium mt-1">PNG, JPG (Max 5MB)</p>
                                    </div>
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="hidden"
                                        id="imageUpload"
                                    />
                                </label>

                                {formData.images.length > 0 && (
                                    <div className="mt-6 space-y-3">
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Selected Images ({formData.images.length})</p>
                                        <div className="grid grid-cols-2 gap-3">
                                            {formData.images.map((img, idx) => (
                                                <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden group border border-gray-100">
                                                    <img
                                                        src={URL.createObjectURL(img)}
                                                        className="w-full h-full object-cover"
                                                        alt="preview"
                                                    />
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                                        <button
                                                            type="button"
                                                            onClick={() => removeImage(idx)}
                                                            className="w-8 h-8 bg-white text-red-500 rounded-lg flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
                                                        >
                                                            <X size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="pt-6 mt-6 border-t border-gray-100">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-4 bg-gray-900 text-white font-black rounded-2xl hover:bg-gray-800 transition-all shadow-xl shadow-gray-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-[0.98]"
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Publishing...
                                        </>
                                    ) : (
                                        <>
                                            <Save size={20} /> Publish Vehicle
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </SellerLayout>
    );
};

export default SellerAddCar;
