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

// Use the updated API key from Supabase secrets
const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

export async function processEmailRequest(req: Request): Promise<Response> {
  try {
    console.log("🚀 [Email Handler] Processing email request...");
    const body: EmailRequest = await req.json();
    console.log("📧 [Email Handler] Request body received:", JSON.stringify(body, null, 2));

    // Validate API key exists
    const apiKey = Deno.env.get("RESEND_API_KEY");
    if (!apiKey) {
      console.error("❌ [Email Handler] RESEND_API_KEY not found in environment");
      throw new Error("Email service not configured - missing API key");
    }
    console.log("✅ [Email Handler] API key found:", apiKey.substring(0, 10) + "...");

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
      eventDate = "Saturday, 7 February 2026",
      eventTime = "09:00 - 13:30",
      eventImage = "/lovable-uploads/poa-february-2026.jpg",
      checkInId = uuidv4(),
      attendeeEmail = email
    } = body;

    console.log(`📝 [Email Handler] Processing registration for: ${eventName}`);
    console.log(`👤 [Email Handler] Attendee: ${name} (${email})`);

    // Base URL for the Gate Gaborone website
    const baseUrl = "https://www.gategaborone.com";
    
    // Create check-in URL
    const checkInUrl = `${baseUrl}/check-in/${checkInId}`;
    console.log(`🔗 [Email Handler] Check-in URL generated: ${checkInUrl}`);
    
    // Updated Google Maps URL for the conference location
    const googleMapsUrl = "https://maps.app.goo.gl/tKHAW2wV6sZ2yLy96";
    
    // Generate QR codes
    const locationQrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(googleMapsUrl)}&size=300x300&margin=10&qzone=2`;
    const checkInQrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(checkInUrl)}&size=300x300&margin=10&qzone=2`;

    // Format dates for calendar
    const { startDateFormatted, endDateFormatted, nowFormatted } = formatDateForCalendar(eventDate, eventTime);
    
    // Create WhatsApp share URL
    const whatsappShareText = `Hey! I just registered for ${eventName} at Gate Gaborone. You should come too! 🙌 Date: ${eventDate}, Time: ${eventTime}. Here's the link: ${baseUrl}/events?register=${encodeURIComponent(eventName)}`;
    const whatsappShareUrl = `https://wa.me/?text=${encodeURIComponent(whatsappShareText)}`;

    // Generate iCal content
    const icsContent = generateIcsContent({
      eventName,
      startDateFormatted,
      endDateFormatted,
      nowFormatted,
      location: googleMapsUrl,
      message: message || "",
      checkInId
    });
    const encodedIcsContent = encodeURIComponent(icsContent);

    // Prepare admin email
    console.log("📤 [Email Handler] Preparing admin email...");
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

    console.log("📨 [Email Handler] Sending admin email to:", to);
    try {
      const adminEmailResponse = await resend.emails.send({
        from: "Gate Gaborone <info@gategaborone.com>",
        to,
        subject,
        html: adminHtmlContent,
      });
      
      console.log("✅ [Email Handler] Admin email sent successfully:", adminEmailResponse);
    } catch (adminError) {
      console.error("❌ [Email Handler] Failed to send admin email:", adminError);
      throw new Error(`Admin email failed: ${adminError.message}`);
    }
    
    let confirmationSuccess = false;

    // Send confirmation email if requested
    if (sendConfirmation) {
      console.log("📤 [Email Handler] Preparing confirmation email...");
      console.log("📧 [Email Handler] Sending confirmation email to:", email);
      
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
        location: googleMapsUrl,
        checkInId,
        locationQrCodeUrl,
        checkInQrCodeUrl,
        encodedIcsContent,
        whatsappShareUrl
      });

      try {
        const emailResponse = await resend.emails.send({
          from: "Gate Gaborone <info@gategaborone.com>",
          to: [email],
          subject: `Registration Confirmation: ${eventName}`,
          html: confirmationHtml,
        });

        console.log("✅ [Email Handler] Confirmation email sent successfully:", emailResponse);
        confirmationSuccess = true;
      } catch (confirmationError) {
        console.error("❌ [Email Handler] Failed to send confirmation email:", confirmationError);
        // Don't throw here - admin email was successful
        console.log("⚠️ [Email Handler] Continuing despite confirmation email failure");
      }
    }

    console.log("🎉 [Email Handler] Email processing completed successfully");
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
    console.error("💥 [Email Handler] Critical error processing email request:", error);
    console.error("📊 [Email Handler] Error stack:", error.stack);
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
