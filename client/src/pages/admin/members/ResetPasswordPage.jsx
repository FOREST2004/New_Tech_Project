import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMemberById } from "../../../services/admin/member/memberService";
import { showErrorAlert } from "../../../utils/errorHandler";
import * as Toast from "@radix-ui/react-toast";

const ResetPasswordPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({ newPassword: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState({ open: false, message: "", type: "success" });

  useEffect(() => {
    fetchMemberData();
  }, [id]);

  const fetchMemberData = async () => {
    try {
      const data = await getMemberById(id);
      setMember(data.member);
    } catch (error) {
      showErrorAlert(error);
      navigate("/admin/members/list");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.newPassword) newErrors.newPassword = "Please enter new password";
    if (!formData.confirmPassword) newErrors.confirmPassword = "Please confirm password";
    if (formData.newPassword && formData.confirmPassword && formData.newPassword !== formData.confirmPassword)
      newErrors.confirmPassword = "Password confirmation does not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE}/admin/members/${id}/reset-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
        body: JSON.stringify({ newPassword: formData.newPassword }),
      });

      if (response.ok) {
        setToast({ open: true, message: "✅ Password reset successfully!", type: "success" });
        setTimeout(() => navigate("/admin/members/list"), 1500);
      } else {
        const errorData = await response.json();
        showErrorAlert({ response: { data: errorData } });
      }
    } catch (error) {
      showErrorAlert(error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-secondary-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-secondary-900 flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-300">Member information not found</p>
      </div>
    );
  }

  return (
    <div className=" py-6 
                bg-gradient-to-br from-primary-500 via-white to-accent-300 
                dark:from-secondary-400 dark:via-secondary-600 dark:to-secondary-900 
                flex items-center justify-center p-4 transition-all duration-300 ">
      <div className="max-w-2xl mx-auto">
        <div className="card bg-white dark:bg-secondary-800 shadow-lg rounded-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">Reset Member Password</h1>
          </div>

          <div className="p-6 space-y-6">
            <div className="bg-gray-100 dark:bg-secondary-800 p-4 rounded-lg space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Member Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  value={member.fullName || ""}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-gray-100 dark:bg-secondary-800 text-gray-700 dark:text-gray-100 cursor-not-allowed"
                />
                <input
                  type="email"
                  value={member.email || ""}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-gray-100 dark:bg-secondary-800 text-gray-700 dark:text-gray-100 cursor-not-allowed"
                />
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  New Password *
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  placeholder="Enter new password"
                  className={`w-full px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                    errors.newPassword ? "border-red-500" : "border-gray-300 dark:border-gray-700"
                  } bg-white dark:bg-secondary-800 text-gray-800 dark:text-gray-100`}
                />
                {errors.newPassword && <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Confirm Password *
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Re-enter new password"
                  className={`w-full px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                    errors.confirmPassword ? "border-red-500" : "border-gray-300 dark:border-gray-700"
                  } bg-white dark:bg-secondary-800 text-gray-800 dark:text-gray-100`}
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                )}
              </div>

              <div className="flex justify-end gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => navigate("/admin/members/list")}
                  className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-secondary-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  {submitting ? "⏳ Processing..." : "✅ Confirm Reset"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <Toast.Provider swipeDirection="right">
        <Toast.Root
          open={toast.open}
          onOpenChange={(open) => setToast({ ...toast, open })}
          className={`fixed bottom-4 right-4 rounded-xl p-4 shadow-lg border-l-4 ${
            toast.type === "success" ? "bg-green-50 border-green-500 text-green-700" : "bg-red-50 border-red-500 text-red-700"
          }`}
        >
          <Toast.Title className="font-semibold">{toast.message}</Toast.Title>
        </Toast.Root>
        <Toast.Viewport className="fixed bottom-4 right-4 w-96" />
      </Toast.Provider>
    </div>
  );
};

export default ResetPasswordPage;
