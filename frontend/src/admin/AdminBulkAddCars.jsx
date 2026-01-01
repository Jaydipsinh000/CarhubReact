import { useState } from "react";
import AdminLayout from "./AdminLayout";
import axios from "axios";

const AdminBulkAddCars = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
  e.preventDefault();
  if (!file) return alert("Select a JSON file");

  const fd = new FormData();
  fd.append("file", file);

  try {
    const res = await axios.post("http://localhost:5000/api/cars/bulk", fd, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"), // token must be admin
        "Content-Type": "multipart/form-data",
      },
    });

    alert(res.data.message);
  } catch (err) {
    console.error(err.response?.data || err.message);
  }
};


  return (
    <AdminLayout>
      <div className="p-6 bg-white rounded shadow max-w-xl">
        <h2 className="text-2xl font-bold mb-4">Bulk Add Cars</h2>

        <input
          type="file"
          accept=".json"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button
          onClick={submitHandler}
          disabled={loading}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded"
        >
          {loading ? "Uploading..." : "Upload Cars"}
        </button>
      </div>
    </AdminLayout>
  );
};

export default AdminBulkAddCars;
