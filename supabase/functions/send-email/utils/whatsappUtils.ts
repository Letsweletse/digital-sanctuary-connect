
// WhatsApp notification utilities

import { WhatsAppNotificationProps } from "../types/emailTypes.ts";

interface WhatsAppResult {
  success: boolean;
  message: string;
  directLink?: string;
  isLink: boolean; // Add this flag to clarify this is a link, not direct sending
}

/**
 * Generate a WhatsApp notification link using click-to-chat API
 * 
 * This generates a link that needs to be clicked by an admin to send the message
 * We track this as "prepared" rather than "sent" since it requires manual action
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
    
    console.log("Preparing WhatsApp notification link for:", sanitizedPhone);

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

    // Generate the WhatsApp API link - this is a deep link that will open WhatsApp with the message
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
