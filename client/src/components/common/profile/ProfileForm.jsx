import React, { useState, useEffect } from "react";
import { CheckIcon, Cross2Icon, CameraIcon, ReloadIcon } from "@radix-ui/react-icons";

const ProfileForm = ({ profile, onCancel, onSave }) => {
  const [fullName, setFullName] = useState(profile.fullName || "");
  const [phoneNumber, setPhoneNumber] = useState(profile.phoneNumber || "");
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFullName(profile.fullName || "");
    setPhoneNumber(profile.phoneNumber || "");
    setAvatar(null);

    if (profile.avatarUrl) {
      setPreview(`/images/${profile.avatarUrl}`);
    } else {
      setPreview(null);
    }

    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [profile]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const phoneRegex = /^[0-9]{9,11}$/;
    if (!phoneRegex.test(phoneNumber)) {
      alert("Số điện thoại không hợp lệ (phải có 9–11 chữ số).");
      return;
    }

    setLoading(true);
    try {
      await onSave({ fullName, phoneNumber, avatar });
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
      if (!allowedTypes.includes(file.type)) {
        alert("Chỉ chấp nhận file ảnh (JPEG, PNG, GIF).");
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        alert("Ảnh quá lớn (tối đa 2MB).");
        return;
      }

      setAvatar(file);
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
    }
  };

  return (
    <div className="max-w-md mx-auto w-full">
      <div className="card bg-gradient-to-br bg-white dark:from-secondary-700 dark:to-secondary100 shadow-lg rounded-2xl p-6 transition hover:shadow-xl">
        <div className="flex flex-col items-center mb-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden flex items-center justify-center bg-gradient-to-r from-blue-400 to-purple-500 shadow-lg">
              {preview ? (
                <img src={preview} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-white text-4xl font-bold">
                  {fullName ? fullName.charAt(0).toUpperCase() : "U"}
                </span>
              )}
            </div>
            <label className="absolute -bottom-1 -right-1 bg-gray-800 dark:bg-secondary-700 text-white rounded-full p-2 cursor-pointer hover:bg-gray-700 dark:hover:bg-secondary-600 transition border-2 border-white shadow-lg">
              <CameraIcon className="w-4 h-4" />
              <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            </label>
          </div>
          <h2 className="mt-3 text-xl font-semibold text-gray-800 dark:text-gray-100">
            {fullName || "User"}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
              className="w-full px-4 py-2 border border-gray-300 dark:border-secondary-600 rounded-lg 
                         focus:ring-2 focus:ring-blue-400 focus:outline-none 
                         bg-white dark:bg-secondary-600 text-gray-800 dark:text-gray-100 transition"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">
              Phone Number
            </label>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter phone number (9–11 digits)"
              className="w-full px-4 py-2 border border-gray-300 dark:border-secondary-600 rounded-lg 
                         focus:ring-2 focus:ring-blue-400 focus:outline-none 
                         bg-white dark:bg-secondary-600 text-gray-800 dark:text-gray-100 transition"
            />
          </div>

          <div className="flex justify-between gap-3 mt-4">
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-white shadow-md transition ${
                loading
                  ? "bg-green-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {loading ? (
                <>
                  <ReloadIcon className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <CheckIcon className="w-4 h-4" />
                  Save
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg shadow-md transition"
            >
              <Cross2Icon className="w-4 h-4" />
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileForm;
