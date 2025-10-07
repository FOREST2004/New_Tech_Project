import React, { useEffect, useState } from "react";
import EventFilter from "../../../components/admin/eventlist/EventFilter";
import EventTable from "../../../components/admin/eventlist/EventTable";
import Pagination from "../../../components/admin/eventlist/Pagination";
import { getEventStatus } from "../../../utils/getEventStatus";
import { useNavigate } from "react-router-dom";
import {
  showErrorAlert,
  showDeleteErrorAlert,
} from "../../../utils/errorHandler";
import { getEvents, deleteEvent } from "../../../services/admin/event/eventService";
import { PlusIcon } from "@radix-ui/react-icons";

const EventListPage = () => {
  const [events, setEvents] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({});
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const loadEvents = async () => {
    try {
      const response = await getEvents({ page, limit, ...filters });
      const eventsWithStatus = response.events.map((ev) => ({
        ...ev,
        status: getEventStatus(ev),
      }));
      setEvents(eventsWithStatus);
      setTotal(response.total || 0);
      setMsg("");
    } catch (err) {
      showErrorAlert(err);
      setEvents([]);
      setTotal(0);
      setMsg("");
    }
  };

  useEffect(() => {
    loadEvents();
  }, [page, filters]);

  const handleDelete = async (id) => {
    const eventToDelete = events.find((event) => event.id === id);
    if (!eventToDelete) return alert("❌ Event not found!");
    if ((eventToDelete.registeredCount || 0) > 0) {
      return alert(
        `❌ Cannot delete this event! There are ${eventToDelete.registeredCount} registered members.`
      );
    }
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    try {
      await deleteEvent(id);
      alert("✅ Event deleted successfully!");
      loadEvents();
    } catch (err) {
      console.error(err);
      showDeleteErrorAlert(err, "event");
    }
  };

  const handleFilter = (newFilters) => {
    setPage(1);
    setFilters(newFilters);
  };

  const handlePageChange = (newPage) => setPage(newPage);

  return (
    <div className="
      min-h-screen 
      bg-gradient-to-br from-primary-500 via-white to-accent-300 
      dark:from-secondary-400 dark:via-secondary-600 dark:to-secondary-900 
      items-center justify-center p-4 transition-all duration-300
      ">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
            📅 Event Management
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage all your events efficiently
          </p>
        </div>

        <button
          onClick={() => navigate("/admin/events/create")}
          className="flex items-center gap-2 
            bg-secondary-400 text-white 
            dark:bg-secondary-700 
            px-4 py-2 rounded-xl shadow hover:bg-secondary-500 "
        >
          <PlusIcon className="w-5 h-5" />
          Create Event
        </button>
      </div>

      <div className="form-card bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-4 mb-6 border border-gray-200 dark:border-gray-700">
        <EventFilter onFilter={handleFilter} />
      </div>

      <div className="bg-white dark:bg-gray-100 shadow-lg rounded-2xl overflow-x-auto border border-gray-200 dark:border-gray-700">
        <EventTable
          events={events}
          onDelete={handleDelete}
          page={page}
          limit={limit}
          onEdit={(id) => navigate(`/admin/events/edit/${id}`)}
        />
      </div>

      <div className="mt-6 flex justify-center">
        <Pagination
          total={total}
          page={page}
          limit={limit}
          onPageChange={handlePageChange}
        />
      </div>

      {msg && (
        <div className="mt-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg shadow">
          {msg}
        </div>
      )}
    </div>
  );
};

export default EventListPage;
