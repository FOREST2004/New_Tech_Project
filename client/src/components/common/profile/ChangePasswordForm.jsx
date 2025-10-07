import React, { useState } from "react";
import { showErrorAlert } from "../../../utils/errorHandler";

const ChangePasswordForm = ({ 
  updatePasswordService, 
  userType = "member" 
}) => {
  const [current, setCurrent] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPass !== confirm) {
      setError("❌ New password and confirm password do not match");
      return;
    }

    try {
      await updatePasswordService(current, newPass);
      setSuccess("✅ Password updated successfully!");
      setCurrent("");
      setNewPass("");
      setConfirm("");
    } catch (err) {
      showErrorAlert(err);
      setError("❌ " + (err.response?.data?.message || err.message || err.toString()));
    }
  };

  return (
    <div className="
                flex
                bg-gradient-to-br from-primary-500 via-white to-accent-300
                dark:from-secondary-400 dark:via-secondary-600 dark:to-secondary-900
                items-center justify-center p-6 transition-all duration-300
    ">
      <div className="w-full max-w-md card p-8 space-y-6">
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-4xl font-bold">
            🔒
          </div>
          <h2 className="mt-4 text-2xl font-bold text-blue-900 dark:text-blue-100 text-center">
            {userType === "admin" ? "Update Admin Password" : "Change Password"}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-center mt-1">
            Keep your account secure
          </p>
        </div>

        {error && (
          <div className="flex items-center bg-red-100 dark:bg-red-200 border border-red-400 text-red-700 px-4 py-2 rounded-xl transition">
            {error}
          </div>
        )}
        {success && (
          <div className="flex items-center bg-green-100 dark:bg-green-200 border border-green-400 text-green-700 px-4 py-2 rounded-xl transition">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="form-label">Current Password</label>
            <input
              type="password"
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              placeholder="Enter current password"
              className="form-input"
              required
            />
          </div>
          <div>
            <label className="form-label">New Password</label>
            <input
              type="password"
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              placeholder="Enter new password"
              className="form-input"
              required
            />
          </div>
          <div>
            <label className="form-label">Confirm New Password</label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Re-enter new password"
              className="form-input"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full"
          >
            {userType === "admin" ? "Update Password" : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordForm;