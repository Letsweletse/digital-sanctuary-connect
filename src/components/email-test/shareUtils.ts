
export const createShareLinks = (
  eventName: string,
  eventDate: string,
  eventTime: string,
  checkInId?: string
) => {
  const churchUrl = "https://gategaborone.com";
  const tagline = "Reach | Resource | Reform";
  
  // Direct Google Maps URL for Gate Gaborone - no shortened URL
  const mapsUrl = "https://www.google.com/maps/place/Gate+Gaborone/@-24.6618567,25.9048083,15z/data=!4m6!3m5!1s0x1ebb5b26225a6213:0xaed9e468c1e4ef31!8m2!3d-24.6618567!4d25.9048083!16s%2Fg%2F11q89m2yrq";
  
  // Create WhatsApp sharing text with event details, check-in ID and proper branding
  const shareText = checkInId 
    ? `I just registered for ${eventName} at Gate Gaborone on ${eventDate} at ${eventTime}. Join me! My check-in ID is: ${checkInId}. View location: ${mapsUrl}. To register visit: ${churchUrl}/events or call: 0993181830 or 0993749297. ${tagline}`
    : `Join me at ${eventName} at Gate Gaborone on ${eventDate} at ${eventTime}. View location: ${mapsUrl}. To register visit: ${churchUrl}/events or call: 0993181830 or 0993749297. ${tagline}`;
  
  const socialShareText = `Join me at ${eventName} at Gate Gaborone on ${eventDate} at ${eventTime}. ${tagline}`;
  
  return {
    whatsapp: `https://wa.me/?text=${encodeURIComponent(shareText)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(churchUrl + '/events')}&quote=${encodeURIComponent(socialShareText)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(socialShareText + " " + churchUrl + "/events")}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(churchUrl + '/events')}&summary=${encodeURIComponent(socialShareText)}`,
    instagram: `https://www.instagram.com/?url=${encodeURIComponent(churchUrl + '/events')}`,
    email: `mailto:?subject=${encodeURIComponent("Gate Gaborone: " + eventName)}&body=${encodeURIComponent(socialShareText + "\n\nLocation: " + mapsUrl + "\n\nRegister at: " + churchUrl + "/events" + " or by calling: 0993181830 or 0993749297")}`
  };
};
