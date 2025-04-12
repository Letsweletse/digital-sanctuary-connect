
import { Resend } from "npm:resend@2.0.0";
import { v4 as uuidv4 } from "https://deno.land/std@0.190.0/uuid/mod.ts";
import { corsHeaders } from "../utils/cors.ts";
import { EmailRequest } from "../types/emailTypes.ts";
import { sendWhatsAppNotification } from "../utils/whatsappUtils.ts";
import { sendSmsNotification } from "../utils/smsUtils.ts";
import { logEmailDelivery, generateDeliveryReport } from "../utils/emailLogging.ts";

// Initialize Resend with API key from environment variable
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
console.log("RESEND_API_KEY available:", RESEND_API_KEY ? "Yes (length: " + RESEND_API_KEY.length + ")" : "No");

if (!RESEND_API_KEY) {
  console.error("CRITICAL ERROR: RESEND_API_KEY environment variable is not set or empty!");
}

const resend = new Resend(RESEND_API_KEY);

export async function processEmailRequest(req: Request): Promise<Response> {
  try {
    console.log("Starting email processing");

    if (!RESEND_API_KEY) {
      console.error("ERROR: Missing RESEND_API_KEY");
      return new Response(
        JSON.stringify({
          success: false,
          message: "RESEND_API_KEY not configured.",
          resendKeyConfigured: false,
        }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const body: EmailRequest = await req.json();
    const {
      to,
      subject = "Gate Gaborone Event Confirmation",
      name,
      email,
      message,
      eventName,
      registrationType,
      sendConfirmation,
      title,
      role,
      denomination,
      phone,
      location,
      eventDate = "2025-05-10",
      eventTime = "9:00 AM - 1:30 PM",
      eventImage = "https://lojchdvtwypjqupsjynf.supabase.co/storage/v1/object/public/images/leadership/POA_1743681812478.jpg",
      checkInId = uuidv4(),
      attendeeEmail = email,
      sendSms = true,
    } = body;

    console.log("Processing email request for event:", eventName);
    console.log("Will send confirmation email:", sendConfirmation);
    console.log("Phone number for notifications:", phone);

    const checkInUrl = `https://gategaborone.com/check-in/${checkInId}?email=${encodeURIComponent(attendeeEmail)}`;
    const locationQrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(location)}&size=300x300&margin=10&qzone=2&format=png`;
    const checkInQrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(checkInUrl)}&size=300x300&margin=10&qzone=2&format=png`;

    const whatsappMessage = `
📅 *Event Registration Confirmation*

Hello ${name}! Thank you for registering for *${eventName}*.

*Event Details:*
• Date: ${eventDate}
• Time: ${eventTime}
• Location: ${location}
• Check-in ID: ${checkInId}

We're looking forward to seeing you there! Save this message for quick check-in.

- Gate Gaborone Church
    `;
    
    const whatsappShareUrl = `https://wa.me/?text=${encodeURIComponent(whatsappMessage)}`;

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${eventName}
DTSTART:${eventDate.replace(/-/g, "")}T090000Z
DTEND:${eventDate.replace(/-/g, "")}T133000Z
LOCATION:${location}
DESCRIPTION:Registration for ${eventName} - ${registrationType}
URL:${checkInUrl}
END:VEVENT
END:VCALENDAR`;

    const icsBase64 = btoa(icsContent);
    const icsAttachment = {
      filename: "event-invite.ics",
      content: icsBase64,
      type: "text/calendar",
      disposition: "attachment",
    };

    let confirmationSuccess = false;
    let confirmationEmailId = null;
    let whatsappNotificationSent = false;
    let whatsappNotificationLink = "";
    let whatsappLinkRequiresAction = true;
    let smsNotificationSent = false;
    let smsNotificationDetails = null;

    if (sendConfirmation) {
      try {
        const emailResponse = await resend.emails.send({
          from: "Gate Gaborone <info@gategaborone.com>",
          to: [email],
          subject: `Registration Confirmation: ${eventName}`,
          html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
              <h2>Hello ${name},</h2>
              <p>You have successfully registered for <strong>${eventName}</strong>.</p>
              <p><strong>Date:</strong> ${eventDate}<br>
              <strong>Time:</strong> ${eventTime}<br>
              <strong>Location:</strong> ${location}</p>

              <img src="${eventImage}" alt="Event Banner" width="100%" style="margin-top: 20px;" />

              <h3>Check-In QR Code</h3>
              <img src="${checkInQrCodeUrl}" alt="Check-In QR" width="200" height="200" />

              <h3>Location QR Code</h3>
              <img src="${locationQrCodeUrl}" alt="Location QR" width="200" height="200" />

              <p><a href="${checkInUrl}">Click here to check in</a></p>
              <p><a href="${whatsappShareUrl}">Share via WhatsApp</a></p>

              <p>We look forward to seeing you!</p>
              <p>— Gate Gaborone Team</p>
            </div>
          `,
          attachments: [icsAttachment],
        });

        console.log("Confirmation email sent:", emailResponse.id);
        confirmationSuccess = true;
        confirmationEmailId = emailResponse.id;
        
        // Log successful confirmation email
        logEmailDelivery(email, 'confirmation', 'sent', {
          subject: `Registration Confirmation: ${eventName}`,
          eventName,
          messageId: emailResponse.id
        }, emailResponse.id);

        // Send WhatsApp notification if phone number is provided
        if (phone && phone.trim() !== '') {
          try {
            console.log("Attempting WhatsApp notification for:", phone);
            const whatsappResult = await sendWhatsAppNotification({
              phone,
              eventName,
              eventDate,
              eventTime,
              location,
              checkInId
            });
            
            whatsappNotificationSent = whatsappResult.success;
            whatsappNotificationLink = whatsappResult.directLink || "";
            whatsappLinkRequiresAction = whatsappResult.isLink;
            
            console.log("WhatsApp notification result:", whatsappResult);
            
            if (whatsappResult.success) {
              if (whatsappResult.isLink) {
                console.log("✅ WhatsApp notification link generated successfully (requires admin action)");
              } else {
                console.log("✅ WhatsApp notification sent directly via Business API");
              }
            } else {
              console.error("❌ WhatsApp notification failed:", whatsappResult.message);
            }
          } catch (whatsappError) {
            console.error("Error sending WhatsApp notification:", whatsappError);
          }
        }
        
        // Send SMS notification if phone number and SMS flag are provided
        if (phone && phone.trim() !== '' && sendSms) {
          try {
            console.log("Attempting to send SMS notification to:", phone);
            const smsResult = await sendSmsNotification({
              phone,
              eventName,
              eventDate,
              eventTime,
              location,
              checkInId
            });
            
            smsNotificationSent = smsResult.success;
            smsNotificationDetails = smsResult;
            
            console.log("SMS notification result:", smsResult);
            
            if (smsResult.success) {
              console.log("✅ SMS notification sent successfully");
            } else {
              console.error("❌ SMS notification failed:", smsResult.message);
            }
          } catch (smsError) {
            console.error("Error sending SMS notification:", smsError);
          }
        }
      } catch (confirmationError) {
        console.error("Error sending confirmation email:", confirmationError);
        const errorDetail = confirmationError instanceof Error ? confirmationError.message : 'Unknown error';
        console.error("Error details:", errorDetail);
        
        // Log failed confirmation email
        logEmailDelivery(email, 'confirmation', 'failed', {
          error: errorDetail,
          subject: `Registration Confirmation: ${eventName}`,
          eventName
        });
      }
    }

    // Generate a delivery report for debugging
    const deliveryReport = generateDeliveryReport();
    console.log("\n=== EMAIL DELIVERY REPORT ===\n", deliveryReport);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Email processed successfully",
        confirmationEmailSent: confirmationSuccess,
        confirmationEmailId: confirmationEmailId,
        whatsappNotificationSent,
        whatsappNotificationLink,
        whatsappLinkRequiresAction,
        smsNotificationSent,
        smsNotificationDetails,
        whatsappShareUrl,
        checkInUrl,
        checkInQrCodeUrl,
        locationQrCodeUrl,
        checkInId: checkInId,
        resendKeyConfigured: !!RESEND_API_KEY,
        deliveryReport: deliveryReport,
        notificationStatus: {
          email: confirmationSuccess ? "sent" : "failed",
          sms: smsNotificationSent ? "sent" : "failed",
          whatsapp: whatsappNotificationSent ? (whatsappLinkRequiresAction ? "link_generated" : "sent") : "failed"
        }
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Email processing failed:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || "Unknown error",
        resendKeyConfigured: !!RESEND_API_KEY,
        timestamp: new Date().toISOString()
      }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
}
