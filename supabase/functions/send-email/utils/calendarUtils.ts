
interface IcsContentProps {
  eventName: string;
  startDateFormatted: string;
  endDateFormatted: string;
  nowFormatted: string;
  location: string;
  message: string;
  checkInId: string;
}

export function formatDateForCalendar(eventDate: string, eventTime: string) {
  // Format date and time for iCal
  const eventDateObj = new Date(eventDate);
  const startTime = eventTime.split(" - ")[0];
  const endTime = eventTime.split(" - ")[1] || "12:00 PM";
  
  // Set start and end times for the event
  const startDate = new Date(eventDateObj);
  const endDate = new Date(eventDateObj);
  const startDateFormatted = formatDate(startDate, startTime);
  const endDateFormatted = formatDate(endDate, endTime);
  
  // Current date for DTSTAMP
  const now = new Date();
  const nowFormatted = formatDate(now, now.getHours() + ":" + now.getMinutes());

  return {
    startDateFormatted,
    endDateFormatted,
    nowFormatted
  };
}

export function formatDate(date: Date, time: string) {
  const [hours, minutes] = time.replace(/[APM]/g, "").trim().split(":");
  let hour = parseInt(hours);
  if (time.includes("PM") && hour < 12) hour += 12;
  if (time.includes("AM") && hour === 12) hour = 0;
  
  date.setHours(hour, parseInt(minutes) || 0, 0);
  return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

export function generateIcsContent({
  eventName,
  startDateFormatted,
  endDateFormatted,
  nowFormatted,
  location,
  message,
  checkInId
}: IcsContentProps): string {
  return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Gate Gaborone//NONSGML v1.0//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
UID:${checkInId}@gategaborone.com
DTSTAMP:${nowFormatted}
DTSTART:${startDateFormatted}
DTEND:${endDateFormatted}
SUMMARY:${eventName}
LOCATION:${location}
DESCRIPTION:Join us for ${eventName}. ${message || "We look forward to seeing you!"} Your check-in ID is: ${checkInId}
ORGANIZER;CN=Gate Gaborone:mailto:info@gategaborone.com
STATUS:CONFIRMED
SEQUENCE:0
TRANSP:OPAQUE
BEGIN:VALARM
TRIGGER:-PT1H
DESCRIPTION:Reminder for ${eventName}
ACTION:DISPLAY
END:VALARM
END:VEVENT
END:VCALENDAR`;
}
