
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

// Mailgun configuration
const MAILGUN_DOMAIN = "gategaborone.com";
const MAILGUN_API_KEY = "33d7b3113afd786a314ddd95dc279853-2b77fbb2-21075f6d";
const MAILGUN_API_URL = `https://api.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`;
const MAILGUN_WEBHOOK_SIGNING_KEY = "9506e4f976d6441f0876fc591eb37e12";

// Function to send email using Mailgun API
async function sendMailgunEmail(from: string, to: string[], subject: string, html: string) {
  console.log(`Sending email via Mailgun to: ${to.join(", ")}`);
  
  const formData = new FormData();
  formData.append("from", from);
  to.forEach(recipient => formData.append("to", recipient));
  formData.append("subject", subject);
  formData.append("html", html);
  formData.append("tracking", "yes");
  formData.append("tracking-clicks", "yes");
  formData.append("tracking-opens", "yes");
  formData.append("o:tag", "event-registration");
  
  const authHeader = `Basic ${btoa(`api:${MAILGUN_API_KEY}`)}`;
  
  try {
    const response = await fetch(MAILGUN_API_URL, {
      method: "POST",
      headers: {
        "Authorization": authHeader,
      },
      body: formData,
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Mailgun API error ${response.status}: ${errorText}`);
      throw new Error(`Mailgun API error (${response.status}): ${errorText}`);
    }
    
    const result = await response.json();
    console.log("Mailgun API response:", result);
    return result;
  } catch (error) {
    console.error("Error sending email with Mailgun:", error);
    throw error;
  }
}

export async function processEmailRequest(req: Request): Promise<Response> {
  try {
    // Log the full request for debugging
    console.log("Processing email request with method:", req.method);
    console.log("Request headers:", JSON.stringify(Object.fromEntries(req.headers.entries())));
    
    const body: EmailRequest = await req.json();
    console.log("Received email request body:", JSON.stringify(body, null, 2));

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

    // Validate required fields
    if (!to || !subject || !name || !email) {
      console.error("Missing required fields in email request");
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Missing required fields in email request",
          received: { to, subject, name, email }
        }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Generate higher resolution QR codes (300x300 pixels) with clearer borders for better visibility
    const locationQrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(location)}&size=300x300&margin=10&qzone=2`;
    const checkInUrl = `https://gategaborone.com/check-in/${checkInId}?email=${encodeURIComponent(attendeeEmail)}`;
    const checkInQrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(checkInUrl)}&size=300x300&margin=10&qzone=2`;

    // Format dates for calendar
    const { startDateFormatted, endDateFormatted, nowFormatted } = formatDateForCalendar(eventDate, eventTime);
    
    // Create WhatsApp share URL with richer details
    const whatsappShareText = `Hey! I just registered for ${eventName} at Gate Gaborone. You should come too! 🙌 Date: ${eventDate}, Time: ${eventTime}. Here's the link: https://gategaborone.com/events?register=${encodeURIComponent(eventName)}`;
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

    console.log("Sending admin email to:", to);
    console.log("With subject:", subject);
    
    // Convert 'to' to array if it's not already
    const toArray = Array.isArray(to) ? to : [to];
    console.log("Prepared recipient array:", toArray);
    
    // Send admin email using Mailgun
    let adminEmailResult;
    try {
      adminEmailResult = await sendMailgunEmail(
        "Gate Gaborone <info@gategaborone.com>",
        toArray,
        subject,
        adminHtmlContent
      );
      console.log("Admin email result:", adminEmailResult);
    } catch (error) {
      console.error("Failed to send admin email:", error);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `Admin email failed: ${error instanceof Error ? error.message : String(error)}`,
          provider: "Mailgun"
        }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    let confirmationSuccess = false;

    // Send confirmation email if requested
    if (sendConfirmation) {
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
        // Send confirmation email using Mailgun
        const emailResponse = await sendMailgunEmail(
          "Gate Gaborone <info@gategaborone.com>",
          [email],
          `Registration Confirmation: ${eventName}`,
          confirmationHtml
        );

        console.log("Confirmation email sent:", emailResponse);
        confirmationSuccess = true;
      } catch (error) {
        console.error("Failed to send confirmation email:", error);
        // Don't fail the whole operation if just the confirmation email fails
        // Still return success for the admin email
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Emails processed using Mailgun",
        adminEmailSent: true,
        confirmationEmailSent: confirmationSuccess,
        checkInId: checkInId,
        emailProvider: "Mailgun"
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error processing email request:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : "No stack trace available";
    
    console.error("Error details:", errorMessage);
    console.error("Stack trace:", errorStack);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: errorMessage,
        stack: errorStack,
        provider: "Mailgun",
        timestamp: new Date().toISOString()
      }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
}
