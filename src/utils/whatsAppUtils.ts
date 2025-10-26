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
    if (!finalMessage.includes("Apostolic Conference")) {
      finalMessage += "\n\n*Perspectives on the Apostolic Conference*";
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

📅 *Date:* Saturday, November 1, 2025
⏰ *Time:* 08:30 - 13:30
📍 *Location:* GATE Gaborone Auditorium, Gaborone
🗺️ *Get Directions:* https://maps.app.goo.gl/tKHAW2wV6sZ2yLy96

*About the Event:*
Join us for Perspectives on the Apostolic with Thamo Naidoo, Presiding Apostolic Elder of Gate Global Family. Registration is compulsory. Refreshments provided, freewill offerings received.

👤 *Attendee Details:*
• *Name:* ${attendee.name}
• *Email:* ${attendee.email}
• *Phone:* ${attendee.phone}
• *Role:* ${attendee.role}
• *Church:* ${attendee.denomination}
• *Attendees:* ${attendee.numberOfAttendees}

${registrationData.checkInUrl ? `🎫 *Check-in Link:* ${registrationData.checkInUrl}\n` : ''}

*Thank you for your registration!* We look forward to seeing you at this transformative conference.

For any questions, please reply to this message.

*Perspectives on the Apostolic Conference*`;

  return message;
};

// Generate simple confirmation message with clickable location link
export const generateSimpleWhatsAppMessage = (eventTitle: string, attendeeName: string, eventDate: string): string => {
  return `✅ Registration confirmed for ${eventTitle}

Hello ${attendeeName}, your registration has been successfully processed.

Date: Saturday, November 1, 2025
Time: 08:30 - 13:30
Location: GATE Gaborone Auditorium, Gaborone (VENUE UPDATE)
📍 Get Directions: https://maps.app.goo.gl/tKHAW2wV6sZ2yLy96

Thank you for your registration! We'll send you more details closer to the conference.

Perspectives on the Apostolic Conference`;
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
