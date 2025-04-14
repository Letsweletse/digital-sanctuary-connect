
export const createShareLinks = (
  eventName: string,
  eventDate: string,
  eventTime: string,
  checkInId?: string
) => {
  const churchUrl = "https://gategaborone.com";
  
  // Create WhatsApp sharing text with event details and check-in ID if available
  const shareText = checkInId 
    ? `I just registered for ${eventName} at Capital City Baptist Hall on ${eventDate} at ${eventTime}. Join me! My check-in ID is: ${checkInId}. To register visit: ${churchUrl}/events or call: 0993181830 or 0993749297`
    : `Join me at ${eventName} at Capital City Baptist Hall on ${eventDate} at ${eventTime}. To register visit: ${churchUrl}/events or call: 0993181830 or 0993749297`;
  
  const socialShareText = `Join me at ${eventName} at Capital City Baptist Hall on ${eventDate} at ${eventTime}. Theme: "The Times of Refreshing" (Acts 3:19).`;
  
  return {
    whatsapp: `https://wa.me/?text=${encodeURIComponent(shareText)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(churchUrl + '/events')}&quote=${encodeURIComponent(socialShareText)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(socialShareText + " " + churchUrl + "/events")}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(churchUrl + '/events')}&summary=${encodeURIComponent(socialShareText)}`,
    instagram: `https://www.instagram.com/?url=${encodeURIComponent(churchUrl + '/events')}`,
    email: `mailto:?subject=${encodeURIComponent(eventName)}&body=${encodeURIComponent(socialShareText + "\n\nRegister at: " + churchUrl + "/events" + " or by calling: 0993181830 or 0993749297")}`
  };
};
