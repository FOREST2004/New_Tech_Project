import React from "react";

const EventCard = ({ event, registered, onToggleRegister, canCancel, pageType }) => {
  const isUpcomingPage = pageType === "upcoming";

  const statusColors = {
    UPCOMING: "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100",
    ONGOING: "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100",
    COMPLETED: "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
    CANCELLED: "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100",
  };

  return (
    <div className="form-card bg-white dark:bg-secondary-800 shadow-xl hover:shadow-2xl transition p-6 w-full sm:w-[350px] md:w-[400px] lg:w-[450px] flex flex-col justify-between relative">
      {event.attendance && (
        <span className="absolute top-4 right-4 bg-gradient-to-r from-green-400 to-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow">
          ✓ Present
        </span>
      )}
      {event.status === "CANCELLED" && (
        <span className="absolute top-4 right-4 bg-gradient-to-r from-red-400 to-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow">
          😢 Cancelled
        </span>
      )}

      <div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          {event.title}
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm line-clamp-4">
          {event.description}
        </p>

        <div className="mt-4 text-sm space-y-2">
          <p className="text-gray-700 dark:text-gray-200">
            <span className="font-semibold text-indigo-600 dark:text-indigo-400">📍 Location:</span>{" "}
            {event.location}
          </p>

          {event.registrationStartAt && event.registrationEndAt && (
            <p className="text-gray-700 dark:text-gray-200">
              <span className="font-semibold text-purple-600 dark:text-purple-400">📝 Registration:</span>{" "}
              {new Date(event.registrationStartAt).toLocaleString()} -{" "}
              {new Date(event.registrationEndAt).toLocaleString()}
            </p>
          )}

          <p className="text-gray-700 dark:text-gray-200">
            <span className="font-semibold text-teal-600 dark:text-teal-400">⏰ Event Time:</span>{" "}
            {new Date(event.startAt).toLocaleString()} -{" "}
            {new Date(event.endAt).toLocaleString()}
          </p>

          <p>
            <span className="font-semibold text-pink-600 dark:text-pink-400">📌 Status:</span>{" "}
            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusColors[event.status]}`}>
              {event.status}
            </span>
          </p>

          <p className="text-gray-700 dark:text-gray-200">
            <span className="font-semibold text-amber-600 dark:text-amber-400">👥 Registrations:</span>{" "}
            {event.registeredCount || 0} / {event.maxAttendees}{" "}
            {event.maxAttendees - (event.registeredCount || 0) > 0 && (
              <span className="text-green-600 dark:text-green-400 font-medium">
                ({event.maxAttendees - (event.registeredCount || 0)} slots left)
              </span>
            )}
          </p>
        </div>
      </div>

      <button
        onClick={() => onToggleRegister(event)}
        disabled={isUpcomingPage ? registered : registered && !canCancel}
        className={`mt-6 py-2 rounded-xl font-semibold w-full shadow-md transition-all duration-200 ${
          registered
            ? isUpcomingPage
              ? "bg-gray-400 text-white cursor-not-allowed"
              : canCancel
              ? "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700"
              : "bg-gray-400 text-white cursor-not-allowed"
            : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700"
        }`}
      >
        {registered
          ? isUpcomingPage
            ? "✅ Registered"
            : canCancel
            ? "❌ Cancel Registration"
            : "✅ Registered"
          : "🚀 Register"}
      </button>
    </div>
  );
};

export default EventCard;
