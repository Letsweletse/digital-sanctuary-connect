
// SMS notification utilities using Twilio
import { SMSNotificationProps } from "../types/emailTypes.ts";

interface SMSResult {
  success: boolean;
  message: string;
  sid?: string;
}

/**
 * Send an SMS notification using Twilio
 */
export async function sendSmsNotification({
  phone,
  eventName,
  eventDate,
  eventTime,
  location,
  checkInId
}: SMSNotificationProps): Promise<SMSResult> {
  try {
    // Get Twilio credentials from environment
    const accountSid = Deno.env.get("TWILIO_ACCOUNT_SID");
    const authToken = Deno.env.get("TWILIO_AUTH_TOKEN");
    const twilioPhone = Deno.env.get("TWILIO_PHONE_NUMBER");
    
    // Check if Twilio is configured
    if (!accountSid || !authToken || !twilioPhone) {
      console.warn("Twilio credentials not configured. SMS notification skipped.");
      return {
        success: false,
        message: "Twilio credentials missing. SMS notification skipped."
      };
    }
    
    // Sanitize the phone number - remove non-numeric characters except +
    let sanitizedPhone = phone.replace(/[^\d+]/g, '');
    
    // Add + prefix if missing
    if (!sanitizedPhone.startsWith('+')) {
      sanitizedPhone = '+' + sanitizedPhone;
    }
    
    // Quick validation
    if (sanitizedPhone.length < 8) {
      console.error("Phone number too short:", sanitizedPhone);
      return {
        success: false,
        message: "Invalid phone number: too short"
      };
    }
    
    console.log("Sending SMS notification to:", sanitizedPhone);

    // Create the SMS message with event details
    const message = `
Event Registration Confirmation:
${eventName}
Date: ${eventDate}
Time: ${eventTime}
Location: ${location}
Check-in ID: ${checkInId}
We look forward to seeing you! - Gate Gaborone
    `.trim();

    // Set up Twilio client
    const { Twilio } = await import("npm:twilio@4.20.1");
    const client = new Twilio(accountSid, authToken);
    
    // Send SMS
    const response = await client.messages.create({
      body: message,
      from: twilioPhone,
      to: sanitizedPhone,
    });
    
    console.log("SMS sent successfully with SID:", response.sid);
    
    return {
      success: true,
      message: "SMS notification sent successfully",
      sid: response.sid
    };
  } catch (error) {
    console.error("Error in SMS notification:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error in SMS notification"
    };
  }
}
