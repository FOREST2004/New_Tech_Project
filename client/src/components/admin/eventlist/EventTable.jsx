// src/components/admin/EventList/EventTable.jsx
import React from "react";
import { Link } from "react-router-dom";
import { Pencil1Icon, Cross2Icon } from "@radix-ui/react-icons";

const EventTable = ({ events, onDelete, page, limit }) => {
  const formatDateTime = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderStatusBadge = (status) => {
    const baseClass = "px-2 py-1 text-xs font-medium rounded-full inline-block";
    switch (status) {
      case "ONGOING":
        return (
          <span className={`${baseClass} bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-100`}>
            Ongoing
          </span>
        );
      case "REGISTRATION":
        return (
          <span className={`${baseClass} bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-100`}>
            Registration
          </span>
        );
      case "CANCELLED":
        return (
          <span className={`${baseClass} bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-100`}>
            Cancelled
          </span>
        );
      case "COMPLETED":
        return (
          <span className={`${baseClass} bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-100`}>
            Completed
          </span>
        );
      case "READY":
        return (
          <span className={`${baseClass} bg-indigo-100 text-indigo-700 dark:bg-indigo-800 dark:text-indigo-100`}>
            Ready
          </span>
        );
      default:
        return (
          <span className={`${baseClass} bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200`}>
            Draft
          </span>
        );
    }
  };

  return (
    <div className="overflow-x-auto border shadow">
      <table className="w-full border-collapse text-sm">
        <thead className="bg-gray-100 text-gray-700 text-xs uppercase dark:bg-secondary-700 dark:text-gray-300 sticky top-0 z-10">
          <tr>
            <th className="border px-3 py-2 text-left">#</th>
            <th className="border px-3 py-2 text-left">Name</th>
            <th className="border px-3 py-2 text-left">Location</th>
            <th className="border px-3 py-2 text-left">Events Start - End</th>
            <th className="border px-3 py-2 text-right">Registered</th>
            <th className="border px-3 py-2 text-right">Deposit</th>
            <th className="border px-3 py-2 text-center">Status</th>
            <th className="border px-3 py-2 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {events.length === 0 ? (
            <tr>
              <td colSpan="8" className="text-center p-4 text-gray-500 italic dark:text-gray-400">
                No events found
              </td>
            </tr>
          ) : (
            events.map((ev, idx) => {
              const startStr = formatDateTime(ev.startAt);
              const endStr = formatDateTime(ev.endAt);
              const depositStr =
                ev.deposit != null
                  ? `${Number(ev.deposit).toLocaleString("vi-VN")} ₫`
                  : "0 ₫";
              const registeredCount = ev.registeredCount || 0;
              const maxAttendees = ev.maxAttendees || "-";

              return (
                <tr
                  key={ev.id}
                  className="
                    odd:bg-white even:bg-gray-50 hover:bg-secondary-700 hover:text-white 
                    dark:odd:bg-secondary-900 dark:even:bg-secondary-800 
                    dark:hover:bg-secondary-600 dark:hover:text-white
                    transition-colors
                  "
                >
                  <td className="border px-3 py-2">
                    {(page - 1) * limit + idx + 1}
                  </td>
                  <td className="border px-3 py-2 font-medium">{ev.title}</td>
                  <td className="border px-3 py-2">{ev.location || "-"}</td>
                  <td className="border px-3 py-2">
                    <div>{startStr}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">→ {endStr}</div>
                  </td>
                  <td className="border px-3 py-2 text-right font-semibold">
                    {registeredCount} / {maxAttendees}
                  </td>
                  <td className="border px-3 py-2 text-right">{depositStr}</td>
                  <td className="border px-3 py-2 text-center">{renderStatusBadge(ev.status)}</td>
                  <td className="border px-3 py-2 text-center space-x-2">
                    <Link
                      to={`/admin/events/edit/${ev.id}`}
                      className="inline-flex items-center justify-center w-8 h-8 rounded hover:bg-blue-600 hover:text-white dark:hover:bg-blue-700 dark:hover:text-white"
                      aria-label="Edit event"
                      title="Edit event"
                    >
                      <Pencil1Icon />
                    </Link>

                
                    <button
                      onClick={() => onDelete(ev.id)}
                      disabled={registeredCount > 0}
                      className={`p-1 rounded ${
                        registeredCount > 0
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-600"
                          : "text-red-600 hover:bg-red-600 hover:text-white dark:hover:bg-red-700 dark:hover:text-white"
                      }`}
                      aria-label="Delete event"
                      title={
                        registeredCount > 0
                          ? `Cannot delete: ${registeredCount} registered`
                          : "Delete event"
                      }
                    >
                      <Cross2Icon />
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default EventTable;
