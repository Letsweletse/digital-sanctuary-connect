
import { RegistrationData } from '@/types/eventTypes';

// Direct WhatsApp API configuration
const ULTRAMSG_API_KEY = 'zpivrjhut12tefx6';
const ULTRAMSG_INSTANCE_ID = '114633';

// Send WhatsApp message directly via UltraMsg API
export const sendDirectWhatsAppMessage = async (phone: string, message: string) => {
  console.log('📱 [WhatsApp Direct] Sending message to:', phone);
  console.log('💬 [WhatsApp Direct] Message length:', message.length);
  
  try {
    // Validate phone number format
    const phoneRegex = /^\+\d{10,15}$/;
    if (!phoneRegex.test(phone)) {
      console.error('❌ [WhatsApp Direct] Invalid phone format:', phone);
      return {
        error: true,
        message: "Invalid phone number format. Please include country code."
      };
    }

    // Ensure message includes branding
    let finalMessage = message;
    if (!finalMessage.includes("Gate Gaborone")) {
      finalMessage += "\n\n*Gate Gaborone* - Reach | Resource | Reform";
    }

    // Make direct API call to UltraMsg
    const response = await fetch(`https://api.ultramsg.com/instance${ULTRAMSG_INSTANCE_ID}/messages/chat`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        token: ULTRAMSG_API_KEY,
        to: phone,
        body: finalMessage,
        priority: 10
      })
    });

    console.log('📱 [WhatsApp Direct] API Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ [WhatsApp Direct] API Error:', errorText);
      return {
        error: true,
        message: `WhatsApp API error: ${response.status} - ${errorText}`
      };
    }

    const responseData = await response.json();
    console.log('✅ [WhatsApp Direct] Success response:', responseData);

    return {
      success: true,
      data: responseData,
      message: "WhatsApp message sent successfully"
    };

  } catch (error) {
    console.error('❌ [WhatsApp Direct] Exception:', error);
    return {
      error: true,
      message: error instanceof Error ? error.message : "Unknown WhatsApp error"
    };
  }
};

// Generate premium WhatsApp confirmation message with clickable location link
export const generatePremiumWhatsAppConfirmation = (registrationData: RegistrationData): string => {
  const { event, attendee } = registrationData;
  
  const message = `✅ *REGISTRATION CONFIRMED*

🎉 *${event.title}*

📅 *Dates:* July 3-5, 2025
📍 *Location:* Travelodge Conference Centre, Gaborone
🗺️ *Get Directions:* https://maps.app.goo.gl/Y5BPKfURyqQJ8EuXA

⏰ *Schedule:*
• Thursday Evening: Session 1 (18:00–20:30)
• Friday Morning: Sessions 2–4 (08:30–13:30)
• Friday Evening: Session 5 (18:00–20:30)
• Saturday Morning: Sessions 6–8 (08:30–13:30)

👤 *Attendee Details:*
• *Name:* ${attendee.name}
• *Email:* ${attendee.email}
• *Phone:* ${attendee.phone}
• *Role:* ${attendee.role}
• *Church:* ${attendee.denomination}
• *Attendees:* ${attendee.numberOfAttendees}
• *Registration Fee:* P250

${registrationData.checkInUrl ? `🎫 *Check-in Link:* ${registrationData.checkInUrl}\n` : ''}

*Thank you for registering!* We look forward to seeing you at this transformative conference where you'll learn to rule your domain through apostolic principles.

For any questions, please contact us at info@gategaborone.com

*Gate Gaborone*
_Reach | Resource | Reform_`;

  return message;
};

// Generate simple confirmation message with clickable location link
export const generateSimpleWhatsAppMessage = (eventTitle: string, attendeeName: string, eventDate: string): string => {
  return `✅ Registration confirmed for ${eventTitle}

Hello ${attendeeName}, your registration has been successfully processed.

Conference Dates: July 3-5, 2025
Location: Travelodge Conference Centre, Gaborone
📍 Get Directions: https://maps.app.goo.gl/Y5BPKfURyqQJ8EuXA
Registration Fee: P250

Thank you for registering! We'll send you more details closer to the conference.

Gate Gaborone
Reach | Resource | Reform`;
};

// Validate phone number for WhatsApp
export const validateWhatsAppPhone = (phone: string): { isValid: boolean; cleanedPhone: string; message?: string } => {
  // Remove all non-digit characters except +
  let cleaned = phone.replace(/[^\d+]/g, '');
  
  // Ensure it starts with +
  if (!cleaned.startsWith('+')) {
    cleaned = '+' + cleaned;
  }
  
  // Check if it's a valid international format
  const phoneRegex = /^\+\d{10,15}$/;
  
  if (!phoneRegex.test(cleaned)) {
    return {
      isValid: false,
      cleanedPhone: cleaned,
      message: "Phone number must be in international format (+country code + number)"
    };
  }
  
  return {
    isValid: true,
    cleanedPhone: cleaned
  };
};
