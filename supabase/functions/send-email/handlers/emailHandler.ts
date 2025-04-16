
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

// Use the new API key provided by the user
const resend = new Resend("re_Ma9SdYa9_B4rHHamBxbzyfNEeHbjcnvdA");

export async function processEmailRequest(req: Request): Promise<Response> {
  try {
    console.log("Processing email request...");
    const body: EmailRequest = await req.json();
    console.log("Request body received:", JSON.stringify(body));

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

    // Base URL for the Gate Gaborone website - ensure using www.gategaborone.com
    const baseUrl = "https://www.gategaborone.com";
    
    // Create safer check-in URL structure (no query parameters to ensure QR code readability)
    const checkInUrl = `${baseUrl}/check-in/${checkInId}`;
    
    // Use direct Google Maps URL that works reliably - not the dynamic maps.app.goo.gl shortlink
    const googleMapsUrl = "https://www.google.com/maps/place/Gate+Gaborone/@-24.6618567,25.9048083,15z/data=!4m6!3m5!1s0x1ebb5b26225a6213:0xaed9e468c1e4ef31!8m2!3d-24.6618567!4d25.9048083!16s%2Fg%2F11q89m2yrq";
    
    // Generate higher resolution QR codes (300x300 pixels) with clearer borders for better visibility
    const locationQrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(googleMapsUrl)}&size=300x300&margin=10&qzone=2`;
    const checkInQrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(checkInUrl)}&size=300x300&margin=10&qzone=2`;

    // Format dates for calendar
    const { startDateFormatted, endDateFormatted, nowFormatted } = formatDateForCalendar(eventDate, eventTime);
    
    // Create WhatsApp share URL with richer details
    const whatsappShareText = `Hey! I just registered for ${eventName} at Gate Gaborone. You should come too! 🙌 Date: ${eventDate}, Time: ${eventTime}. Here's the link: ${baseUrl}/events?register=${encodeURIComponent(eventName)}`;
    const whatsappShareUrl = `https://wa.me/?text=${encodeURIComponent(whatsappShareText)}`;

    // Generate iCal content
    const icsContent = generateIcsContent({
      eventName,
      startDateFormatted,
      endDateFormatted,
      nowFormatted,
      location: googleMapsUrl, // Use the full Google Maps URL here
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
    const adminEmailResponse = await resend.emails.send({
      from: "Gate Gaborone <info@gategaborone.com>",
      to,
      subject,
      html: adminHtmlContent,
    });
    
    console.log("Admin email response:", adminEmailResponse);
    
    let confirmationSuccess = false;

    // Send confirmation email if requested
    if (sendConfirmation) {
      console.log("Sending confirmation email to:", email);
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
        location: googleMapsUrl, // Use the full Google Maps URL here
        checkInId,
        locationQrCodeUrl,
        checkInQrCodeUrl,
        encodedIcsContent,
        whatsappShareUrl
      });

      const emailResponse = await resend.emails.send({
        from: "Gate Gaborone <info@gategaborone.com>",
        to: [email],
        subject: `Registration Confirmation: ${eventName}`,
        html: confirmationHtml,
      });

      console.log("Confirmation email response:", emailResponse);
      confirmationSuccess = true;
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Emails processed",
        adminEmailSent: true,
        confirmationEmailSent: confirmationSuccess,
        checkInId: checkInId,
        checkInUrl: checkInUrl
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error processing email request:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        stack: error.stack
      }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
}
