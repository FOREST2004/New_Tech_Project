// src/components/admin/MemberList/MemberTable.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MagnifyingGlassIcon,
  Cross2Icon,
  EyeOpenIcon,
  LockClosedIcon,
  LockOpen1Icon,
  ReloadIcon,
} from "@radix-ui/react-icons";
import {
  getMembers,
  MemberLock,
  MemberUnlock,
} from "../../../services/admin/member/memberService";
import { showErrorAlert } from "../../../utils/errorHandler";

function MemberTable({ role = "admin" }) {
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const [filters, setFilters] = useState({ email: "", fullName: "", isActive: "" });
  const [tempFilters, setTempFilters] = useState({ email: "", fullName: "", isActive: "" });

  const limit = 5;
  const totalPages = Math.ceil(total / limit);

  const loadMembers = async () => {
    try {
      setLoading(true);
      const params = { page, limit, ...filters };
      const response = await getMembers(params);
      setMembers(response.members || []);
      setTotal(response.total || 0);
      setMsg("");
    } catch (err) {
      console.error(err);
      showErrorAlert(err);
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, [page, filters]);

  const handleFilter = () => {
    setPage(1);
    setFilters({ ...tempFilters });
  };

  const handleClearFilter = () => {
    const empty = { email: "", fullName: "", isActive: "" };
    setTempFilters(empty);
    setFilters(empty);
    setPage(1);
  };

  const handleView = (id) => {
    if (role !== "admin") return;
    navigate(`/admin/members/${id}`);
  };

  const handleToggleLock = async (id, isActive, memberRole) => {
    if (role !== "admin") return;
    
    
    
    if (memberRole === "ADMIN") {
    
      showErrorAlert("Cannot lock/unlock admin users");
      return;
    }
    
    try {
      setLoading(true);
      if (isActive) await MemberLock(id);
      else await MemberUnlock(id);
      await loadMembers();
    } catch (err) {
      console.error(err);
      showErrorAlert(err);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = (id, memberRole) => {
    if (role !== "admin") return;
    
    
    
    if (memberRole === "ADMIN") {
     
      showErrorAlert("Cannot reset password for admin users");
      return;
    }
    
    navigate(`/admin/members/${id}/reset-password`);
  };

  const renderStatusBadge = (isActive) => {
    return (
      <span
        className={`px-2 py-1 text-xs font-semibold rounded-full shadow-sm ${
          isActive
            ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
            : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
        }`}
      >
        {isActive ? "Active" : "Locked"}
      </span>
    );
  };

  const renderRoleBadge = (memberRole) => {
    return (
      <span
        className={`px-2 py-1 text-xs font-semibold rounded-full shadow-sm ${
          memberRole === "ADMIN"
            ? "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300"
            : "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
        }`}
      >
        {memberRole === "ADMIN" ? "Admin" : "Member"}
      </span>
    );
  };

  if (loading)
    return (
      <div className="text-center py-6 text-gray-500 dark:text-gray-400">
        Loading...
      </div>
    );

  return (
    <div className="space-y-6">
  
      <div className="form-card p-5 bg-white dark:bg-gray-800 shadow-md rounded-2xl flex flex-wrap gap-3 items-center">
        <input
          type="text"
          placeholder="Email"
          value={tempFilters.email}
          onChange={(e) => setTempFilters({ ...tempFilters, email: e.target.value })}
          onKeyPress={(e) => e.key === "Enter" && handleFilter()}
          className="border px-3 py-2 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
          
        />
        <input
          type="text"
          placeholder="Full Name"
          value={tempFilters.fullName}
          onChange={(e) => setTempFilters({ ...tempFilters, fullName: e.target.value })}
          onKeyPress={(e) => e.key === "Enter" && handleFilter()}
          className="border px-3 py-2 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
        />
        {role === "admin" && (
          <select
            value={tempFilters.isActive}
            onChange={(e) => setTempFilters({ ...tempFilters, isActive: e.target.value })}
            className="border px-3 py-2 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
          >
            <option value="">Status</option>
            <option value="true">Active</option>
            <option value="false">Locked</option>
          </select>
        )}
        <button
          onClick={handleFilter}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition"
        >
          <MagnifyingGlassIcon className="w-4 h-4" /> Search
        </button>
        <button
          onClick={handleClearFilter}
          className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-xl shadow hover:bg-gray-600 transition"
        >
          <Cross2Icon className="w-4 h-4" /> Clear
        </button>
      </div>

   
      <div className="overflow-x-auto bg-white dark:bg-gray-800 shadow-lg rounded-2xl">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-gray-100 dark:bg-gray-700 sticky top-0 z-10">
            <tr className="text-gray-700 dark:text-gray-200 uppercase text-xs">
              <th className="border px-3 py-2 text-left">#</th>
              <th className="border px-3 py-2 text-left">Email</th>
              <th className="border px-3 py-2 text-left">Full Name</th>
              <th className="border px-3 py-2 text-left">Phone</th>
              <th className="border px-3 py-2 text-center">Role</th>
              <th className="border px-3 py-2 text-center">Status</th>
              {role === "admin" && <th className="border px-3 py-2 text-center">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {members.length === 0 ? (
              <tr>
                <td
                  colSpan={role === "admin" ? 7 : 6}
                  className="text-center p-4 text-gray-500 dark:text-gray-400"
                >
                  No members found
                </td>
              </tr>
            ) : (
              members.map((m, idx) => {
                const isAdminUser = m.role === "ADMIN";
                
                
                return (
                  <tr
                    key={m.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                  >
                    <td className="border px-3 py-2">
                      {(page - 1) * limit + idx + 1}
                    </td>
                    <td className="border px-3 py-2">{m.email}</td>
                    <td className="border px-3 py-2">{m.fullName || "-"}</td>
                    <td className="border px-3 py-2">{m.phoneNumber || "-"}</td>
                    <td className="border px-3 py-2 text-center">
                      {renderRoleBadge(m.role)}
                    </td>
                    <td className="border px-3 py-2 text-center">
                      {renderStatusBadge(m.isActive)}
                    </td>
                    {role === "admin" && (
                      <td className="border px-3 py-2 flex justify-center items-center gap-2">
                        <button
                          onClick={() => handleView(m.id)}
                          className="p-2 rounded-full bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 transition"
                          title="View Member"
                        >
                          <EyeOpenIcon />
                        </button>
                        
                        <button
                          onClick={() => {
                            if (!isAdminUser) {
                              handleToggleLock(m.id, m.isActive, m.role);
                            } else {
                              
                              showErrorAlert("Cannot lock/unlock admin users");
                            }
                          }}
                          className={`p-2 rounded-full transition ${
                            isAdminUser
                              ? "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed opacity-50"
                              : m.isActive
                              ? "bg-red-500 text-white hover:bg-red-600"
                              : "bg-green-500 text-white hover:bg-green-600"
                          }`}
                          title={
                            isAdminUser
                              ? "Cannot lock/unlock admin user"
                              : m.isActive
                              ? "Lock Member"
                              : "Unlock Member"
                          }
                          disabled={loading || isAdminUser}
                        >
                          {m.isActive ? <LockClosedIcon /> : <LockOpen1Icon />}
                        </button>
                        
                        <button
                          onClick={() => {
                            if (!isAdminUser) {
                              handleResetPassword(m.id, m.role);
                            } else {
                              
                              showErrorAlert("Cannot reset password for admin users");
                            }
                          }}
                          className={`p-2 rounded-full transition ${
                            isAdminUser
                              ? "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed opacity-50"
                              : "bg-yellow-400 text-gray-800 hover:bg-yellow-500"
                          }`}
                          title={
                            isAdminUser
                              ? "Cannot reset admin password"
                              : "Reset Password"
                          }
                          disabled={loading || isAdminUser}
                        >
                          <ReloadIcon />
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

     
      <div className="flex justify-between items-center mt-4 text-sm text-gray-600 dark:text-gray-300">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 transition"
        >
          Previous
        </button>
        <span>
          Page {page} of {totalPages} (Total: {total} members)
        </span>
        <button
          disabled={page >= totalPages}
          onClick={() => setPage(page + 1)}
          className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 transition"
        >
          Next
        </button>
      </div>

      {msg && <div className="mt-2 text-red-500">{msg}</div>}
    </div>
  );
}

export default MemberTable;
