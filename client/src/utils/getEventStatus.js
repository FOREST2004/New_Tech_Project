// utils/getEventStatus.js
export function getEventStatus(event) {
  const now = new Date();

  const registrationStart = event.registrationStartAt
    ? new Date(event.registrationStartAt)
    : null;
  const registrationEnd = event.registrationEndAt
    ? new Date(event.registrationEndAt)
    : null;
  const start = event.startAt ? new Date(event.startAt) : null;
  const end = event.endAt ? new Date(event.endAt) : null;

  if (event.status) return event.status;

  if (registrationStart && now < registrationStart) return "DRAFT";

  if (
    registrationStart &&
    registrationEnd &&
    now >= registrationStart &&
    now < registrationEnd
  ) {
    return "REGISTRATION";
  }


  if (registrationEnd && now >= registrationEnd && start && now < start) {
    if (event.attendees && event.attendees.length >= (event.minAttendees || 1)) {
      return "READY";
    }
    return "CANCELLED";
  }

  if (start && end && now >= start && now < end) return "ONGOING";

  if (end && now >= end) return "COMPLETED";

  return "UNKNOWN";
}
