interface AdminEmailProps {
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
}

interface ConfirmationEmailProps {
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
  location: string;
  checkInId: string;
  locationQrCodeUrl: string;
  checkInQrCodeUrl: string;
  encodedIcsContent: string;
  whatsappShareUrl: string;
  churchLogo?: string;
}

export function generateAdminEmailContent({
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
}: AdminEmailProps): string {
  const churchUrl = "https://www.gategaborone.com";
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

export function generateConfirmationEmailContent({
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
  location,
  checkInId,
  locationQrCodeUrl,
  checkInQrCodeUrl,
  encodedIcsContent,
  whatsappShareUrl,
  churchLogo = 'https://lojchdvtwypjqupsjynf.supabase.co/storage/v1/object/public/images/general/gate-logo.png'
}: ConfirmationEmailProps): string {
  const churchUrl = "https://www.gategaborone.com";
  const shareTextBase = `Join me at ${eventName} at GATE Gaborone Auditorium on Saturday, 7 February 2026 at GATE Gaborone Auditorium, Gaborone.`;
  const checkInUrl = `${churchUrl}/check-in/${checkInId}`;

  return `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px; background-color: #f8fafc;">
    <div style="text-align: center; margin-bottom: 20px;">
      <img src="${churchLogo}" alt="Gate Gaborone" style="max-width: 180px; height: auto;" />
    </div>
    
    <div style="text-align: center; margin-bottom: 25px;">
      <img src="${eventImage}" alt="${eventName}" style="max-width: 100%; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);" />
    </div>
    
    <h2 style="color: #3b82f6; text-align: center; margin-bottom: 20px;">Conference Registration Confirmation</h2>
    <p style="margin-bottom: 15px;">Dear ${title} ${name},</p>
    <p style="margin-bottom: 15px;">Thank you for your <strong>registration</strong> for <strong>${eventName}</strong>.</p>
    
    <div style="background-color: #dcfce7; border-left: 4px solid #22c55e; padding: 15px; margin-bottom: 20px; border-radius: 4px;">
      <h3 style="color: #16a34a; margin-top: 0; margin-bottom: 10px;">✅ Conference Registration Confirmed</h3>
      <p style="color: #15803d; font-weight: bold; margin: 0; font-size: 16px;">Your spot is secured!</p>
    </div>
    
    <div style="background-color: #f0f9ff; border-left: 4px solid #3b82f6; padding: 15px; margin-bottom: 20px; border-radius: 4px;">
      <h3 style="color: #3b82f6; margin-top: 0; margin-bottom: 10px;">Conference Details</h3>
      <ul style="padding-left: 20px; margin-bottom: 0;">
        <li style="margin-bottom: 8px;"><strong>Conference:</strong> ${eventName}</li>
        <li style="margin-bottom: 8px;"><strong>Date:</strong> Saturday, 7 February 2026</li>
        <li style="margin-bottom: 8px;"><strong>Time:</strong> 09:00 - 13:30</li>
        <li style="margin-bottom: 8px;"><strong>About:</strong> Join us for Perspectives on the Apostolic with Thamo Naidoo, Presiding Apostolic Elder of Gate Global Family.</li>
        <li style="margin-bottom: 8px;"><strong>Registration Type:</strong> <span style="color: #3b82f6; font-weight: bold;">Standard Registration</span></li>
        <li style="margin-bottom: 8px;"><strong>Role:</strong> ${role}</li>
        <li style="margin-bottom: 8px;"><strong>Denomination:</strong> ${denomination}</li>
        <li style="margin-bottom: 8px;"><strong>Phone:</strong> ${phone}</li>
        <li style="margin-bottom: 8px;"><strong>Location:</strong> <a href="https://maps.app.goo.gl/eAGtrWHiWJMwJZ7W6" style="color: #3b82f6;">GATE Gaborone Auditorium, Plot 54014, Gaborone West</a></li>
        <li style="margin-bottom: 8px;"><strong>Check-in ID:</strong> ${checkInId}</li>
        <li style="margin-bottom: 8px;"><strong>Check-in Link:</strong> <a href="${checkInUrl}" style="color: #3b82f6;">Quick Check-in Portal</a></li>
      </ul>
    </div>

    <div style="background-color: #fef3c7; border-left: 4px solid #d97706; padding: 15px; margin-bottom: 20px; border-radius: 4px;">
      <h3 style="color: #d97706; margin-top: 0; margin-bottom: 10px;">Conference Schedule</h3>
      <ul style="padding-left: 20px; margin-bottom: 0;">
        <li style="margin-bottom: 8px;"><strong>Session 1:</strong> 09:00–10:15</li>
        <li style="margin-bottom: 8px;"><strong>Session 2:</strong> 10:45–12:00</li>
        <li style="margin-bottom: 8px;"><strong>Session 3:</strong> 12:05–13:30</li>
      </ul>
    </div>

    <div style="display: flex; justify-content: space-between; margin-bottom: 30px; flex-wrap: wrap; gap: 20px;">
      <div style="flex: 1; min-width: 250px; text-align: center; padding: 15px; background-color: #fff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h3 style="color: #3b82f6; margin-top: 0; margin-bottom: 15px;">Conference Location</h3>
        <img src="${locationQrCodeUrl}" alt="Location QR Code" style="max-width: 180px; height: auto; margin-bottom: 10px; border: 1px solid #e5e7eb; padding: 5px; background-color: #fff;" />
        <p style="font-size: 14px; color: #6b7280; margin-bottom: 0;">Scan to open in Google Maps</p>
        <p style="font-size: 12px; color: #6b7280; margin-top: 5px;">GATE Gaborone Auditorium, Gaborone</p>
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
      <a href="data:text/calendar;charset=utf-8,${encodedIcsContent}" download="${eventName.replace(/\s+/g, '_')}_invite.ics" style="display: inline-block; padding: 15px 30px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 10px;">
        📅 Add to Calendar
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
        <li style="margin-bottom: 8px;">Parking is available at the venue</li>
      </ul>
    </div>

    <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
      <p style="color: #6b7280; font-size: 14px; margin-bottom: 10px;">
        We look forward to seeing you at ${eventName}!
      </p>
      <p style="color: #6b7280; font-size: 12px; margin: 0;">
        For questions, contact us at <a href="mailto:info@gategaborone.com" style="color: #3b82f6;">info@gategaborone.com</a>
      </p>
    </div>
  </div>
  `;
}
