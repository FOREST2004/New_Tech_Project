

export const validateEventForm = (form) => {
  if (!form.title.trim()) return "Event title is required";

  if (form.startAt && form.endAt && form.startAt >= form.endAt)
    return "Event start must be before event end";

  if (
    form.registrationStartAt &&
    form.registrationEndAt &&
    form.registrationStartAt >= form.registrationEndAt
  )
    return "Registration start must be before registration end";

  if (form.registrationEndAt && form.startAt && form.registrationEndAt > form.startAt)
    return "Registration must end before event starts";

  if (
    form.minAttendees &&
    form.maxAttendees &&
    parseInt(form.minAttendees) > parseInt(form.maxAttendees)
  )
    return "Min attendees cannot exceed max attendees";

  if (form.deposit && parseFloat(form.deposit) < 0) return "Deposit cannot be negative";

  return null; 
};
