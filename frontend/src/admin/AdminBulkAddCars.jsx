import { useState } from "react";
import AdminLayout from "./AdminLayout";
import axios from "axios";
import { UploadCloud, FileJson, CheckCircle, AlertCircle, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminBulkAddCars = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // success | error

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!file) return;

    setStatus(null);
    setLoading(true);

    const fd = new FormData();
    fd.append("file", file);

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/cars/bulk`, fd, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          "Content-Type": "multipart/form-data",
        },
      });

      setStatus({ type: "success", msg: res.data.message });
      setFile(null); // clear file
    } catch (err) {
      console.error(err);
      setStatus({ type: "error", msg: err.response?.data?.message || "Upload failed" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* HEADER */}
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/admin/cars")} className="p-2 hover:bg-gray-100 rounded-full transition">
            <ArrowLeft size={20} className="text-gray-500" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight font-display">Bulk Import</h1>
            <p className="text-gray-500 text-sm">Upload a JSON file to add multiple cars at once</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <div
            className={`border-2 border-dashed rounded-xl p-10 text-center transition-all duration-300 ${file ? "border-blue-500 bg-blue-50/50" : "border-gray-200 hover:border-blue-400 hover:bg-gray-50"}`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (e.dataTransfer.files[0]?.type === "application/json") setFile(e.dataTransfer.files[0]);
            }}
          >
            <input
              type="file"
              accept=".json"
              onChange={(e) => setFile(e.target.files[0])}
              className="hidden"
              id="bulkUpload"
            />

            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              {file ? <FileJson size={32} /> : <UploadCloud size={32} />}
            </div>

            {file ? (
              <div>
                <p className="text-lg font-bold text-gray-900">{file.name}</p>
                <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
                <button onClick={() => setFile(null)} className="text-sm text-red-500 hover:underline mt-2">Remove</button>
              </div>
            ) : (
              <div>
                <p className="text-lg font-medium text-gray-900">Drag & Drop your JSON file here</p>
                <p className="text-sm text-gray-500 mt-1">or <button onClick={() => document.getElementById("bulkUpload").click()} className="text-blue-600 font-medium hover:underline">browse files</button></p>
              </div>
            )}
          </div>

          {status && (
            <div className={`mt-6 p-4 rounded-lg flex items-center gap-3 ${status.type === "success" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
              {status.type === "success" ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
              <p className="text-sm font-medium">{status.msg}</p>
            </div>
          )}

          <div className="mt-8 flex justify-end">
            <button
              onClick={submitHandler}
              disabled={!file || loading}
              className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition shadow-lg shadow-blue-200 disabled:opacity-50 disabled:shadow-none"
            >
              {loading ? "Uploading..." : "Start Import"}
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminBulkAddCars;
