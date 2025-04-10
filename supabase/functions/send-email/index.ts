
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
  eventDate?: string;
  eventTime?: string;
  eventImage?: string;
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
      location,
      eventDate = "2025-05-10",
      eventTime = "9:00 AM - 1:30 PM",
      eventImage = "https://lojchdvtwypjqupsjynf.supabase.co/storage/v1/object/public/images/leadership/POA_1743681812478.jpg"
    } = body;

    // Format date and time for iCal
    const eventDateObj = new Date(eventDate);
    const startTime = eventTime.split(" - ")[0];
    const endTime = eventTime.split(" - ")[1] || "12:00 PM";
    
    // Format for iCalendar - use actual date if provided or default
    const formatDate = (date: Date, time: string) => {
      const [hours, minutes] = time.replace(/[APM]/g, "").trim().split(":");
      let hour = parseInt(hours);
      if (time.includes("PM") && hour < 12) hour += 12;
      if (time.includes("AM") && hour === 12) hour = 0;
      
      date.setHours(hour, parseInt(minutes) || 0, 0);
      return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    };
    
    // Set start and end times for the event
    const startDate = new Date(eventDateObj);
    const endDate = new Date(eventDateObj);
    const startDateFormatted = formatDate(startDate, startTime);
    const endDateFormatted = formatDate(endDate, endTime);
    
    // Current date for DTSTAMP
    const now = new Date();
    const nowFormatted = formatDate(now, now.getHours() + ":" + now.getMinutes());

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

    // Generate iCal .ics content for calendar integration with proper formatting
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Gate Gaborone//NONSGML v1.0//EN
BEGIN:VEVENT
UID:${uuidv4()}@gategaborone.com
DTSTAMP:${nowFormatted}
DTSTART:${startDateFormatted}
DTEND:${endDateFormatted}
SUMMARY:${eventName}
LOCATION:${location}
DESCRIPTION:Join us for ${eventName}. ${message || "We look forward to seeing you!"}
STATUS:CONFIRMED
SEQUENCE:0
BEGIN:VALARM
TRIGGER:-PT1H
DESCRIPTION:Reminder for ${eventName}
ACTION:DISPLAY
END:VALARM
END:VEVENT
END:VCALENDAR`;

    // Encode the iCal content for URL use (improved for better compatibility)
    const encodedIcsContent = encodeURIComponent(icsContent);
    
    // Generate event location QR code URL
    const locationQrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(location)}&size=200x200&margin=10`;
    
    // Generate event check-in QR code with unique ID
    const checkInId = uuidv4();
    const checkInUrl = `https://gategaborone.com/check-in/${checkInId}`;
    const checkInQrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(checkInUrl)}&size=200x200&margin=10`;
    
    // Create WhatsApp share URL with event image
    const whatsappShareText = `Hey! I just registered for ${eventName} at Gate Gaborone. You should come too! 🙌 Here's the link: https://gategaborone.com/event/registernow`;
    const whatsappShareUrl = `https://wa.me/?text=${encodeURIComponent(whatsappShareText)}`;

    // If confirmation email is requested, send it with the enhanced features
    if (sendConfirmation) {
      const confirmationHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px; background-color: #f8fafc;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://lojchdvtwypjqupsjynf.supabase.co/storage/v1/object/public/images/general/gate-logo.png" alt="Gate Gaborone" style="max-width: 150px;" />
        </div>
        
        <div style="text-align: center; margin-bottom: 25px;">
          <img src="${eventImage}" alt="${eventName}" style="max-width: 100%; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);" />
        </div>
        
        <h2 style="color: #3b82f6; text-align: center; margin-bottom: 20px;">Registration Confirmation</h2>
        <p style="margin-bottom: 15px;">Dear ${title} ${name},</p>
        <p style="margin-bottom: 15px;">Thank you for registering for <strong>${eventName}</strong>.</p>
        
        <div style="background-color: #f0f9ff; border-left: 4px solid #3b82f6; padding: 15px; margin-bottom: 20px; border-radius: 4px;">
          <h3 style="color: #3b82f6; margin-top: 0; margin-bottom: 10px;">Event Details</h3>
          <ul style="padding-left: 20px; margin-bottom: 0;">
            <li style="margin-bottom: 8px;"><strong>Event:</strong> ${eventName}</li>
            <li style="margin-bottom: 8px;"><strong>Date:</strong> ${eventDate}</li>
            <li style="margin-bottom: 8px;"><strong>Time:</strong> ${eventTime}</li>
            <li style="margin-bottom: 8px;"><strong>Type:</strong> ${registrationType}</li>
            <li style="margin-bottom: 8px;"><strong>Role:</strong> ${role}</li>
            <li style="margin-bottom: 8px;"><strong>Denomination:</strong> ${denomination}</li>
            <li style="margin-bottom: 8px;"><strong>Phone:</strong> ${phone}</li>
            <li style="margin-bottom: 8px;"><strong>Location:</strong> <a href="${location}" style="color: #3b82f6;">View on Map</a></li>
          </ul>
        </div>

        <div style="display: flex; justify-content: space-between; margin-bottom: 30px; flex-wrap: wrap; gap: 20px;">
          <div style="flex: 1; min-width: 250px; text-align: center; padding: 15px; background-color: #fff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h3 style="color: #3b82f6; margin-top: 0; margin-bottom: 15px;">Event Location</h3>
            <img src="${locationQrCodeUrl}" alt="Location QR Code" style="max-width: 100%; height: auto; margin-bottom: 10px;" />
            <p style="font-size: 14px; color: #6b7280; margin-bottom: 0;">Scan to open in Google Maps</p>
          </div>
          
          <div style="flex: 1; min-width: 250px; text-align: center; padding: 15px; background-color: #fff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h3 style="color: #3b82f6; margin-top: 0; margin-bottom: 15px;">Quick Check-In</h3>
            <img src="${checkInQrCodeUrl}" alt="Check-In QR Code" style="max-width: 100%; height: auto; margin-bottom: 10px;" />
            <p style="font-size: 14px; color: #6b7280; margin-bottom: 0;">Show this code at the door</p>
          </div>
        </div>

        <div style="text-align: center; margin-bottom: 30px;">
          <h3 style="color: #3b82f6; margin-bottom: 15px;">Add to Calendar</h3>
          <a href="data:text/calendar;charset=utf8,${encodedIcsContent}" download="${eventName.replace(/\s+/g, '-')}.ics" style="display: inline-block; padding: 12px 24px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            📅 Add to Calendar
          </a>
          <p style="font-size: 14px; color: #6b7280; margin-top: 10px;">Works with Google Calendar, Apple Calendar, Outlook and more</p>
        </div>

        <div style="text-align: center; margin-bottom: 30px; padding: 20px; background-color: #f0f9ff; border-radius: 8px;">
          <h3 style="color: #3b82f6; margin-bottom: 15px;">Share with Friends</h3>
          <a href="${whatsappShareUrl}" target="_blank" style="display: inline-flex; align-items: center; padding: 12px 24px; background-color: #25D366; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" style="width: 24px; height: 24px; margin-right: 8px; filter: brightness(0) invert(1);" />
            Share on WhatsApp
          </a>
          <p style="font-size: 14px; color: #6b7280; margin-top: 10px;">Invite friends and family to join you!</p>
        </div>
        
        <div style="text-align: center; font-size: 14px; color: #6b7280; border-top: 1px solid #e5e7eb; padding-top: 20px;">
          <p>If you have any questions, please contact us at <a href="mailto:info@gategaborone.com" style="color: #3b82f6;">info@gategaborone.com</a></p>
          <p style="margin-bottom: 0;">© 2025 Gate Gaborone. All rights reserved.</p>
        </div>
      </div>
      `;

      // Send the confirmation email with enhanced features
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
