
/**
 * Utility for sending WhatsApp notifications directly using fetch API
 * This can be used independently alongside the existing hook-based implementation
 */

/**
 * Send a WhatsApp notification directly using the UltraMsg API
 * @param phone - Phone number with country code (e.g. +26771234567)
 * @param message - Message to send via WhatsApp
 * @returns Promise with the response data
 */
export const sendDirectWhatsAppMessage = async (phone: string, message: string) => {
  try {
    console.log("📱 [Direct WhatsApp] Sending message to:", phone);
    
    // Validate phone number format (basic validation)
    const phoneRegex = /^\+\d{10,15}$/;
    if (!phoneRegex.test(phone)) {
      console.error("❌ [Direct WhatsApp] Invalid phone number format:", phone);
      return {
        error: true,
        message: "Invalid phone number format. Please provide number with country code (e.g. +267XXXXXXXX)"
      };
    }
    
    // Add Gate Gaborone branding if not present
    let finalMessage = message;
    if (!finalMessage.includes("Gate Gaborone") && !finalMessage.includes("Reach | Resource | Reform")) {
      finalMessage += "\n\nGate Gaborone - Reach | Resource | Reform";
    }
    
    // DIRECT API CALL TO ULTRAMSG - bypassing Edge Function
    const ULTRAMSG_API_KEY = 'zpivrjhut12tefx6';
    const ULTRAMSG_INSTANCE_ID = '114633';
    
    const response = await fetch(`https://api.ultramsg.com/instance${ULTRAMSG_INSTANCE_ID}/messages/chat`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json" 
      },
      body: JSON.stringify({
        token: ULTRAMSG_API_KEY,
        to: phone,
        body: finalMessage,
        priority: 10 // High priority to ensure faster delivery
      })
    });
    
    if (!response.ok) {
      throw new Error(`WhatsApp API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("✅ [Direct WhatsApp] Message sent successfully:", data);
    
    return {
      success: true,
      data
    };
  } catch (error) {
    console.error("🚨 [Direct WhatsApp] Error sending message:", error);
    return {
      error: true,
      message: error instanceof Error ? error.message : "Unknown error sending WhatsApp message"
    };
  }
};

/**
 * Generate a premium-looking WhatsApp confirmation message with enhanced formatting
 * @param registrationData - The registration data object
 * @returns Formatted WhatsApp message with professional styling
 */
export const generatePremiumWhatsAppConfirmation = (registrationData: any) => {
  const { event, attendee } = registrationData;
  
  // Create QR code value for check-in
  const qrCodeValue = JSON.stringify({
    eventId: event.id,
    eventName: event.title,
    attendeeName: attendee.name,
    attendeeEmail: attendee.email
  });
  
  // Create a professional, visually appealing message with emojis and formatting
  return `✅ *REGISTRATION CONFIRMED*\n
🎫 *Event:* ${event.title}
📅 *Date:* ${event.date}
⏰ *Time:* ${event.time}
📍 *Location:* Gate Gaborone
🔗 *Map:* https://maps.app.goo.gl/mVLNzv5R2T8wQZNt7

👤 *ATTENDEE DETAILS*
*Name:* ${attendee.name}
*Email:* ${attendee.email}
*Phone:* ${attendee.phone}
*Role:* ${attendee.role}
*Number of Attendees:* ${attendee.numberOfAttendees || 1}

Your registration has been successfully confirmed! 
We are excited to welcome you to this event.

Please save this message for your reference and show it at entry.

*GATE GABORONE*
_Reach | Resource | Reform_

For any questions, please contact us at +267 3500194 / +267 75507981`;
};
