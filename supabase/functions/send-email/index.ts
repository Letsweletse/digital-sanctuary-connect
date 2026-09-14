import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

// ============= CORS Headers =============
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// ============= Types =============
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
  checkInUrl?: string;
  attendeeEmail?: string;
  churchLogo?: string;
}

// ============= Calendar Utils =============
const formatDate = (dateString: string): string => {
  console.log('📅 [Calendar Utils] Formatting date:', dateString);
  
  if (!dateString) {
    console.warn('⚠️ [Calendar Utils] No date provided, using current date');
    return new Date().toISOString();
  }
  
  try {
    const isoTest = new Date(dateString);
    if (!isNaN(isoTest.getTime()) && dateString.includes('T')) {
      return isoTest.toISOString();
    }
  } catch (e) {
    console.log('📅 [Calendar Utils] Not an ISO date, continuing with parsing');
  }
  
  if (dateString.includes(',')) {
    const parts = dateString.split(',');
    if (parts.length >= 2) {
      const monthDay = parts[1].trim();
      const currentYear = new Date().getFullYear();
      const fullDateString = `${monthDay}, ${currentYear}`;
      console.log('📅 [Calendar Utils] Trying to parse:', fullDateString);
      
      const parsedDate = new Date(fullDateString);
      if (!isNaN(parsedDate.getTime())) {
        console.log('✅ [Calendar Utils] Successfully parsed date:', parsedDate.toISOString());
        return parsedDate.toISOString();
      }
    }
  }
  
  try {
    const directParse = new Date(dateString);
    if (!isNaN(directParse.getTime())) {
      console.log('✅ [Calendar Utils] Direct parse successful:', directParse.toISOString());
      return directParse.toISOString();
    }
  } catch (e) {
    console.error('❌ [Calendar Utils] Direct parse failed:', e);
  }
  
  console.warn('⚠️ [Calendar Utils] All date parsing failed, using fallback date');
  const fallbackDate = new Date();
  fallbackDate.setDate(fallbackDate.getDate() + 7);
  return fallbackDate.toISOString();
};

const formatDateForCalendar = (eventDate: string, eventTime: string) => {
  console.log('📅 [Calendar Utils] Input - eventDate:', eventDate, 'eventTime:', eventTime);
  
  const startDateFormatted = formatDate(eventDate);
  const startDate = new Date(startDateFormatted);
  const endDate = new Date(startDate);
  endDate.setHours(startDate.getHours() + 2);
  
  return {
    startDateFormatted,
    endDateFormatted: endDate.toISOString(),
    nowFormatted: new Date().toISOString()
  };
};

const generateIcsContent = (params: {
  eventName: string;
  startDateFormatted: string;
  endDateFormatted: string;
  nowFormatted: string;
  location: string;
  message: string;
  checkInId: string;
}) => {
  const { eventName, startDateFormatted, endDateFormatted, nowFormatted, location, message, checkInId } = params;

  const formatForIcs = (dateString: string) => {
    return dateString.replace(/-|:|\.\d{3}/g, "").replace("Z", "Z");
  };

  return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Gate Gaborone//Event Registration//EN
BEGIN:VEVENT
UID:${checkInId}@gategaborone.co.bw
DTSTAMP:${formatForIcs(nowFormatted)}
DTSTART:${formatForIcs(startDateFormatted)}
DTEND:${formatForIcs(endDateFormatted)}
SUMMARY:${eventName}
DESCRIPTION:${message}\\n\\nCheck-in ID: ${checkInId}
LOCATION:${location}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;
};

// ============= Email Templates =============
function generateAdminEmailContent(params: {
  eventName: string;
  registrationType: string;
  title: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  denomination: string;
  message: string;
  checkInId: string;
}): string {
  const { eventName, registrationType, title, name, email, phone, role, denomination, message, checkInId } = params;
  const churchUrl = "https://www.gategaborone.co.bw";
  const checkInUrl = `${churchUrl}/check-in/${checkInId}`;

  return `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px; background-color: #f8fafc;">
    <div style="text-align: center; margin-bottom: 20px;">
      <img src="https://lojchdvtwypjqupsjynf.supabase.co/storage/v1/object/public/images/general/gate-logo.png" alt="Gate Gaborone" style="max-width: 180px; height: auto;" />
    </div>
    
    <h2 style="color: #3b82f6; text-align: center; margin-bottom: 20px;">New Conference Registration</h2>
    
    <div style="background-color: #dcfce7; border-left: 4px solid #22c55e; padding: 15px; margin-bottom: 20px; border-radius: 4px;">
      <h3 style="color: #16a34a; margin-top: 0; margin-bottom: 10px;">📋 Registration Details</h3>
    </div>
    
    <div style="background-color: #f0f9ff; border-left: 4px solid #3b82f6; padding: 15px; margin-bottom: 20px; border-radius: 4px;">
      <h3 style="color: #3b82f6; margin-top: 0; margin-bottom: 10px;">Event Information</h3>
      <ul style="padding-left: 20px; margin-bottom: 0;">
        <li style="margin-bottom: 8px;"><strong>Event:</strong> ${eventName}</li>
        <li style="margin-bottom: 8px;"><strong>Registration Type:</strong> ${registrationType}</li>
      </ul>
    </div>

    <div style="background-color: #fff; border: 1px solid #e5e7eb; padding: 15px; margin-bottom: 20px; border-radius: 4px;">
      <h3 style="color: #1f2937; margin-top: 0; margin-bottom: 10px;">Attendee Information</h3>
      <ul style="padding-left: 20px; margin-bottom: 0;">
        <li style="margin-bottom: 8px;"><strong>Name:</strong> ${title} ${name}</li>
        <li style="margin-bottom: 8px;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #3b82f6;">${email}</a></li>
        <li style="margin-bottom: 8px;"><strong>Phone:</strong> ${phone}</li>
        <li style="margin-bottom: 8px;"><strong>Role:</strong> ${role}</li>
        <li style="margin-bottom: 8px;"><strong>Denomination:</strong> ${denomination}</li>
        <li style="margin-bottom: 8px;"><strong>Check-in ID:</strong> ${checkInId}</li>
        <li style="margin-bottom: 8px;"><strong>Check-in URL:</strong> <a href="${checkInUrl}" style="color: #3b82f6;">${checkInUrl}</a></li>
      </ul>
    </div>

    ${message ? `
    <div style="background-color: #fef3c7; border-left: 4px solid #d97706; padding: 15px; margin-bottom: 20px; border-radius: 4px;">
      <h3 style="color: #d97706; margin-top: 0; margin-bottom: 10px;">Additional Message</h3>
      <p style="margin: 0; white-space: pre-wrap;">${message}</p>
    </div>
    ` : ''}

    <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
      <p style="color: #6b7280; font-size: 12px; margin: 0;">
        This is an automated notification from Gate Gaborone Conference Registration System
      </p>
    </div>
  </div>
  `;
}

function generateConfirmationEmailContent(params: {
  title: string;
  name: string;
  eventName: string;
  eventDate: string;
  eventTime: string;
  eventImage: string;
  registrationType: string;
  role: string;
  denomination: string;
  phone: string;
  checkInId: string;
  locationQrCodeUrl: string;
  checkInQrCodeUrl: string;
  googleCalendarUrl: string;
  whatsappShareUrl: string;
  churchLogo?: string;
}): string {
  const {
    title, name, eventName, eventDate, eventTime, eventImage,
    registrationType, role, denomination, phone, checkInId,
    locationQrCodeUrl, checkInQrCodeUrl, googleCalendarUrl, whatsappShareUrl,
    churchLogo = 'https://lojchdvtwypjqupsjynf.supabase.co/storage/v1/object/public/images/general/gate-logo.png'
  } = params;

  const churchUrl = "https://www.gategaborone.co.bw";
  const checkInUrl = `${churchUrl}/check-in/${checkInId}`;
  
  const venueLocation = location || "TBA";
  const venueMapUrl = "https://www.google.com/maps/search/?api=1&query=Ditlhareng+Estate+Gabane";

  return `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px; background-color: #f8fafc;">
    <div style="text-align: center; margin-bottom: 20px;">
      <img src="${churchLogo}" alt="Gate Gaborone" style="max-width: 180px; height: auto;" />
    </div>
    
    <div style="text-align: center; margin-bottom: 25px;">
      <img src="${eventImage}" alt="${eventName}" style="max-width: 100%; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);" />
    </div>
    
     <h2 style="color: #3b82f6; text-align: center; margin-bottom: 20px;">Registration Confirmation</h2>
     <p style="margin-bottom: 15px;">Dear ${title} ${name},</p>
     <p style="margin-bottom: 15px;">Thank you for your registration for <strong>${eventName}</strong>.</p>
    
     <div style="background-color: #dcfce7; border-left: 4px solid #22c55e; padding: 15px; margin-bottom: 20px; border-radius: 4px;">
       <h3 style="color: #16a34a; margin-top: 0; margin-bottom: 10px;">✅ Registration Confirmed</h3>
       <p style="color: #15803d; font-weight: bold; margin: 0; font-size: 16px;">Your spot is secured!</p>
     </div>
    
     <div style="background-color: #f0f9ff; border-left: 4px solid #3b82f6; padding: 15px; margin-bottom: 20px; border-radius: 4px;">
       <h3 style="color: #3b82f6; margin-top: 0; margin-bottom: 10px;">Event Details</h3>
      <ul style="padding-left: 20px; margin-bottom: 0;">
         <li style="margin-bottom: 8px;"><strong>Event:</strong> ${eventName}</li>
         <li style="margin-bottom: 8px;"><strong>Date:</strong> ${eventDate}</li>
         <li style="margin-bottom: 8px;"><strong>Time:</strong> ${eventTime}</li>
         <li style="margin-bottom: 8px;"><strong>Registration Type:</strong> <span style="color: #3b82f6; font-weight: bold;">Standard Registration</span></li>
        <li style="margin-bottom: 8px;"><strong>Role:</strong> ${role}</li>
        <li style="margin-bottom: 8px;"><strong>Denomination:</strong> ${denomination}</li>
        <li style="margin-bottom: 8px;"><strong>Phone:</strong> ${phone}</li>
        <li style="margin-bottom: 8px;"><strong>Location:</strong> <a href="${venueMapUrl}" style="color: #3b82f6;">${venueLocation}</a></li>
        <li style="margin-bottom: 8px;"><strong>Check-in ID:</strong> ${checkInId}</li>
        <li style="margin-bottom: 8px;"><strong>Check-in Link:</strong> <a href="${checkInUrl}" style="color: #3b82f6;">Quick Check-in Portal</a></li>
      </ul>
    </div>

     <div style="background-color: #fef3c7; border-left: 4px solid #d97706; padding: 15px; margin-bottom: 20px; border-radius: 4px;">
       <h3 style="color: #d97706; margin-top: 0; margin-bottom: 10px;">📌 Important Information</h3>
       <ul style="padding-left: 20px; margin-bottom: 0;">
         <li style="margin-bottom: 8px;">Please arrive 15 minutes early for check-in</li>
         <li style="margin-bottom: 8px;">Show your QR code at registration for faster entry</li>
         <li style="margin-bottom: 8px;">Refreshments will be provided</li>
         <li style="margin-bottom: 8px;">Freewill offerings will be received</li>
          <li style="margin-bottom: 8px;">For enquiries: <a href="mailto:tms@btcmail.co.bw" style="color: #3b82f6;">tms@btcmail.co.bw</a> or call 72171066 / 72374568</li>
       </ul>
     </div>

     <div style="display: flex; justify-content: space-between; margin-bottom: 30px; flex-wrap: wrap; gap: 20px;">
       <div style="flex: 1; min-width: 250px; text-align: center; padding: 15px; background-color: #fff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
         <h3 style="color: #3b82f6; margin-top: 0; margin-bottom: 15px;">Event Location</h3>
        <img src="${locationQrCodeUrl}" alt="Location QR Code" style="max-width: 180px; height: auto; margin-bottom: 10px; border: 1px solid #e5e7eb; padding: 5px; background-color: #fff;" />
        <p style="font-size: 14px; color: #6b7280; margin-bottom: 0;">Scan to open in Google Maps</p>
        <p style="font-size: 12px; color: #6b7280; margin-top: 5px;">${venueLocation}</p>
      </div>
      
      <div style="flex: 1; min-width: 250px; text-align: center; padding: 15px; background-color: #fff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h3 style="color: #3b82f6; margin-top: 0; margin-bottom: 15px;">Quick Check-In</h3>
        <img src="${checkInQrCodeUrl}" alt="Check-In QR Code" style="max-width: 180px; height: auto; margin-bottom: 10px; border: 1px solid #e5e7eb; padding: 5px; background-color: #fff;" />
        <p style="font-size: 14px; color: #6b7280; margin-bottom: 0;">Show this code at registration for faster check-in</p>
        <p style="font-size: 12px; color: #6b7280; margin-top: 5px; font-style: italic;">Your Check-in ID: ${checkInId}</p>
        <p style="font-size: 14px; margin-top: 10px;"><a href="${checkInUrl}" style="color: #3b82f6; text-decoration: underline;">Access Your Check-in Portal</a></p>
      </div>
    </div>

    <div style="text-align: center; margin-bottom: 30px;">
      <a href="${googleCalendarUrl}" target="_blank" style="display: inline-block; padding: 15px 30px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 10px;">
        📅 Add to Google Calendar
      </a>
      <a href="${whatsappShareUrl}" target="_blank" style="display: inline-block; padding: 15px 30px; background-color: #25D366; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 10px;">
        📱 Share on WhatsApp
      </a>
    </div>

    <div style="background-color: #fef3c7; border-left: 4px solid #d97706; padding: 15px; margin-bottom: 20px; border-radius: 4px;">
      <h3 style="color: #d97706; margin-top: 0; margin-bottom: 10px;">📌 Important Reminders</h3>
      <ul style="padding-left: 20px; margin-bottom: 0;">
        <li style="margin-bottom: 8px;">Please arrive 15 minutes early for check-in</li>
        <li style="margin-bottom: 8px;">Show your QR code at registration for faster entry</li>
        <li style="margin-bottom: 8px;">Bring a Bible and notebook for taking notes</li>
        <li style="margin-bottom: 8px;">Refreshments will be provided</li>
        <li style="margin-bottom: 8px;">Freewill offerings will be received</li>
        <li style="margin-bottom: 8px;">For enquiries: <a href="mailto:tms@btcmail.co.bw" style="color: #3b82f6;">tms@btcmail.co.bw</a> or call 72171066 / 72374568</li>
      </ul>
    </div>

    <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
      <p style="color: #6b7280; font-size: 14px; margin-bottom: 10px;">
        We look forward to seeing you at ${eventName}!
      </p>
      <p style="color: #6b7280; font-size: 12px; margin: 0;">
        For questions, contact us at <a href="mailto:info@gategaborone.co.bw" style="color: #3b82f6;">info@gategaborone.co.bw</a>
      </p>
    </div>
  </div>
  `;
}

// ============= Pledge & Invitation Email Templates =============
function generatePledgeConfirmationEmail(params: {
  pledgerName: string;
  pledgeAmount: string;
  currency: string;
  eventName: string;
  message?: string;
}): string {
  const { pledgerName, pledgeAmount, currency, eventName, message } = params;
  return `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px; background-color: #f8fafc;">
    <div style="text-align: center; margin-bottom: 20px;">
      <img src="https://lojchdvtwypjqupsjynf.supabase.co/storage/v1/object/public/images/general/gate-logo.png" alt="Gate Gaborone" style="max-width: 180px; height: auto;" />
    </div>
    <h2 style="color: #d97706; text-align: center;">🙏 Pledge Confirmation</h2>
    <p>Dear ${pledgerName},</p>
    <p>Thank you for your generous pledge towards the <strong>${eventName}</strong>!</p>
    <div style="background-color: #fef3c7; border-left: 4px solid #d97706; padding: 15px; margin: 20px 0; border-radius: 4px;">
      <h3 style="color: #92400e; margin-top: 0;">Pledge Details</h3>
      <p style="font-size: 24px; font-weight: bold; color: #92400e; margin: 10px 0;">${currency} ${pledgeAmount}</p>
    </div>
    <div style="background-color: #f0f9ff; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0; border-radius: 4px;">
      <h3 style="color: #3b82f6; margin-top: 0;">Conference Details</h3>
      <ul style="padding-left: 20px;">
        <li><strong>Event:</strong> Apostolic Conference – Malawi 2026</li>
        <li><strong>Theme:</strong> Time to Build (Haggai 1:2)</li>
        <li><strong>Dates:</strong> 29th April – 2nd May 2026</li>
        <li><strong>Time:</strong> 9:00 AM – 3:30 PM</li>
        <li><strong>Venue:</strong> Capital City Baptist Hall, Lilongwe, Malawi</li>
        <li><strong>Guest Speakers:</strong> Randolph Barnwell (South Africa), Kobus Bezuidenhout (Botswana)</li>
      </ul>
    </div>
    ${message ? `<p style="font-style: italic; color: #6b7280;">Your message: "${message}"</p>` : ''}
    <p>God bless you for your generous contribution!</p>
    <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
      <p style="color: #6b7280; font-size: 12px;">Gate Gaborone · Apostolic Conference Malawi 2026</p>
    </div>
  </div>`;
}

function generatePledgeAdminEmail(params: {
  pledgerName: string;
  pledgerEmail: string;
  pledgerPhone?: string;
  pledgeAmount: string;
  currency: string;
  eventName: string;
  message?: string;
}): string {
  const { pledgerName, pledgerEmail, pledgerPhone, pledgeAmount, currency, eventName, message } = params;
  return `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px; background-color: #f8fafc;">
    <div style="text-align: center; margin-bottom: 20px;">
      <img src="https://lojchdvtwypjqupsjynf.supabase.co/storage/v1/object/public/images/general/gate-logo.png" alt="Gate Gaborone" style="max-width: 180px; height: auto;" />
    </div>
    <h2 style="color: #d97706; text-align: center;">🙏 New Pledge Received</h2>
    <div style="background-color: #dcfce7; border-left: 4px solid #22c55e; padding: 15px; margin: 20px 0; border-radius: 4px;">
      <p style="font-size: 24px; font-weight: bold; color: #166534; margin: 0;">${currency} ${pledgeAmount}</p>
    </div>
    <div style="background-color: #fff; border: 1px solid #e5e7eb; padding: 15px; border-radius: 4px;">
      <ul style="padding-left: 20px;">
        <li><strong>Name:</strong> ${pledgerName}</li>
        <li><strong>Email:</strong> ${pledgerEmail}</li>
        ${pledgerPhone ? `<li><strong>Phone:</strong> ${pledgerPhone}</li>` : ''}
        <li><strong>Event:</strong> ${eventName}</li>
        ${message ? `<li><strong>Message:</strong> ${message}</li>` : ''}
      </ul>
    </div>
    <div style="text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
      <p style="color: #6b7280; font-size: 12px;">Automated pledge notification from Gate Gaborone</p>
    </div>
  </div>`;
}

function generateInvitationEmail(params: {
  recipientName: string;
  eventName: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  isReminder?: boolean;
}): string {
  const { recipientName, eventName, eventDate, eventTime, eventLocation, isReminder } = params;
  const registerUrl = "https://www.gategaborone.co.bw/events";
  const heading = isReminder ? "Friendly Reminder 🔔" : "You're Invited! 🎉";
  const intro = isReminder
    ? `This is a friendly reminder that you're registered for <strong>${eventName}</strong>. We can't wait to see you there!`
    : `We're excited to invite you to <strong>${eventName}</strong>!`;
  const ctaLabel = isReminder ? "View Event Details" : "Register Now";
  const noticeBlock = isReminder
    ? `<p><strong>You're already registered</strong> — no action needed. Refreshments provided. Freewill offerings received.</p>
       <p>Contact: <a href="mailto:tms@btcmail.co.bw">tms@btcmail.co.bw</a> or 72171066 / 72374568</p>`
    : `<p><strong>Registration is compulsory.</strong> Refreshments provided. Freewill offerings received.</p>
       <p>Contact: <a href="mailto:tms@btcmail.co.bw">tms@btcmail.co.bw</a> or 72171066 / 72374568</p>`;
  return `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px; background-color: #f8fafc;">
    <div style="text-align: center; margin-bottom: 20px;">
      <img src="https://lojchdvtwypjqupsjynf.supabase.co/storage/v1/object/public/images/general/gate-logo.png" alt="Gate Gaborone" style="max-width: 180px; height: auto;" />
    </div>
    <h2 style="color: #3b82f6; text-align: center;">${heading}</h2>
    <p>Dear ${recipientName},</p>
    <p>${intro}</p>
    <div style="background-color: #f0f9ff; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0; border-radius: 4px;">
      <h3 style="color: #3b82f6; margin-top: 0;">Event Details</h3>
      <ul style="padding-left: 20px;">
        <li><strong>📅 Date:</strong> ${eventDate}</li>
        <li><strong>⏰ Time:</strong> ${eventTime}</li>
        <li><strong>📍 Venue:</strong> ${eventLocation}</li>
      </ul>
      <p style="margin-top: 15px;"><strong>Sessions:</strong></p>
      <ul style="padding-left: 20px;">
        <li>Session 1: 09:00–10:15</li>
        <li>Session 2: 10:45–12:00</li>
        <li>Session 3: 12:05–13:30</li>
      </ul>
    </div>
    <div style="background-color: #fef3c7; border-left: 4px solid #d97706; padding: 15px; margin: 20px 0; border-radius: 4px;">
      ${noticeBlock}
    </div>
    <div style="text-align: center; margin: 25px 0;">
      <a href="${registerUrl}" style="display: inline-block; padding: 15px 30px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">${ctaLabel}</a>
    </div>
    <p>We look forward to seeing you!</p>
    <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
      <p style="color: #6b7280; font-size: 12px;">Gate Gaborone · <a href="https://www.gategaborone.co.bw">www.gategaborone.co.bw</a></p>
    </div>
  </div>`;
}

function generatePostponementEmail(params: {
  recipientName: string;
  eventName: string;
  oldEventDate: string;
  newEventDate: string;
  eventTime: string;
  eventLocation: string;
}): string {
  const { recipientName, eventName, oldEventDate, newEventDate, eventTime, eventLocation } = params;
  const registerUrl = "https://www.gategaborone.co.bw/event";
  return `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px; background-color: #f8fafc;">
    <div style="text-align: center; margin-bottom: 20px;">
      <img src="https://lojchdvtwypjqupsjynf.supabase.co/storage/v1/object/public/images/general/gate-logo.png" alt="Gate Gaborone" style="max-width: 180px; height: auto;" />
    </div>
    <h2 style="color: #b45309; text-align: center;">Important Notice: Event Postponed</h2>
    <p>Dear ${recipientName},</p>
    <p>We regret to inform you that <strong>${eventName}</strong>, scheduled for <strong>${oldEventDate}</strong>, has been <strong>cancelled</strong>.</p>
    <p>There has been an unfortunate death in the Gate Global family, and Apostle Thamo Naidoo has to attend the funeral. We sincerely apologise for the inconvenience caused.</p>
    <div style="background-color: #f0f9ff; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0; border-radius: 4px;">
      <h3 style="color: #3b82f6; margin-top: 0;">New Date</h3>
      <ul style="padding-left: 20px;">
        <li><strong>📅 Date:</strong> ${newEventDate}</li>
        <li><strong>⏰ Time:</strong> ${eventTime}</li>
        <li><strong>📍 Venue:</strong> ${eventLocation}</li>
      </ul>
      <p style="margin-top: 15px;"><strong>Sessions:</strong></p>
      <ul style="padding-left: 20px;">
        <li>Session 1: 09:00–10:15</li>
        <li>Session 2: 10:45–12:00</li>
        <li>Session 3: 12:05–13:30</li>
      </ul>
    </div>
    <div style="background-color: #fef3c7; border-left: 4px solid #d97706; padding: 15px; margin: 20px 0; border-radius: 4px;">
      <p><strong>Registration is compulsory.</strong> Please register again for the new date. Refreshments provided. Freewill offerings received.</p>
      <p>Contact: <a href="mailto:tms@btcmail.co.bw">tms@btcmail.co.bw</a> or 72171066 / 72374568</p>
    </div>
    <div style="text-align: center; margin: 25px 0;">
      <a href="${registerUrl}" style="display: inline-block; padding: 15px 30px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">Register for 24 October</a>
    </div>
    <p>Thank you for your understanding, and we look forward to seeing you in October.</p>
    <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
      <p style="color: #6b7280; font-size: 12px;">Gate Gaborone · <a href="https://www.gategaborone.co.bw">www.gategaborone.co.bw</a></p>
    </div>
  </div>`;
}


// ============= Main Handler =============
const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

async function processEmailRequest(req: Request): Promise<Response> {
  try {
    console.log("🚀 [Email Handler] Processing email request...");
    const body = await req.json();
    console.log("📧 [Email Handler] Request body received:", JSON.stringify(body, null, 2));

    const apiKey = Deno.env.get("RESEND_API_KEY");
    if (!apiKey) {
      console.error("❌ [Email Handler] RESEND_API_KEY not found in environment");
      throw new Error("Email service not configured - missing API key");
    }

    // Handle pledge confirmation emails
    if (body.type === 'pledge_confirmation') {
      console.log("🙏 [Email Handler] Processing pledge confirmation...");
      const adminEmails = ['otenggate@gmail.com', 'iblimenterprise@zohomail.com', 'info@gategaborone.co.bw', 'tms@btcmail.co.bw'];
      
      // Send confirmation to pledger
      const confirmationHtml = generatePledgeConfirmationEmail({
        pledgerName: body.pledgerName,
        pledgeAmount: body.pledgeAmount,
        currency: body.currency,
        eventName: body.eventName,
        message: body.message,
      });

      await resend.emails.send({
        from: "Gate Gaborone <info@gategaborone.co.bw>",
        to: [body.pledgerEmail],
        subject: `Pledge Confirmation: ${body.eventName}`,
        html: confirmationHtml,
      });
      console.log("✅ Pledge confirmation email sent to:", body.pledgerEmail);

      // Send admin notification
      const adminHtml = generatePledgeAdminEmail({
        pledgerName: body.pledgerName,
        pledgerEmail: body.pledgerEmail,
        pledgerPhone: body.pledgerPhone,
        pledgeAmount: body.pledgeAmount,
        currency: body.currency,
        eventName: body.eventName,
        message: body.message,
      });

      await resend.emails.send({
        from: "Gate Gaborone <info@gategaborone.co.bw>",
        to: adminEmails,
        subject: `New Pledge: ${body.currency} ${body.pledgeAmount} – ${body.eventName}`,
        html: adminHtml,
      });
      console.log("✅ Pledge admin notification sent");

      return new Response(
        JSON.stringify({ success: true, message: "Pledge emails sent" }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Handle event postponement notices
    if (body.type === 'event_postponement') {
      console.log("📢 [Email Handler] Processing postponement notice...");
      const html = generatePostponementEmail({
        recipientName: body.recipientName,
        eventName: body.eventName,
        oldEventDate: body.oldEventDate,
        newEventDate: body.eventDate,
        eventTime: body.eventTime,
        eventLocation: body.eventLocation,
      });

      await resend.emails.send({
        from: "Gate Gaborone <info@gategaborone.co.bw>",
        to: [body.recipientEmail],
        subject: `Important: ${body.eventName} postponed to ${body.eventDate}`,
        html,
      });
      console.log("✅ Postponement email sent to:", body.recipientEmail);

      return new Response(
        JSON.stringify({ success: true, message: "Postponement email sent" }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }


    // Handle event invitation / reminder emails
    if (body.type === 'event_invitation' || body.type === 'event_reminder') {
      const isReminder = body.type === 'event_reminder';
      console.log(`✉️ [Email Handler] Processing event ${isReminder ? 'reminder' : 'invitation'}...`);

      const invitationHtml = generateInvitationEmail({
        recipientName: body.recipientName,
        eventName: body.eventName,
        eventDate: body.eventDate,
        eventTime: body.eventTime,
        eventLocation: body.eventLocation,
        isReminder,
      });

      await resend.emails.send({
        from: "Gate Gaborone <info@gategaborone.co.bw>",
        to: [body.recipientEmail],
        subject: isReminder
          ? `Reminder: ${body.eventName} — ${body.eventDate}`
          : `You're Invited: ${body.eventName}`,
        html: invitationHtml,
      });
      console.log(`✅ ${isReminder ? 'Reminder' : 'Invitation'} email sent to:`, body.recipientEmail);

      return new Response(
        JSON.stringify({ success: true, message: `${isReminder ? 'Reminder' : 'Invitation'} email sent` }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // === Original registration email flow ===

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
      eventDate = "TBA",
      eventTime = "TBA",
      eventImage = "",
      checkInId = crypto.randomUUID()
    } = body;

    console.log(`📝 [Email Handler] Processing registration for: ${eventName}`);
    console.log(`👤 [Email Handler] Attendee: ${name} (${email})`);

    const baseUrl = "https://www.gategaborone.co.bw";
    const checkInUrl = `${baseUrl}/check-in/${checkInId}`;
    console.log(`🔗 [Email Handler] Check-in URL generated: ${checkInUrl}`);
    
    // Always use the correct venue location
    const googleMapsUrl = "https://www.google.com/maps/search/?api=1&query=Ditlhareng+Estate+Gabane";
    
    const locationQrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(googleMapsUrl)}&size=300x300&margin=10&qzone=2`;
    const checkInQrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(checkInUrl)}&size=300x300&margin=10&qzone=2`;

    const { startDateFormatted, endDateFormatted, nowFormatted } = formatDateForCalendar(eventDate, eventTime);
    
    const whatsappShareText = `Hey! I just registered for ${eventName} at Gate Gaborone. You should come too! 🙌 Date: ${eventDate}, Time: ${eventTime}. Here's the link: ${baseUrl}/events?register=${encodeURIComponent(eventName)}`;
    const whatsappShareUrl = `https://wa.me/?text=${encodeURIComponent(whatsappShareText)}`;

    // Generate Google Calendar URL instead of ICS file (works better with email tracking)
    const formatForGoogleCalendar = (dateStr: string) => {
      return dateStr.replace(/-|:|\.\d{3}/g, "").replace("Z", "Z");
    };
    const location = body.location || "TBA";
    const venueLocation = location;
    const googleCalendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventName)}&dates=${formatForGoogleCalendar(startDateFormatted)}/${formatForGoogleCalendar(endDateFormatted)}&details=${encodeURIComponent(`Check-in ID: ${checkInId}\n\nVenue: ${venueLocation}\nMap: ${googleMapsUrl}`)}&location=${encodeURIComponent(venueLocation)}&sf=true&output=xml`;

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
        from: "Gate Gaborone <info@gategaborone.co.bw>",
        to,
        subject,
        html: adminHtmlContent,
      });
      
      console.log("✅ [Email Handler] Admin email sent successfully:", adminEmailResponse);
    } catch (adminError: any) {
      console.error("❌ [Email Handler] Failed to send admin email:", adminError);
      throw new Error(`Admin email failed: ${adminError.message}`);
    }
    
    let confirmationSuccess = false;

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
        checkInId,
        locationQrCodeUrl,
        checkInQrCodeUrl,
        googleCalendarUrl,
        whatsappShareUrl
      });

      try {
        const emailResponse = await resend.emails.send({
          from: "Gate Gaborone <info@gategaborone.co.bw>",
          to: [email],
          subject: `Registration Confirmation: ${eventName}`,
          html: confirmationHtml,
        });

        console.log("✅ [Email Handler] Confirmation email sent successfully:", emailResponse);
        confirmationSuccess = true;
      } catch (confirmationError: any) {
        console.error("❌ [Email Handler] Failed to send confirmation email:", confirmationError);
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

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    return await processEmailRequest(req);
  } catch (error: any) {
    console.error("Error in send-email function:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
