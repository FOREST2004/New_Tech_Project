import React, { useState } from "react";

function ForgotPasswordForm({ onSendCode, onResetPassword, onBack, error }) {
  const [forgotEmail, setForgotEmail] = useState("");
  const [showResetSection, setShowResetSection] = useState(false);
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleSendCode = async () => {
    if (!forgotEmail) return alert("Please enter your email");
    await onSendCode(forgotEmail);
    setShowResetSection(true);
  };

  const handleResetPassword = async () => {
    if (!resetCode || !newPassword) return alert("Please enter all fields");
    await onResetPassword(forgotEmail, resetCode, newPassword);
    setShowResetSection(false);
    setForgotEmail("");
    setResetCode("");
    setNewPassword("");
  };

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 shadow-2xl rounded-3xl p-8 space-y-6 transition-colors">
      <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100">
        Forgot Password
      </h2>
      <p className="text-gray-600 dark:text-gray-300 text-center">
        Enter your email to reset your password
      </p>

      <input
        type="email"
        placeholder="Email"
        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition"
        value={forgotEmail}
        onChange={(e) => setForgotEmail(e.target.value)}
        required
      />

      <button
        type="button"
        onClick={handleSendCode}
        className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 transition-all shadow-lg"
      >
        Send Code
      </button>

      {showResetSection && (
        <div className="space-y-4 mt-4">
          <input
            type="text"
            placeholder="Enter code"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition"
            value={resetCode}
            onChange={(e) => setResetCode(e.target.value)}
          />
          <input
            type="password"
            placeholder="New Password"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={handleResetPassword}
            className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg"
          >
            Reset Password
          </button>
        </div>
      )}

      {error && (
        <p className="text-red-500 text-sm text-center mt-2">{error}</p>
      )}

      <p
        className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2 cursor-pointer hover:underline"
        onClick={onBack}
      >
        Back to Login
      </p>
    </div>
  );
}

export default ForgotPasswordForm;
