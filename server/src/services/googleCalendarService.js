const formatGoogleDate = (dateInput) => {
  const date = new Date(dateInput);

  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const seconds = String(date.getUTCSeconds()).padStart(2, '0');

  return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
};

const buildGoogleCalendarUrl = ({ title, startTime, endTime, details, location }) => {
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${formatGoogleDate(startTime)}/${formatGoogleDate(endTime)}`,
    details,
    location,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
};

const syncAppointmentToGoogleCalendar = async ({ appointment, clinic }) => {
  const addToCalendarUrl = buildGoogleCalendarUrl({
    title: `Vet appointment - ${clinic.clinicName}`,
    startTime: appointment.startTime,
    endTime: appointment.endTime,
    details: `Pet: ${appointment.petName}\nType: ${appointment.petType || 'Not specified'}\nReason: ${
      appointment.reason || 'General checkup'
    }`,
    location: clinic.address,
  });

  if (
    process.env.GOOGLE_CALENDAR_ENABLED !== 'true' ||
    !process.env.GOOGLE_CALENDAR_ID
  ) {
    return {
      status: 'not_configured',
      message:
        'Google Calendar API credentials are not configured yet. The appointment is saved and a fallback Google Calendar link is provided.',
      addToCalendarUrl,
      eventId: '',
    };
  }

  return {
    status: 'pending',
    message:
      'Appointment saved. Add Google OAuth or service account logic here to create the real calendar event and send reminder emails.',
    addToCalendarUrl,
    eventId: '',
  };
};

module.exports = {
  syncAppointmentToGoogleCalendar,
};
