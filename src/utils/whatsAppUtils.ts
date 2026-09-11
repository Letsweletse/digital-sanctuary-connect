import { RegistrationData } from '@/types/eventTypes';

// Direct WhatsApp API configuration
const ULTRAMSG_API_KEY = 'o964nb1a72gawau2';
const ULTRAMSG_INSTANCE_ID = '189302';

// Send WhatsApp message directly via UltraMsg API
export const sendDirectWhatsAppMessage = async (phone: string, message: string) => {
  console.log('📱 [WhatsApp Direct] Sending message to:', phone);
  console.log('💬 [WhatsApp Direct] Message length:', message.length);
  
  try {
    const phoneRegex = /^\+\d{10,15}$/;
    if (!phoneRegex.test(phone)) {
      console.error('❌ [WhatsApp Direct] Invalid phone format:', phone);
      return { error: true, message: "Invalid phone number format. Please include country code." };
    }

    let finalMessage = message;
    if (!finalMessage.includes("Gate Gaborone")) finalMessage += "\n\n*Gate Gaborone - Reach | Resource | Reform*";

    const response = await fetch(`https://api.ultramsg.com/instance${ULTRAMSG_INSTANCE_ID}/messages/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ token: ULTRAMSG_API_KEY, to: phone, body: finalMessage, priority: 10 })
    });
    if (!response.ok) {
      const errorText = await response.text();
      return { error: true, message: `WhatsApp API error: ${response.status} - ${errorText}` };
    }
    const responseData = await response.json();
    return { success: true, data: responseData, message: "WhatsApp message sent successfully" };
  } catch (error) {
    return { error: true, message: error instanceof Error ? error.message : "Unknown error" };
  }
};

// Generate premium WhatsApp confirmation message - DYNAMIC based on event data
export const generatePremiumWhatsAppConfirmation = (registrationData: RegistrationData): string => {
  const { event, attendee } = registrationData;
  const message = `✅ *REGISTRATION CONFIRMED*

🎉 *${event.title}*

📅 *Date:* ${event.date}
⏰ *Time:* ${event.time || 'TBA'}
📍 *Location:* ${event.location || 'TBA'}
🗺️ *Get Directions:* https://www.google.com/maps/search/?api=1&query=-24.6533978%2C25.7800975

👤 *Attendee Details:*
• *Name:* ${attendee.name}
• *Email:* ${attendee.email}
• *Phone:* ${attendee.phone}
• *Role:* ${attendee.role || 'N/A'}
• *Church:* ${attendee.denomination || 'N/A'}
• *Attendees:* ${attendee.numberOfAttendees || 1}

${registrationData.checkInUrl ? `🎫 *Check-in Link:* ${registrationData.checkInUrl}\n` : ''}

📌 *Important:*
• Refreshments will be provided
• Freewill offerings will be received

*Thank you for your registration!* We look forward to seeing you.

For enquiries: tms@btcmail.co.bw or call 72171066 / 72374568

*Gate Gaborone - Reach • Resource • Reform*`;
  return message;
};

export const generateSimpleWhatsAppMessage = (eventTitle: string, attendeeName: string, eventDate: string): string => {
  return `✅ Registration confirmed for ${eventTitle}\n\nHello ${attendeeName}, your registration has been successfully processed.\n\n📅 Date: ${eventDate}\n\nThank you for your registration! We'll send you more details closer to the event.\n\nFor enquiries: tms@btcmail.co.bw or call 72171066 / 72374568\n\nGate Gaborone - Reach • Resource • Reform`;
};

export const validateWhatsAppPhone = (phone: string): { isValid: boolean; cleanedPhone: string; message?: string } => {
  let cleaned = phone.replace(/[^\d+]/g, '');
  if (!cleaned.startsWith('+')) cleaned = '+' + cleaned;
  const phoneRegex = /^\+\d{10,15}$/;
  if (!phoneRegex.test(cleaned)) return { isValid: false, cleanedPhone: cleaned, message: "Phone number must be in international format (+country code + number)" };
  return { isValid: true, cleanedPhone: cleaned };
};
