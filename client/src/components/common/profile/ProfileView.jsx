import React from "react";
import { Pencil1Icon } from "@radix-ui/react-icons";

const ProfileView = ({ profile, onEdit }) => {
  const getRoleBadge = (role) => {
    const colors = {
      admin: "from-red-400 to-red-600",
      member: "from-blue-400 to-blue-600",
      moderator: "from-green-400 to-green-600",
    };

    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${
          colors[role?.toLowerCase()] || "from-gray-400 to-gray-600"
        }`}
      >
        {role || "-"}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          Personal Information
        </h2>
        <button onClick={onEdit} className="btn flex items-center gap-2">
          <Pencil1Icon className="w-4 h-4" />
          Edit Profile
        </button>
      </div>

      <div className="card grid grid-cols-1 md:grid-cols-3 gap-6 px-4 py-4">
        <div className="flex flex-col items-center md:items-start space-y-3">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold text-white 
                       bg-gradient-to-r from-blue-400 to-purple-500 shadow-lg overflow-hidden
                       transform transition-transform hover:scale-110"
          >
            {profile.avatarUrl ? (
              <img
                src={`/images/${profile.avatarUrl}`}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            ) : profile.fullName ? (
              profile.fullName.charAt(0).toUpperCase()
            ) : (
              "U"
            )}
          </div>
          <div className="text-center md:text-left">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              {profile.fullName || "-"}
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {profile.email || "-"}
            </p>
          </div>
          {getRoleBadge(profile.role)}
        </div>

        <div className="md:col-span-2 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Full Name</label>
              <p className="text-gray-800 dark:text-gray-200 font-medium">
                {profile.fullName || "-"}
              </p>
            </div>
            <div>
              <label className="form-label">Phone Number</label>
              <p className="text-gray-800 dark:text-gray-200 font-medium">
                {profile.phoneNumber || "-"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Email</label>
              <p className="text-gray-800 dark:text-gray-200 font-medium">
                {profile.email || "-"}
              </p>
            </div>
            <div>
              <label className="form-label">Organization</label>
              <p className="text-gray-800 dark:text-gray-200 font-medium">
                {profile.organization?.name || "-"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
