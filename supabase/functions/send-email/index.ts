// netlify/functions/send-email.ts

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
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body: EmailRequest = await req.json();

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
    } = body;

    let adminHtmlContent = "";

    if (eventName) {
      adminHtmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 2px; background: linear-gradient(135deg, #3b82f6, #06b6d4); border-radius: 12px; box-shadow: 0 0 12px #3b82f6;">
          <div style="background-color: #ffffff; color: #0f172a; border-radius: 10px; padding: 24px;">
            <div style="text-align: center; margin-bottom: 20px;">
              <img src="https://lojchdvtwypjqupsjynf.supabase.co/storage/v1/object/public/images/general/gate-logo.png" alt="Gate Gaborone" style="max-width: 140px;" />
            </div>
            <h2 style="color: #1e3a8a; margin-top: 0;">New Event Registration</h2>
            <table style="width: 100%; border-collapse: collapse; word-wrap: break-word;">
              <tr><td style="padding: 6px 0;"><strong>Event:</strong></td><td>${eventName}</td></tr>
              <tr><td style="padding: 6px 0;"><strong>Registration Type:</strong></td><td>${registrationType || "Standard"}</td></tr>
              <tr><td style="padding: 6px 0;"><strong>Title:</strong></td><td>${title || ""}</td></tr>
              <tr><td style="padding: 6px 0;"><strong>Name:</strong></td><td>${name}</td></tr>
              <tr><td style="padding: 6px 0;"><strong>Email:</strong></td><td>${email}</td></tr>
              <tr><td style="padding: 6px 0;"><strong>Phone:</strong></td><td>${phone || "Not provided"}</td></tr>
              <tr><td style="padding: 6px 0;"><strong>Role:</strong></td><td>${role || ""}</td></tr>
              <tr><td style="padding: 6px 0;"><strong>Denomination:</strong></td><td>${denomination || ""}</td></tr>
              <tr><td style="padding: 6px 0;"><strong>Message:</strong></td><td>${message || "No additional info"}</td></tr>
              <tr><td style="padding: 6px 0;"><strong>Location:</strong></td><td><a href="https://maps.app.goo.gl/L8oNgD2tyEnfKQnc8" style="color:#3b82f6;">View on Map</a></td></tr>
            </table>
            <p style="font-size: 12px; color: #666; margin-top: 20px;">Automated message from Gate Gaborone website.</p>
          </div>
        </div>
      `;
    }

    await resend.emails.send({
      from: "Gate Gaborone <info@gategaborone.com>",
      to,
      subject,
      html: adminHtmlContent,
    });

    let confirmationSuccess = false;

    if (sendConfirmation && email && eventName) {
      const numAttendees =
        message?.includes("numberOfAttendees") ?
          message.split("numberOfAttendees:")[1].trim() :
          "1";

      const confirmationHtml = `
        <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: auto; padding: 2px; background: linear-gradient(135deg, #3b82f6, #06b6d4); border-radius: 14px; box-shadow: 0 0 12px #3b82f6;">
          <div style="background-color: #0f172a; color: #e2e8f0; border-radius: 12px; padding: 30px;">
            <div style="text-align: center; margin-bottom: 24px;">
              <a href="https://gategaborone.com" target="_blank" style="text-decoration: none;">
                <img src="https://lojchdvtwypjqupsjynf.supabase.co/storage/v1/object/public/images/general/gate-logo.png" alt="Gate Gaborone" style="max-width: 140px; border-radius: 8px;" />
              </a>
            </div>
            <div style="padding: 20px; background: #1e293b; border-radius: 10px;">
              <h2 style="color: #60a5fa; margin-top: 0;">Registration Confirmation</h2>
              <p style="margin-bottom: 10px;">Dear ${title || ""} ${name},</p>
              <p style="margin-bottom: 16px;">Thank you for registering for <strong>${eventName}</strong>. Here are your registration details:</p>
              <table style="width: 100%; border-collapse: collapse; word-wrap: break-word;">
                <tr><td style="padding: 6px 0;"><strong>Event:</strong></td><td>${eventName}</td></tr>
                <tr><td style="padding: 6px 0;"><strong>Type:</strong></td><td>${registrationType || "Standard"}</td></tr>
                <tr><td style="padding: 6px 0;"><strong>Role:</strong></td><td>${role || "Not provided"}</td></tr>
                <tr><td style="padding: 6px 0;"><strong>Denomination:</strong></td><td>${denomination || "Not provided"}</td></tr>
                <tr><td style="padding: 6px 0;"><strong>Phone:</strong></td><td>${phone || "Not provided"}</td></tr>
                <tr><td style="padding: 6px 0;"><strong>Number of Attendees:</strong></td><td>${numAttendees}</td></tr>
                <tr><td style="padding: 6px 0;"><strong>Location:</strong></td><td><a href="https://maps.app.goo.gl/L8oNgD2tyEnfKQnc8" style="color:#3b82f6;">View on Map</a></td></tr>
              </table>
              <p style="margin-top: 20px;">If you have any questions, contact us at <a href="mailto:info@gategaborone.com" style="color:#60a5fa;">info@gategaborone.com</a>.</p>
            </div>
            <div style="text-align: center; font-size: 12px; color: #94a3b8; margin-top: 30px;">
              © ${new Date().getFullYear()} Gate Gaborone. All rights reserved.
            </div>
          </div>
        </div>
      `;

      await resend.emails.send({
        from: "Gate Gaborone <info@gategaborone.com>",
        to: [email],
        subject: `Registration Confirmation: ${eventName}`,
        html: confirmationHtml,
      });

      confirmationSuccess = true;
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Emails processed",
        adminEmailSent: true,
        confirmationEmailSent: confirmationSuccess,
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);


