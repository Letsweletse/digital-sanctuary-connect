import { Resend } from "npm:resend@2.0.0";
import { v4 as uuidv4 } from "https://deno.land/std@0.190.0/uuid/mod.ts";
import { corsHeaders } from "../utils/cors.ts";
import { 
  generateAdminEmailContent, 
  generateConfirmationEmailContent 
} from "../templates/emailTemplates.ts";
import { 
  formatDateForCalendar, 
  generateIcsContent 
} from "../utils/calendarUtils.ts";
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
    
    // Verify Resend configuration
    if (!RESEND_API_KEY) {
      console.error("ERROR: Missing RESEND_API_KEY - cannot proceed with email sending");
      return new Response(
        JSON.stringify({
          success: false,
          message: "RESEND_API_KEY not configured. Please set this environment variable in the Supabase Edge Functions settings.",
          resendKeyConfigured: false
        }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }
    
    const body: EmailRequest = await req.json();
    console.log("Received email request with keys:", Object.keys(body));
    console.log("Event info:", body.eventName, body.eventDate, body.eventTime);
    console.log("Contact details:", body.name, body.email, body.phone);

    const { 
      to, 
      subject, 
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
      sendSms = true // Enable SMS by default
    } = body;

    console.log("Processing email request for event:", eventName);
    console.log("Will send confirmation email:", sendConfirmation);
    console.log("Phone number for notifications:", phone);
    console.log("SMS notifications enabled:", sendSms);

    // Use more reliable QR code generation with higher resolution and clear borders
    const locationQrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(location)}&size=300x300&margin=10&qzone=2&format=png`;
    const checkInUrl = `https://gategaborone.com/check-in/${checkInId}?email=${encodeURIComponent(attendeeEmail)}`;
    const checkInQrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(checkInUrl)}&size=300x300&margin=10&qzone=2&format=png`;

    // Format dates for calendar
    const { startDateFormatted, endDateFormatted, nowFormatted } = formatDateForCalendar(eventDate, eventTime);
    
    // Create WhatsApp share URL with complete details
    const whatsappShareText = `Hey! I just registered for ${eventName} at Gate Gaborone. Join me on ${eventDate} at ${eventTime}! Register here: https://gategaborone.com/events?register=${encodeURIComponent(eventName)}`;
    const whatsappShareUrl = `https://wa.me/?text=${encodeURIComponent(whatsappShareText)}`;

    // Generate iCal content
    const icsContent = generateIcsContent({
      eventName,
      startDateFormatted,
      endDateFormatted,
      nowFormatted,
      location,
      message: message || "",
      checkInId
    });
    const encodedIcsContent = encodeURIComponent(icsContent);

    // Prepare and send admin email
    const adminHtmlContent = generateAdminEmailContent({
      eventName,
      registrationType,
      title,
      name,
      email,
      phone,
      role,
      denomination,
      message,
      checkInId
    });

    console.log("Sending admin email notification to:", to);
    let adminEmailSuccess = false;
    let adminEmailId = null;
    
    try {
      console.log("Attempting to send admin email via Resend...");
      const adminResult = await resend.emails.send({
        from: "Gate Gaborone <info@gategaborone.com>",
        to,
        subject,
        html: adminHtmlContent,
        text: `New registration for ${eventName} from ${name} (${email})`, // Plain text fallback
        headers: {
          "X-Entity-Ref-ID": `admin-${checkInId}`, // Unique reference ID for admin email
          "Content-Type": "text/html; charset=UTF-8"
        }
      });
      
      console.log("Admin email sent successfully:", adminResult);
      adminEmailSuccess = true;
      adminEmailId = adminResult.id;
      
      // Log successful admin email delivery
      to.forEach(recipient => {
        logEmailDelivery(recipient, 'admin', 'sent', {
          subject,
          eventName,
          from: email
        }, adminResult.id);
      });
    } catch (adminEmailError) {
      console.error("Error sending admin email:", adminEmailError);
      const errorDetail = adminEmailError instanceof Error ? adminEmailError.message : 'Unknown error';
      console.error("Error details:", errorDetail);
      
      // Log failed admin email delivery
      to.forEach(recipient => {
        logEmailDelivery(recipient, 'admin', 'failed', {
          error: errorDetail,
          subject,
          eventName
        });
      });
      
      // Check for common Resend API errors
      if (errorDetail.includes("API key")) {
        throw new Error(`Resend API key error: ${errorDetail} - Please check your RESEND_API_KEY configuration.`);
      }
      
      throw new Error(`Admin email failed: ${errorDetail}`);
    }

    let confirmationSuccess = false;
    let confirmationEmailId = null;
    let whatsappNotificationSent = false;
    let whatsappNotificationLink = "";
    let whatsappLinkRequiresAction = true; // New flag to indicate manual action needed
    let smsNotificationSent = false;
    let smsNotificationDetails = null;

    // Send confirmation email if requested
    if (sendConfirmation) {
      console.log("Generating confirmation email for:", email);
      
      const confirmationHtml = generateConfirmationEmailContent({
        title,
        name,
        eventName,
        eventDate,
        eventTime,
        eventImage,
        registrationType,
        role,
        denomination,
        phone,
        location,
        checkInId,
        locationQrCodeUrl,
        checkInQrCodeUrl,
        encodedIcsContent,
        whatsappShareUrl
      });

      console.log("Sending confirmation email to:", email);
      
      try {
        // Send confirmation email with explicit content type and debugging
        const emailResponse = await resend.emails.send({
          from: "Gate Gaborone <info@gategaborone.com>",
          to: [email],
          subject: `Registration Confirmation: ${eventName}`,
          html: confirmationHtml,
          text: `Thank you for registering for ${eventName}!\n\nEvent Details:\nDate: ${eventDate}\nTime: ${eventTime}\nLocation: ${location}\nCheck-in ID: ${checkInId}\n\nVisit https://gategaborone.com for more information.`,
          headers: {
            "Content-Type": "text/html; charset=UTF-8",
            "X-Entity-Ref-ID": checkInId, // Add unique reference ID to prevent email threading
            "X-Mailer": "ResendWithGateGaborone"
          }
        });

        console.log("Confirmation email sent:", emailResponse);
        confirmationSuccess = true;
        confirmationEmailId = emailResponse.id;
        
        // Log successful confirmation email
        logEmailDelivery(email, 'confirmation', 'sent', {
          subject: `Registration Confirmation: ${eventName}`,
          eventName,
          messageId: emailResponse.id
        }, emailResponse.id);
        
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
              
              // Fallback to WhatsApp if SMS fails
              if (phone && phone.trim() !== '') {
                try {
                  console.log("SMS failed, attempting WhatsApp notification link for:", phone);
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
                  whatsappLinkRequiresAction = whatsappResult.isLink; // This will be true
                
                  console.log("WhatsApp notification result:", whatsappResult);
                  
                  if (whatsappResult.success) {
                    console.log("✅ WhatsApp notification link generated successfully (requires admin action)");
                  } else {
                    console.error("❌ WhatsApp notification failed:", whatsappResult.message);
                  }
                } catch (whatsappError) {
                  console.error("Error sending WhatsApp notification:", whatsappError);
                }
              }
            }
          } catch (smsError) {
            console.error("Error sending SMS notification:", smsError);
            
            // Also try WhatsApp as a fallback
            if (phone && phone.trim() !== '') {
              try {
                console.log("SMS errored, attempting WhatsApp notification link for:", phone);
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
                whatsappLinkRequiresAction = whatsappResult.isLink; // This will be true
                
                console.log("WhatsApp notification result:", whatsappResult);
                
                if (whatsappResult.success) {
                  console.log("✅ WhatsApp notification link generated successfully (requires admin action)");
                } else {
                  console.error("❌ WhatsApp notification failed:", whatsappResult.message);
                }
              } catch (whatsappError) {
                console.error("Error sending WhatsApp notification:", whatsappError);
              }
            }
          }
        } else {
          // Also try WhatsApp as a primary option if SMS is not configured
          if (phone && phone.trim() !== '') {
            try {
              console.log("SMS not configured, attempting WhatsApp notification link for:", phone);
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
              whatsappLinkRequiresAction = whatsappResult.isLink; // This will be true
                
              console.log("WhatsApp notification result:", whatsappResult);
              
              if (whatsappResult.success) {
                console.log("✅ WhatsApp notification link generated successfully (requires admin action)");
              } else {
                console.error("❌ WhatsApp notification failed:", whatsappResult.message);
              }
            } catch (whatsappError) {
              console.error("Error sending WhatsApp notification:", whatsappError);
            }
          } else {
            console.log("No phone number provided for notifications");
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
        
        // Check for common Resend API errors
        if (errorDetail.includes("API key")) {
          throw new Error(`Resend API key error: ${errorDetail} - Please check your RESEND_API_KEY configuration.`);
        }
        
        throw new Error(`Confirmation email failed: ${errorDetail}`);
      }
    }

    // Generate a delivery report for debugging
    const deliveryReport = generateDeliveryReport();
    console.log("\n=== EMAIL DELIVERY REPORT ===\n", deliveryReport);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Emails processed",
        adminEmailSent: adminEmailSuccess,
        adminEmailId: adminEmailId,
        confirmationEmailSent: confirmationSuccess,
        confirmationEmailId: confirmationEmailId,
        whatsappNotificationSent,
        whatsappNotificationLink,
        whatsappLinkRequiresAction, // Include this new flag in the response
        smsNotificationSent,
        smsNotificationDetails,
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
    console.error("Error processing email request:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: `Email processing failed: ${error.message || "Unknown error"}`,
        error: error.message || "Unknown error",
        resendKeyConfigured: !!RESEND_API_KEY,
        timestamp: new Date().toISOString()
      }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
}

export async function getEmailDeliveryLogs(req: Request): Promise<Response> {
  try {
    // Import the log functions
    const { getDeliveryLogs, generateDeliveryReport } = await import("../utils/emailLogging.ts");
    
    // Generate the report
    const logs = getDeliveryLogs();
    const report = generateDeliveryReport();
    
    return new Response(
      JSON.stringify({
        success: true,
        logs,
        report
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        success: false,
        message: `Failed to retrieve email logs: ${error.message || "Unknown error"}`,
        error: error.message || "Unknown error"
      }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
}
