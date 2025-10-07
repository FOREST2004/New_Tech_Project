import React, { useEffect, useState } from "react";
import { getMembers } from "../../../services/member/memberService";
import { showErrorAlert } from "../../../utils/errorHandler";

function ViewMemberList() {
  const [members, setMembers] = useState([]);
  const [msg, setMsg] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({ email: "", fullName: "", isActive: "true" });
  const [tempFilters, setTempFilters] = useState({ email: "", fullName: "" });

  const limit = 5;

  const loadMembers = async () => {
    try {
      setLoading(true);
      setMsg("");
      const params = { page, limit, ...filters };
      const response = await getMembers(params);
      setMembers(response.members || []);
      setTotal(response.total || 0);
    } catch (err) {
      showErrorAlert(err);
      setMsg("Error loading member list");
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
    setFilters({ ...filters, ...tempFilters });
  };

  const handleClearFilter = () => {
    setTempFilters({ email: "", fullName: "" });
    setFilters({ email: "", fullName: "", isActive: "true" });
    setPage(1);
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      <div className="form-card bg-white dark:bg-gray-800 shadow rounded-lg p-4 flex flex-wrap gap-4">
        <input
          type="text"
          placeholder="Email"
          value={tempFilters.email}
          onChange={(e) => setTempFilters({ ...tempFilters, email: e.target.value })}
          onKeyPress={(e) => e.key === "Enter" && handleFilter()}
          className="flex-1 min-w-[200px] border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 
              focus:outline-none focus:ring-2 focus:ring-blue-500
              bg-gray-200 
              dark:bg-gray-500 dark:text-white"
        />
        <input
          type="text"
          placeholder="Full Name"
          value={tempFilters.fullName}
          onChange={(e) => setTempFilters({ ...tempFilters, fullName: e.target.value })}
          onKeyPress={(e) => e.key === "Enter" && handleFilter()}
          className="flex-1 min-w-[200px] border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 
              focus:outline-none focus:ring-2 focus:ring-blue-500 
              bg-gray-200
              dark:bg-gray-500 dark:text-white"
        />
        <div className="flex gap-2">
          <button
            onClick={handleFilter}
            className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-all"
          >
            🔍 Search
          </button>
          <button
            onClick={handleClearFilter}
            className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-all"
          >
            ❌ Clear
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-x-auto border border-gray-200 dark:border-gray-700">
        {loading ? (
          <div className="p-6 text-center text-gray-500 dark:text-gray-300">Loading...</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-200 dark:bg-gray-600">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">#</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Email</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Full Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Phone</th>
              </tr>
            </thead>
            <tbody className="
                            bg-gray-100 dark:bg-gray-700 divide-y divide-gray-100 dark:divide-gray-900
                            ">
              {members.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-6 text-gray-500 dark:text-gray-300">No members found</td>
                </tr>
              ) : (
                members.map((m, idx) => (
                  <tr key={m.id} className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 dark:hover:from-gray-700 dark:hover:to-gray-600 transition">
                    <td className="px-4 py-3 text-sm">{(page - 1) * limit + idx + 1}</td>
                    <td className="px-4 py-3 text-sm">{m.email}</td>
                    <td className="px-4 py-3 text-sm">{m.fullName || "-"}</td>
                    <td className="px-4 py-3 text-sm flex items-center gap-2">
                      📞 {m.phoneNumber || "-"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

        <div className="flex justify-between items-center">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="flex items-center gap-1 px-4 py-2 rounded-lg bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-700 dark:to-gray-600 hover:opacity-90 disabled:opacity-50 transition"
          >
            ◀ Previous
          </button>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
            Page {page} of {totalPages || 1}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
            className="flex items-center gap-1 px-4 py-2 rounded-lg bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-700 dark:to-gray-600 hover:opacity-90 disabled:opacity-50 transition"
          >
            Next ▶
          </button>
        </div>

      {msg && <div className="text-red-600 dark:text-red-400">{msg}</div>}
    </div>
  );
}

export default ViewMemberList;
