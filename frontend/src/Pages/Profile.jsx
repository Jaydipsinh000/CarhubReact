import React from "react";

const Profile = () => {
  // 🔹 Get user from localStorage
  const userData = localStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p className="text-red-500 font-medium">No user data found</p>
          <p className="text-sm text-gray-500 mt-2">
            Please login again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-6">
          My Profile
        </h1>

        {/* Avatar */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-blue-600 text-white text-3xl font-bold flex items-center justify-center">
            {user.name?.charAt(0).toUpperCase()}
          </div>
        </div>

        {/* User Info */}
        <div className="space-y-4 text-gray-700">
          <div className="flex justify-between border-b pb-2">
            <span className="font-medium">Name</span>
            <span>{user.name}</span>
          </div>

          <div className="flex justify-between border-b pb-2">
            <span className="font-medium">Email</span>
            <span>{user.email}</span>
          </div>

          
        </div>
      </div>
    </div>
  );
};

export default Profile;
