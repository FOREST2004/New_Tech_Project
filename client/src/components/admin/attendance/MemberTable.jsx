
import React from "react";

function MemberTable({ registrations, isOngoing, onToggle }) {
  console.log("MemberTable render:", { isOngoing, registrations });
  return (
    <div className="overflow-x-auto border rounded-lg shadow-sm border-gray-200 dark:border-gray-1s00">
      <table className="w-full border-collapse text-sm">
        <thead className="bg-gray-200 dark:bg-blue-500 text-gray-700 dark:text-gray-200 uppercase text-xs sticky top-0 z-10">
          <tr>
            <th className="border px-3 py-2 dark:border-gray-700">#</th>
            <th className="border px-3 py-2 dark:border-gray-700">Name</th>
            <th className="border px-3 py-2 dark:border-gray-700">Email</th>
            <th className="border px-3 py-2 text-center dark:border-gray-700">
              Deposit Paid
            </th>
            <th className="border px-3 py-2 text-center dark:border-gray-700">
              Attended
              <div className="text-xs font-normal text-gray-500 dark:text-gray-300 mt-1">
                (Requires deposit)
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {registrations.length === 0 ? (
            <tr>
              <td
                colSpan="5"
                className="text-center p-4 text-gray-500 dark:text-gray-400 italic border dark:border-gray-700"
              >
                No members found
              </td>
            </tr>
          ) : (
            registrations.map((reg, idx) => (
              <tr
                key={reg.id}
                className="odd:bg-white even:bg-gray-200 hover:bg-gray-100 
                           dark:odd:bg-gray-800 dark:even:bg-gray-600 
                           dark:hover:bg-gray-700 transition-colors"
              >
                <td className="border px-3 py-2 dark:border-gray-700">
                  {idx + 1}
                </td>
                <td className="border px-3 py-2 dark:border-gray-700">
                  {reg.user?.fullName || "Unknown"}
                </td>
                <td className="border px-3 py-2 dark:border-gray-700">
                  {reg.user?.email || "-"}
                </td>

                <td className="border px-3 py-2 text-center dark:border-gray-700">
                  <input
                    type="checkbox"
                    checked={reg.depositPaid}
                    disabled={false}
                    onChange={() => onToggle(reg.id, "depositPaid")}
                    className="w-5 h-5 text-green-600 rounded focus:ring-2 focus:ring-green-400"
                    aria-label={`Mark ${reg.user?.fullName} deposit as paid`}
                  />
                </td>

                <td className="border px-3 py-2 text-center dark:border-gray-700">
                  <input
                    type="checkbox"
                    checked={reg.attended}
                    disabled={!isOngoing || !reg.depositPaid}
                    onChange={() => onToggle(reg.id, "attended")}
                    className={`w-5 h-5 rounded focus:ring-2 ${
                      !reg.depositPaid 
                        ? "text-gray-400 cursor-not-allowed" 
                        : "text-blue-600 focus:ring-blue-400"
                    }`}
                    aria-label={`Mark ${reg.user?.fullName} as attended`}
                    title={!reg.depositPaid ? "Deposit must be paid before marking attendance" : ""}
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default MemberTable;
