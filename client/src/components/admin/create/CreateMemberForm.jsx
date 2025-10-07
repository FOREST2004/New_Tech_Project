// src/components/admin/member/CreateMemberForm.jsx
import React, { useState } from "react";
import * as Toast from "@radix-ui/react-toast";
import { createMember } from "../../../services/admin/member/memberService";
import { showErrorAlert } from "../../../utils/errorHandler";

const CreateMemberForm = () => {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [toastSuccess, setToastSuccess] = useState(true);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const validateForm = () => {
    if (!form.fullName || !form.email || !form.password || !form.confirmPassword) {
      setToastSuccess(false);
      setToastMsg("⚠️ Please fill in all required fields");
      setToastOpen(true);
      return false;
    }
    if (form.password !== form.confirmPassword) {
      setToastSuccess(false);
      setToastMsg("❌ Password confirmation does not match");
      setToastOpen(true);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const memberData = {
        fullName: form.fullName,
        email: form.email,
        password: form.password,
      };
      const data = await createMember(memberData);
      setToastSuccess(true);
      setToastMsg(`✅ Member created successfully: ${data.member.email}`);
      setToastOpen(true);
      setForm({ fullName: "", email: "", password: "", confirmPassword: "" });
    } catch (err) {
      showErrorAlert(err);
    } finally {
      setLoading(false);
    }
  };

  const getInputType = (field) => {
    if (field === "password" || field === "confirmPassword") {
      return "password";
    }
    if (field === "email") {
      return "email";
    }
    return "text";
  };

  return (
    <div className="card max-w-lg mx-auto p-8 bg-white dark:bg-secondary-900 rounded-3xl shadow-2xl">
      <h2 className="text-3xl font-extrabold text-center text-gray-800 dark:text-gray-100 mb-8">
        👤 Create New Member
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {["fullName", "email", "password", "confirmPassword"].map((field, idx) => (
          <div key={idx}>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              {field === "fullName"
                ? "Full Name"
                : field === "confirmPassword"
                ? "Confirm Password"
                : field.charAt(0).toUpperCase() + field.slice(1)}{" "}
              *
            </label>
            <input
              type={getInputType(field)}
              id={field}
              placeholder={`Enter ${field === "confirmPassword" ? "password again" : field}`}
              value={form[field]}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-xl 
              bg-gray-200 dark:bg-secondary-600 text-gray-800 dark:text-gray-100 
              shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            />
          </div>
        ))}

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-xl font-semibold text-white shadow-lg transition transform hover:-translate-y-0.5 ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          }`}
        >
          {loading ? "⏳ Creating..." : "🚀 Create Member"}
        </button>
      </form>

      <Toast.Provider swipeDirection="right">
        <Toast.Root
          open={toastOpen}
          onOpenChange={setToastOpen}
          className={`rounded-xl shadow-lg p-4 border-l-4 mt-4
          ${toastSuccess ? "bg-green-50 border-green-500" : "bg-red-50 border-red-500"}`}
        >
          <Toast.Title
            className={`font-semibold text-sm ${
              toastSuccess ? "text-green-700" : "text-red-700"
            }`}
          >
            {toastMsg}
          </Toast.Title>
        </Toast.Root>
        <Toast.Viewport className="fixed bottom-4 right-4 w-96" />
      </Toast.Provider>
    </div>
  );
};

export default CreateMemberForm;
