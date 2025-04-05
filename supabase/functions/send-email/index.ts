
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

    console.log("Received email request:", { to, subject, name, email, sendConfirmation, title, role, denomination, phone });

    let htmlContent = "";
    
    if (eventName) {
      // This is an event registration email
      htmlContent = `
        <h1>New Event Registration</h1>
        <p><strong>Event:</strong> ${eventName}</p>
        <p><strong>Registration Type:</strong> ${registrationType || 'Standard'}</p>
        <p><strong>Title:</strong> ${title || ''}</p>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
        <p><strong>Role:</strong> ${role || ''}</p>
        <p><strong>Denomination/Church:</strong> ${denomination || ''}</p>
        <p><strong>Message:</strong> ${message || 'No additional message provided'}</p>
      `;
    } else {
      // This is a contact form submission
      htmlContent = `
        <h1>New Contact Form Submission</h1>
        <p><strong>From:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong> ${message}</p>
      `;
    }

    // Send to admins with improved error handling
    try {
      const emailResponse = await resend.emails.send({
        from: "Gate Gaborone <info@gategaborone.com>",
        to: to,
        subject: subject,
        html: htmlContent,
      });

      console.log("Admin email sent successfully:", emailResponse);
    } catch (emailError) {
      console.error("Error sending admin email:", emailError);
      // Continue with the confirmation email even if admin email fails
    }
    
    // Send confirmation email to the registrant if requested
    if (sendConfirmation && email && eventName) {
      try {
        const registrantTitle = title || '';
        const confirmationHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 5px;">
            <h1 style="color: #3b82f6; margin-bottom: 20px;">Registration Confirmation</h1>
            <p>Dear ${registrantTitle} ${name},</p>
            <p>Thank you for registering for <strong>${eventName}</strong>.</p>
            <p><strong>Event Details:</strong></p>
            <ul>
              <li><strong>Event:</strong> ${eventName}</li>
              <li><strong>Registration Type:</strong> ${registrationType || 'Standard'}</li>
              <li><strong>Role:</strong> ${role || ''}</li>
              <li><strong>Denomination/Church:</strong> ${denomination || ''}</li>
              <li><strong>Phone:</strong> ${phone || 'Not provided'}</li>
              <li><strong>Number of Attendees:</strong> ${message.includes('numberOfAttendees') ? message.split('numberOfAttendees:')[1].trim() : '1'}</li>
            </ul>
            <p>We look forward to seeing you there!</p>
            <p>If you have any questions, please don't hesitate to contact us.</p>
            <p style="margin-top: 30px;">Best regards,<br/>Gate Gaborone Team</p>
          </div>
        `;

        const confirmationResponse = await resend.emails.send({
          from: "Gate Gaborone <info@gategaborone.com>",
          to: [email],
          subject: `Registration Confirmation: ${eventName}`,
          html: confirmationHtml,
        });

        console.log("Confirmation email sent successfully:", confirmationResponse);
      } catch (confirmError) {
        console.error("Error sending confirmation email:", confirmError);
      }
    }

    return new Response(JSON.stringify({ success: true, message: "Emails processed" }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
