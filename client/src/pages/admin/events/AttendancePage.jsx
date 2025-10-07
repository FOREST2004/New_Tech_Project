import React, { useEffect, useState } from "react";
import EventSelect from "../../../components/admin/attendance/EventSelect";
import MemberTable from "../../../components/admin/attendance/MemberTable";
import { getOngoingEvents, getRegistrations, updateRegistrationStatus } from "../../../services/admin/event/attendanceService";
import { showErrorAlert } from "../../../utils/errorHandler";

function AttendancePage() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await getOngoingEvents();
        if (response.success) setEvents(response.events);
      } catch (error) {
        console.error("Error fetching ongoing events:", error);
        showErrorAlert(error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    const fetchRegistrations = async () => {
      if (!selectedEvent) {
        setRegistrations([]);
        return;
      }
      try {
        setLoading(true);
        const response = await getRegistrations(selectedEvent);
        const formattedRegs = response.registrations.map((reg) => ({
          id: reg.id,
          user: reg.user,
          attended: reg.attendance || false,
          depositPaid: reg.depositPaid || false,
        }));
        setRegistrations(formattedRegs);
      } catch (error) {
        console.error("Error fetching registrations:", error);
        showErrorAlert(error);
      } finally {
        setLoading(false);
      }
    };
    fetchRegistrations();
  }, [selectedEvent]);

  const handleToggle = (regId, type) => {
    setRegistrations((prev) =>
      prev.map((reg) => {
        if (reg.id !== regId) return reg;
        if (type === "attended") return { ...reg, attended: !reg.attended };
        if (type === "depositPaid") {
          const newDepositPaid = !reg.depositPaid;
          return { 
            ...reg, 
            depositPaid: newDepositPaid,
            attended: newDepositPaid ? reg.attended : false
          };
        }
        return reg;
      })
    );
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const updates = registrations.map((reg) => ({
        registrationId: reg.id,
        attended: reg.attended,
        depositPaid: reg.depositPaid,
      }));
      await updateRegistrationStatus(updates);
      alert("Updates saved successfully!");
    } catch (error) {
      console.error("Error saving updates:", error);
      showErrorAlert(error);
    } finally {
      setSaving(false);
    }
  };

  const currentEventStatus = events.find(ev => ev.id === Number(selectedEvent))?.status || "";

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500 dark:text-gray-400">
        Loading...
      </div>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-br from-primary-500 via-white to-accent-300 
            dark:from-secondary-400 dark:via-secondary-600 dark:to-secondary-900 
            items-center justify-center p-4 transition-all duration-300
    ">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">
        Attendance & Deposit
      </h1>

      {events.length === 0 ? (
        <div className="text-center text-gray-500 dark:text-gray-300 py-12 bg-white dark:bg-gray-200 shadow rounded-lg">
          No ongoing events available
        </div>
      ) : (
        <>
          <EventSelect
            events={events}
            selectedEvent={selectedEvent}
            onChange={(e) => setSelectedEvent(e.target.value)}
          />

          <div className="card mt-4 overflow-x-auto bg-white dark:bg-gray-800 shadow rounded-lg p-4
          ">
            <MemberTable
              registrations={registrations}
              isOngoing={currentEventStatus === "ONGOING"}
              onToggle={handleToggle}
            />
          </div>

          {selectedEvent && (
            <div className="flex justify-end mt-6">
              <button
                onClick={handleSave}
                disabled={saving}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg ${
                  saving
                    ? "bg-gray-400 cursor-not-allowed text-gray-200"
                    : "bg-blue-600 hover:bg-blue-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                }`}
              >
                {saving && (
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    ></path>
                  </svg>
                )}
                {saving ? "Saving..." : "Save Updates"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default AttendancePage;
