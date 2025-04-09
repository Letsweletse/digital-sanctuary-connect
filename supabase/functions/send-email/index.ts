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
        <div style="font-family: Arial; max-width: 600px; padding: 20px; border: 1px solid #eaeaea; border-radius: 5px;">
          <h1 style="color: #3b82f6;">New Event Registration</h1>
          <table style="width: 100%;">
            <tr><td><strong>Event:</strong></td><td>${eventName}</td></tr>
            <tr><td><strong>Registration Type:</strong></td><td>${registrationType || "Standard"}</td></tr>
            <tr><td><strong>Title:</strong></td><td>${title || ""}</td></tr>
            <tr><td><strong>Name:</strong></td><td>${name}</td></tr>
            <tr><td><strong>Email:</strong></td><td>${email}</td></tr>
            <tr><td><strong>Phone:</strong></td><td>${phone || "Not provided"}</td></tr>
            <tr><td><strong>Role:</strong></td><td>${role || ""}</td></tr>
            <tr><td><strong>Denomination:</strong></td><td>${denomination || ""}</td></tr>
            <tr><td><strong>Message:</strong></td><td>${message || "No additional info"}</td></tr>
            <tr><td><strong>Location:</strong></td><td><a href="https://maps.app.goo.gl/L8oNgD2tyEnfKQnc8" style="color:#3b82f6;">View on Map</a></td></tr>
          </table>
          <p style="font-size: 12px; color: #666;">Automated message from Gate Gaborone website.</p>
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
        <div style="font-family: Arial; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 5px; background-color: #f8fafc;">
          <div style="text-align: center;">
            <img src="https://lojchdvtwypjqupsjynf.supabase.co/storage/v1/object/public/images/general/gate-logo.png" alt="Gate Gaborone" style="max-width: 150px;" />
          </div>
          <div style="padding: 20px; background: white; border-radius: 5px;">
            <h2 style="color: #3b82f6;">Registration Confirmation</h2>
            <p>Dear ${title || ""} ${name},</p>
            <p>Thank you for registering for <strong>${eventName}</strong>.</p>
            <ul style="padding-left: 20px;">
              <li><strong>Event:</strong> ${eventName}</li>
              <li><strong>Type:</strong> ${registrationType || "Standard"}</li>
              <li><strong>Role:</strong> ${role || ""}</li>
              <li><strong>Denomination:</strong> ${denomination || ""}</li>
              <li><strong>Phone:</strong> ${phone || "Not provided"}</li>
              <li><strong>Number of Attendees:</strong> ${numAttendees}</li>
              <li><strong>Location:</strong> <a href="https://maps.app.goo.gl/L8oNgD2tyEnfKQnc8" style="color:#3b82f6;">View on Map</a></li>
            </ul>
            <p>If you have questions, contact <a href="mailto:info@gategaborone.com" style="color:#3b82f6;">info@gategaborone.com</a>.</p>
            <p style="font-size: 12px; color: #888;">Do not reply to this automated message.</p>
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
