
// WhatsApp notification utilities

import { WhatsAppNotificationProps } from "../types/emailTypes.ts";

interface WhatsAppResult {
  success: boolean;
  message: string;
  directLink?: string;
  isLink: boolean; // This flag indicates if this is a link or direct sending
}

/**
 * Send a WhatsApp notification using the official WhatsApp Business API
 * 
 * This function attempts to send a WhatsApp message directly if possible,
 * falling back to generating a click-to-chat link that needs manual sending
 */
export async function sendWhatsAppNotification({
  phone,
  eventName,
  eventDate,
  eventTime,
  location,
  checkInId
}: WhatsAppNotificationProps): Promise<WhatsAppResult> {
  try {
    // Sanitize the phone number - remove non-numeric characters except +
    let sanitizedPhone = phone.replace(/[^\d+]/g, '');
    
    // Ensure the phone number has a "+" prefix if it's missing
    if (!sanitizedPhone.startsWith('+')) {
      sanitizedPhone = '+' + sanitizedPhone;
    }
    
    // Quick validation
    if (sanitizedPhone.length < 8) {
      console.error("Phone number too short:", sanitizedPhone);
      return {
        success: false,
        message: "Invalid phone number: too short",
        isLink: false
      };
    }
    
    console.log("Processing WhatsApp notification for:", sanitizedPhone);

    // Create the WhatsApp message with better formatting
    const message = `
📅 *Event Registration Confirmation*

Hello! Thank you for registering for *${eventName}*.

*Event Details:*
• Date: ${eventDate}
• Time: ${eventTime}
• Location: ${location}
• Check-in ID: ${checkInId}

We're looking forward to seeing you there! Save this message for quick check-in.

- Gate Gaborone Church
    `;

    // Check if we have WhatsApp Business API credentials
    const whatsappBusinessToken = Deno.env.get("WHATSAPP_BUSINESS_TOKEN");
    const whatsappBusinessPhoneId = Deno.env.get("WHATSAPP_BUSINESS_PHONE_ID");
    
    // If we have WhatsApp Business API credentials, try to send directly
    if (whatsappBusinessToken && whatsappBusinessPhoneId) {
      try {
        console.log("Attempting direct WhatsApp send via Business API");
        
        // Prepare the WhatsApp API request
        const whatsappApiUrl = `https://graph.facebook.com/v19.0/${whatsappBusinessPhoneId}/messages`;
        
        // Format the message for WhatsApp API
        const apiPayload = {
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to: sanitizedPhone,
          type: "text",
          text: { 
            body: message
          }
        };
        
        // Send the request to WhatsApp Business API
        const response = await fetch(whatsappApiUrl, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${whatsappBusinessToken}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(apiPayload)
        });
        
        const result = await response.json();
        console.log("WhatsApp Business API response:", result);
        
        if (response.ok && result.messages && result.messages.length > 0) {
          console.log("✅ WhatsApp notification sent successfully via Business API");
          return {
            success: true,
            message: "WhatsApp notification sent successfully via Business API",
            isLink: false
          };
        } else {
          console.error("❌ WhatsApp Business API error:", result);
          throw new Error("WhatsApp Business API error: " + JSON.stringify(result));
        }
      } catch (apiError) {
        console.error("Error with WhatsApp Business API:", apiError);
        console.log("Falling back to WhatsApp link generation...");
        // Fall back to link generation on API error
      }
    } else {
      console.log("WhatsApp Business API credentials not configured, using link generation fallback");
    }

    // Fallback to generating a WhatsApp deep link
    const whatsappLink = `https://wa.me/${sanitizedPhone}?text=${encodeURIComponent(message)}`;
    
    console.log("Generated WhatsApp notification link for:", sanitizedPhone);
    console.log("Direct WhatsApp link (for admin use):", whatsappLink);
    
    return {
      success: true,
      message: "WhatsApp notification link generated successfully. Note: An admin must click this link to send the message.",
      directLink: whatsappLink,
      isLink: true  // This flag indicates this is a link, not an actual sent message
    };
  } catch (error) {
    console.error("Error in WhatsApp notification:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error in WhatsApp notification",
      isLink: false
    };
  }
}
