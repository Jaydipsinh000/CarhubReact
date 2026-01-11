import AdminLayout from "./AdminLayout.jsx";
import React, { useEffect, useState } from "react";
import api from "../Services/api.js";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/admin/users");
        setUsers(res.data.users);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">👤 Users</h1>

        {loading ? (
          <p className="text-gray-500">Loading users...</p>
        ) : (
          <div className="bg-white shadow-lg rounded-2xl p-6 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-gray-600 text-sm">#</th>
                  <th className="px-4 py-2 text-gray-600 text-sm">Name</th>
                  <th className="px-4 py-2 text-gray-600 text-sm">Email</th>
                  <th className="px-4 py-2 text-gray-600 text-sm">Role</th>
                  <th className="px-4 py-2 text-gray-600 text-sm">Joined</th>
                  <th className="px-4 py-2 text-end text-gray-600 text-sm">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {users.map((u, i) => (
                  <tr key={u._id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3">{i + 1}</td>
                    <td className="px-4 py-3">{u.name}</td>
                    <td className="px-4 py-3">{u.email}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${u.role === "admin"
                          ? "bg-purple-100 text-purple-700"
                          : u.role === "seller"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-blue-100 text-blue-700"
                          }`}
                      >
                        {u.role === "seller" ? "Partner" : u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-sm">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-end">
                      {u.role !== 'admin' && (
                        <button
                          onClick={async () => {
                            if (window.confirm("Are you sure? This will permanently delete this user.")) {
                              try {
                                await api.delete(`/admin/users/${u._id}`);
                                setUsers(users.filter(user => user._id !== u._id));
                              } catch (e) {
                                alert("Failed to delete user");
                              }
                            }
                          }}
                          className="text-red-500 hover:text-red-700 font-medium text-xs border border-red-200 hover:bg-red-50 px-3 py-1 rounded transition"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;
