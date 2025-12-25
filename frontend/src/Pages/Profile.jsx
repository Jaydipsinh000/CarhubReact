import React from "react";

const Profile = ({ user }) => {
  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold mb-4 text-center">Profile</h1>
      {user ? (
        <div className="space-y-2">
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>ID:</strong> {user._id}
          </p>
        </div>
      ) : (
        <p className="text-center text-red-500">No user data found</p>
      )}
    </div>
  );
};

export default Profile;
