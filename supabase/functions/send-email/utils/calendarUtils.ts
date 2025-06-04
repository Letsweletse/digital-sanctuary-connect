
// Helper function to format dates for calendar events
export const formatDate = (dateString: string): string => {
  console.log('📅 [Calendar Utils] Formatting date:', dateString);
  
  // Handle different date formats
  if (!dateString) {
    console.warn('⚠️ [Calendar Utils] No date provided, using current date');
    return new Date().toISOString();
  }
  
  // If it's already a valid ISO string, return it
  try {
    const isoTest = new Date(dateString);
    if (!isNaN(isoTest.getTime()) && dateString.includes('T')) {
      return isoTest.toISOString();
    }
  } catch (e) {
    console.log('📅 [Calendar Utils] Not an ISO date, continuing with parsing');
  }
  
  // Handle formatted dates like "Thursday, July 3" or "Tuesday, July 3"
  if (dateString.includes(',')) {
    const parts = dateString.split(',');
    if (parts.length >= 2) {
      const monthDay = parts[1].trim(); // "July 3"
      const currentYear = new Date().getFullYear();
      
      // Try to parse with current year
      const fullDateString = `${monthDay}, ${currentYear}`;
      console.log('📅 [Calendar Utils] Trying to parse:', fullDateString);
      
      const parsedDate = new Date(fullDateString);
      if (!isNaN(parsedDate.getTime())) {
        console.log('✅ [Calendar Utils] Successfully parsed date:', parsedDate.toISOString());
        return parsedDate.toISOString();
      }
    }
  }
  
  // Try direct parsing
  try {
    const directParse = new Date(dateString);
    if (!isNaN(directParse.getTime())) {
      console.log('✅ [Calendar Utils] Direct parse successful:', directParse.toISOString());
      return directParse.toISOString();
    }
  } catch (e) {
    console.error('❌ [Calendar Utils] Direct parse failed:', e);
  }
  
  // Fallback to current date + 7 days if all parsing fails
  console.warn('⚠️ [Calendar Utils] All date parsing failed, using fallback date');
  const fallbackDate = new Date();
  fallbackDate.setDate(fallbackDate.getDate() + 7);
  return fallbackDate.toISOString();
};

export const formatDateForCalendar = (eventDate: string, eventTime: string) => {
  console.log('📅 [Calendar Utils] Input - eventDate:', eventDate, 'eventTime:', eventTime);
  
  const startDateFormatted = formatDate(eventDate);
  
  // Create end date (2 hours after start by default)
  const startDate = new Date(startDateFormatted);
  const endDate = new Date(startDate);
  endDate.setHours(startDate.getHours() + 2);
  
  const endDateFormatted = endDate.toISOString();
  const nowFormatted = new Date().toISOString();
  
  console.log('📅 [Calendar Utils] Output:', {
    startDateFormatted,
    endDateFormatted,
    nowFormatted
  });
  
  return {
    startDateFormatted,
    endDateFormatted,
    nowFormatted
  };
};

export const generateIcsContent = (params: {
  eventName: string;
  startDateFormatted: string;
  endDateFormatted: string;
  nowFormatted: string;
  location: string;
  message: string;
  checkInId: string;
}) => {
  const {
    eventName,
    startDateFormatted,
    endDateFormatted,
    nowFormatted,
    location,
    message,
    checkInId
  } = params;

  // Format dates for ICS (remove colons and hyphens)
  const formatForIcs = (dateString: string) => {
    return dateString.replace(/-|:|\.\d{3}/g, "").replace("Z", "Z");
  };

  const startIcs = formatForIcs(startDateFormatted);
  const endIcs = formatForIcs(endDateFormatted);
  const nowIcs = formatForIcs(nowFormatted);

  return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Gate Gaborone//Event Registration//EN
BEGIN:VEVENT
UID:${checkInId}@gategaborone.com
DTSTAMP:${nowIcs}
DTSTART:${startIcs}
DTEND:${endIcs}
SUMMARY:${eventName}
DESCRIPTION:${message}\\n\\nCheck-in ID: ${checkInId}
LOCATION:${location}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;
};
