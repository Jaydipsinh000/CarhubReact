import React from "react";

const Profile = ({ user }) => {
  if (!user) return <p className="text-center mt-20">Please login to see profile.</p>;

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-gray-800 text-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-blue-400">Profile Details</h2>
      <p><b>Name:</b> {user.name}</p>
      <p><b>Email:</b> {user.email}</p>
      {user.phone && <p><b>Phone:</b> {user.phone}</p>}
    </div>
  );
};

export default Profile;
