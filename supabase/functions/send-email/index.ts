
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  to: string[];
  subject: string;
  name: string;
  email: string;
  message: string;
  eventName?: string;
  registrationType?: string;
  sendConfirmation?: boolean;
  title?: string;
  role?: string;
  denomination?: string;
  phone?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, subject, name, email, message, eventName, registrationType, sendConfirmation, title, role, denomination, phone }: EmailRequest = await req.json();

    console.log("Received email request:", { to, subject, name, email, sendConfirmation, eventName });

    // Admin notification email
    let adminHtmlContent = "";
    
    if (eventName) {
      // This is an event registration email
      adminHtmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 5px;">
          <h1 style="color: #3b82f6; margin-bottom: 20px; border-bottom: 1px solid #eaeaea; padding-bottom: 10px;">New Event Registration</h1>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #eaeaea; font-weight: bold;">Event:</td>
              <td style="padding: 8px; border-bottom: 1px solid #eaeaea;">${eventName}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #eaeaea; font-weight: bold;">Registration Type:</td>
              <td style="padding: 8px; border-bottom: 1px solid #eaeaea;">${registrationType || 'Standard'}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #eaeaea; font-weight: bold;">Title:</td>
              <td style="padding: 8px; border-bottom: 1px solid #eaeaea;">${title || ''}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #eaeaea; font-weight: bold;">Name:</td>
              <td style="padding: 8px; border-bottom: 1px solid #eaeaea;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #eaeaea; font-weight: bold;">Email:</td>
              <td style="padding: 8px; border-bottom: 1px solid #eaeaea;">${email}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #eaeaea; font-weight: bold;">Phone:</td>
              <td style="padding: 8px; border-bottom: 1px solid #eaeaea;">${phone || 'Not provided'}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #eaeaea; font-weight: bold;">Role:</td>
              <td style="padding: 8px; border-bottom: 1px solid #eaeaea;">${role || ''}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #eaeaea; font-weight: bold;">Denomination/Church:</td>
              <td style="padding: 8px; border-bottom: 1px solid #eaeaea;">${denomination || ''}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #eaeaea; font-weight: bold;">Additional Info:</td>
              <td style="padding: 8px; border-bottom: 1px solid #eaeaea;">${message || 'No additional message provided'}</td>
            </tr>
          </table>
          <p style="margin-top: 20px; font-size: 12px; color: #666;">This is an automated message from Gate Gaborone website.</p>
        </div>
      `;
    } else {
      // This is a contact form submission
      adminHtmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 5px;">
          <h1 style="color: #3b82f6; margin-bottom: 20px; border-bottom: 1px solid #eaeaea; padding-bottom: 10px;">New Contact Form Submission</h1>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #eaeaea; font-weight: bold;">From:</td>
              <td style="padding: 8px; border-bottom: 1px solid #eaeaea;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #eaeaea; font-weight: bold;">Email:</td>
              <td style="padding: 8px; border-bottom: 1px solid #eaeaea;">${email}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #eaeaea; font-weight: bold;">Message:</td>
              <td style="padding: 8px; border-bottom: 1px solid #eaeaea;">${message}</td>
            </tr>
          </table>
          <p style="margin-top: 20px; font-size: 12px; color: #666;">This is an automated message from Gate Gaborone website.</p>
        </div>
      `;
    }

    // Send to admins with improved error handling
    try {
      const emailResponse = await resend.emails.send({
        from: "Gate Gaborone <info@gategaborone.com>",
        to: to,
        subject: subject,
        html: adminHtmlContent,
      });

      console.log("Admin email sent successfully:", emailResponse);
    } catch (emailError) {
      console.error("Error sending admin email:", emailError);
      // Continue with the confirmation email even if admin email fails
    }
    
    // Send confirmation email to the registrant if requested
    let confirmationSuccess = false;
    if (sendConfirmation && email && eventName) {
      try {
        const registrantTitle = title || '';
        const numAttendees = message.includes('numberOfAttendees') ? 
          message.split('numberOfAttendees:')[1].trim() : '1';
        
        const confirmationHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 5px; background-color: #f8fafc;">
            <div style="text-align: center; margin-bottom: 20px;">
              <img src="https://lojchdvtwypjqupsjynf.supabase.co/storage/v1/object/public/images/general/gate-logo.png" alt="Gate Gaborone Logo" style="max-width: 150px;" />
            </div>
            <div style="background-color: white; padding: 20px; border-radius: 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
              <h1 style="color: #3b82f6; margin-bottom: 20px; text-align: center;">Registration Confirmation</h1>
              <p style="margin-bottom: 15px;">Dear ${registrantTitle} ${name},</p>
              <p style="margin-bottom: 15px;">Thank you for registering for <strong>${eventName}</strong>.</p>
              
              <div style="background-color: #f0f9ff; padding: 15px; border-radius: 5px; margin-bottom: 20px; border-left: 4px solid #3b82f6;">
                <h2 style="color: #0f172a; font-size: 18px; margin-top: 0;">Event Details</h2>
                <ul style="padding-left: 20px; margin-bottom: 0;">
  <li style="margin-bottom: 5px;"><strong>Event:</strong> ${eventName}</li>
  <li style="margin-bottom: 5px;"><strong>Registration Type:</strong> ${registrationType || 'Standard'}</li>
  <li style="margin-bottom: 5px;"><strong>Role:</strong> ${role || ''}</li>
  <li style="margin-bottom: 5px;"><strong>Denomination/Church:</strong> ${denomination || ''}</li>
  <li style="margin-bottom: 5px;"><strong>Phone:</strong> ${phone || 'Not provided'}</li>
  <li style="margin-bottom: 5px;">
    <strong>Location:</strong> 
    <a href="https://maps.app.goo.gl/L8oNgD2tyEnfKQnc8" style="color: #3b82f6;" target="_blank">
      View on Google Maps
    </a>
  </li>
  <li style="margin-bottom: 5px;"><strong>Number of Attendees:</strong> ${numAttendees}</li>
</ul>

              
              <p style="margin-bottom: 15px;">We look forward to seeing you there!</p>
              <p style="margin-bottom: 15px;">If you have any questions, please don't hesitate to contact us at <a href="mailto:info@gategaborone.com" style="color: #3b82f6;">info@gategaborone.com</a>.</p>
              
              <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #eaeaea;">
                <p style="margin-bottom: 0;">Best regards,<br/><strong>Gate Gaborone Team</strong></p>
              </div>
            </div>
            <p style="text-align: center; margin-top: 20px; font-size: 12px; color: #64748b;">
              This is an automated message, please do not reply to this email.
            </p>
          </div>
        `;

        const confirmationResponse = await resend.emails.send({
          from: "Gate Gaborone <info@gategaborone.com>",
          to: [email],
          subject: `Registration Confirmation: ${eventName}`,
          html: confirmationHtml,
        });

        console.log("Confirmation email sent successfully:", confirmationResponse);
        confirmationSuccess = true;
      } catch (confirmError) {
        console.error("Error sending confirmation email:", confirmError);
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Emails processed",
        adminEmailSent: true,
        confirmationEmailSent: confirmationSuccess 
      }), 
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in send-email function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
