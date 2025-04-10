
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
  checkInId?: string;
  attendeeEmail?: string;
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
      eventImage = "https://lojchdvtwypjqupsjynf.supabase.co/storage/v1/object/public/images/leadership/POA_1743681812478.jpg",
      checkInId = uuidv4(),
      attendeeEmail = email
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

    // Generate a personalized check-in URL with the attendee's email and check-in ID
    const checkInUrl = `https://gategaborone.com/check-in/${checkInId}?email=${encodeURIComponent(attendeeEmail)}`;
    
    // Generate event location QR code URL
    const locationQrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(location)}&size=200x200&margin=10`;
    
    // Generate event check-in QR code with personalized URL
    const checkInQrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(checkInUrl)}&size=200x200&margin=10`;

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
          <tr><td><strong>Check-in ID:</strong></td><td>${checkInId}</td></tr>
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
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
UID:${checkInId}@gategaborone.com
DTSTAMP:${nowFormatted}
DTSTART:${startDateFormatted}
DTEND:${endDateFormatted}
SUMMARY:${eventName}
LOCATION:${location}
DESCRIPTION:Join us for ${eventName}. ${message || "We look forward to seeing you!"} Your check-in ID is: ${checkInId}
ORGANIZER;CN=Gate Gaborone:mailto:info@gategaborone.com
STATUS:CONFIRMED
SEQUENCE:0
TRANSP:OPAQUE
BEGIN:VALARM
TRIGGER:-PT1H
DESCRIPTION:Reminder for ${eventName}
ACTION:DISPLAY
END:VALARM
END:VEVENT
END:VCALENDAR`;

    // Encode the iCal content for URL use (improved for better compatibility)
    const encodedIcsContent = encodeURIComponent(icsContent);
    
    // Create WhatsApp share URL with event details
    const whatsappShareText = `Hey! I just registered for ${eventName} at Gate Gaborone. You should come too! 🙌 Date: ${eventDate}, Time: ${eventTime}. Here's the link: https://gategaborone.com/events?register=${encodeURIComponent(eventName)}`;
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
            <li style="margin-bottom: 8px;"><strong>Check-in ID:</strong> ${checkInId}</li>
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
            <p style="font-size: 14px; color: #6b7280; margin-bottom: 0;">Show this code at the door for faster check-in</p>
            <p style="font-size: 12px; color: #6b7280; margin-top: 5px; font-style: italic;">Your Check-in ID: ${checkInId}</p>
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
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#ffffff" style="margin-right: 8px;">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
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
        checkInId: checkInId, // Include the check-in ID in the response
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
