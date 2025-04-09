import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { v4 as uuidv4 } from "https://deno.land/std@0.190.0/uuid/mod.ts";

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
  eventName: string;
  registrationType: string;
  sendConfirmation: boolean;
  title: string;
  role: string;
  denomination: string;
  phone: string;
  location: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body: EmailRequest = await req.json();

    const { to, subject, name, email, message, eventName, registrationType, sendConfirmation, title, role, denomination, phone, location } = body;

    // Prepare HTML content for the admin email
    let adminHtmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
        <h1 style="color: #3b82f6;">New Event Registration</h1>
        <table style="width: 100%;">
          <tr><td><strong>Event:</strong></td><td>${eventName}</td></tr>
          <tr><td><strong>Registration Type:</strong></td><td>${registrationType}</td></tr>
          <tr><td><strong>Title:</strong></td><td>${title}</td></tr>
          <tr><td><strong>Name:</strong></td><td>${name}</td></tr>
          <tr><td><strong>Email:</strong></td><td>${email}</td></tr>
          <tr><td><strong>Phone:</strong></td><td>${phone}</td></tr>
          <tr><td><strong>Role:</strong></td><td>${role}</td></tr>
          <tr><td><strong>Denomination:</strong></td><td>${denomination}</td></tr>
          <tr><td><strong>Message:</strong></td><td>${message}</td></tr>
          <tr><td><strong>Location:</strong></td><td><a href="${location}" style="color: #3b82f6;">View on Map</a></td></tr>
        </table>
      </div>
    `;

    // Send the admin email
    await resend.emails.send({
      from: "Gate Gaborone <info@gategaborone.com>",
      to,
      subject,
      html: adminHtmlContent,
    });

    let confirmationSuccess = false;

    // Generate iCal .ics content for calendar integration
    const icsContent = `
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Gate Gaborone//NONSGML v1.0//EN
BEGIN:VEVENT
UID:${uuidv4()}@gategaborone.com
DTSTAMP:20230409T120000Z
DTSTART:20230415T150000Z
DTEND:20230415T180000Z
SUMMARY:${eventName}
LOCATION:${location}
DESCRIPTION:Join us for the event with ${name}. ${message}
STATUS:CONFIRMED
SEQUENCE:0
BEGIN:VALARM
TRIGGER:-PT15M
DESCRIPTION:Reminder for ${eventName}
ACTION:DISPLAY
END:VALARM
END:VEVENT
END:VCALENDAR
`;

    // If confirmation email is requested, send it with the iCal and WhatsApp link
    if (sendConfirmation) {
      const confirmationHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px; background-color: #f8fafc;">
        <div style="text-align: center;">
          <img src="https://lojchdvtwypjqupsjynf.supabase.co/storage/v1/object/public/images/general/gate-logo.png" alt="Gate Gaborone" style="max-width: 150px;" />
        </div>
        <h2 style="color: #3b82f6;">Registration Confirmation</h2>
        <p>Dear ${title} ${name},</p>
        <p>Thank you for registering for <strong>${eventName}</strong>.</p>
        
        <ul style="padding-left: 20px;">
          <li><strong>Event:</strong> ${eventName}</li>
          <li><strong>Type:</strong> ${registrationType}</li>
          <li><strong>Role:</strong> ${role}</li>
          <li><strong>Denomination:</strong> ${denomination}</li>
          <li><strong>Phone:</strong> ${phone}</li>
          <li><strong>Location:</strong> <a href="${location}" style="color: #3b82f6;">View on Map</a></li>
        </ul>

        <div style="text-align: center; padding-top: 20px;">
          <h3 style="color: #3b82f6;">Add to Calendar</h3>
          <a href="data:text/calendar;charset=utf8,${encodeURIComponent(icsContent)}" style="padding: 10px 20px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 5px;">Add to Calendar</a>
        </div>

        <div style="text-align: center; padding-top: 20px;">
          <h3 style="color: #3b82f6;">Share this event</h3>
          <a href="https://wa.me/?text=I%20just%20registered%20for%20${eventName}%20at%20Gate%20Gaborone.%20You%20should%20come%20too!%20Here's%20the%20link%20${location}" target="_blank" style="text-decoration: none;">
            <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="Share on WhatsApp" style="width: 40px; height: 40px;" />
          </a>
        </div>

        <div style="text-align: center; padding-top: 20px;">
          <h3 style="color: #3b82f6;">Event Location QR Code</h3>
          <img src="https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(location)}&size=150x150" alt="Event QR Code" />
        </div>
      </div>
      `;

      // Send the confirmation email
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



