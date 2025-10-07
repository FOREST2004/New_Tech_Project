import React, { useEffect, useState } from "react";
import EventCard from "../../../components/common/eventList/EventCard";
import {
  getUpcomingEvents,
  registerEvent,
  cancelRegistration,
  getMemberRegistrations,
} from "../../../services/common/event/eventService.js";
import { getEventStatus } from "../../../utils/getEventStatus";
import { showErrorAlert } from "../../../utils/errorHandler";
import * as Toast from "@radix-ui/react-toast";

const UpcomingEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState({});
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    type: "success",
  });

  const limit = 4;

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const currentMemberId = currentUser?.id;

  const loadData = async () => {
    try {
      setLoading(true);
      const [eventsRes, regsRes] = await Promise.all([
        getUpcomingEvents(page, limit),
        getMemberRegistrations(),
      ]);

      const filteredEvents = eventsRes.events.map((ev) => ({
        ...ev,
        status: getEventStatus(ev),
      }));
      setEvents(filteredEvents);

      const regMap = regsRes.reduce((acc, r) => {
        acc[r.eventId] = true;
        return acc;
      }, {});
      setRegistrations(regMap);

      setTotal(eventsRes.total);
    } catch (err) {
      showErrorAlert(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [page]);

  const handleToggleRegister = async (event) => {
    if (!currentMemberId) {
      setToast({
        open: true,
        message: "You are not logged in",
        type: "error",
      });
      return;
    }

    const registered = registrations[event.id];
    const canCancel = registered && new Date() <= new Date(event.registrationEndAt);

    try {
      if (registered && canCancel) {
        await cancelRegistration(event.id);
        setToast({
          open: true,
          message: "Registration cancelled",
          type: "success",
        });
      } else if (!registered) {
        if (event.status === "DRAFT") {
          setToast({
            open: true,
            message: "Event registration not open",
            type: "error",
          });
          return;
        }
        await registerEvent(event.id);
        setToast({
          open: true,
          message: "Registration successful",
          type: "success",
        });
      } else {
        setToast({
          open: true,
          message: "Cannot cancel this event",
          type: "error",
        });
        return;
      }
      await loadData();
    } catch (err) {
      showErrorAlert(err);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center mt-20 text-gray-500 dark:text-gray-400">
        Loading events...
      </div>
    );

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="
                  bg-gradient-to-br from-primary-500 via-white to-accent-300 
                  dark:from-secondary-400 dark:via-secondary-600 dark:to-secondary-900 
                  items-center justify-center p-6 transition-all duration-300
              ">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-900 dark:text-gray-100 drop-shadow-sm">
        📅 Upcoming Events
      </h1>
      </div>

      {events.length === 0 ? (
        <div className="text-gray-500 dark:text-gray-400 text-center mt-10">
          No upcoming events
        </div>
      ) : (
        <div className="flex flex-wrap justify-center gap-6">
          {events.map((ev) => (
            <EventCard
              key={ev.id}
              event={ev}
              registered={!!registrations[ev.id]}
              remaining={ev.registeredCount}
              onToggleRegister={handleToggleRegister}
              canCancel={
                !!registrations[ev.id] &&
                new Date() <= new Date(ev.registrationEndAt)
              }
              pageType="upcoming"
            />
          ))}
        </div>
      )}

      <div className="flex justify-center items-center mt-10 gap-4 text-sm">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-secondary-700 hover:bg-gray-300 dark:hover:bg-secondary-600 disabled:opacity-50 transition"
        >
          Previous
        </button>
        <span className="text-gray-700 dark:text-gray-300">
          Page {page} / {totalPages}
        </span>
        <button
          disabled={page >= totalPages}
          onClick={() => setPage(page + 1)}
          className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-secondary-700 hover:bg-gray-300 dark:hover:bg-secondary-600 disabled:opacity-50 transition"
        >
          Next
        </button>
      </div>

      <Toast.Provider swipeDirection="right">
        <Toast.Root
          open={toast.open}
          onOpenChange={(open) => setToast({ ...toast, open })}
          className={`fixed bottom-6 right-6 p-4 rounded-xl shadow-lg border backdrop-blur-sm ${
            toast.type === "success"
              ? "bg-green-50 dark:bg-green-800 text-green-700 dark:text-green-100 border-green-200 dark:border-green-700"
              : "bg-red-50 dark:bg-red-800 text-red-700 dark:text-red-100 border-red-200 dark:border-red-700"
          }`}
        >
          <Toast.Title className="font-semibold">{toast.message}</Toast.Title>
          <Toast.Close className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer">
            ✕
          </Toast.Close>
        </Toast.Root>
        <Toast.Viewport />
      </Toast.Provider>
    </div>
  );
};

export default UpcomingEventsPage;
