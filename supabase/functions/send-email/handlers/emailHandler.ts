
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

// Initialize Resend with API key from environment variable
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
if (!RESEND_API_KEY) {
  console.error("CRITICAL ERROR: RESEND_API_KEY environment variable is not set!");
}
const resend = new Resend(RESEND_API_KEY);

export async function processEmailRequest(req: Request): Promise<Response> {
  try {
    console.log("Starting email processing");
    const body: EmailRequest = await req.json();
    console.log("Received email request body:", JSON.stringify(body).substring(0, 200) + "...");

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
      attendeeEmail = email
    } = body;

    console.log("Processing email request for event:", eventName);
    console.log("Will send confirmation email:", sendConfirmation);

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
    
    try {
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
    } catch (adminEmailError) {
      console.error("Error sending admin email:", adminEmailError);
      throw new Error(`Admin email failed: ${adminEmailError instanceof Error ? adminEmailError.message : 'Unknown error'}`);
    }

    let confirmationSuccess = false;

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
      console.log("Confirmation HTML Content first 100 chars:", confirmationHtml.substring(0, 100));
      
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
      } catch (confirmationError) {
        console.error("Error sending confirmation email:", confirmationError);
        throw new Error(`Confirmation email failed: ${confirmationError instanceof Error ? confirmationError.message : 'Unknown error'}`);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Emails processed",
        adminEmailSent: true,
        confirmationEmailSent: confirmationSuccess,
        checkInId: checkInId,
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
      }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
}
