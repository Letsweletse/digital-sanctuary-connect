
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
  return `
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
        <tr><td><strong>Check-in ID:</strong></td><td>${checkInId}</td></tr>
      </table>
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
  whatsappShareUrl
}: ConfirmationEmailProps): string {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registration Confirmation</title>
    <style type="text/css">
      /* Base styles for email clients */
      body, html {
        margin: 0;
        padding: 0;
        font-family: Arial, sans-serif;
        line-height: 1.5;
      }
      
      table {
        border-spacing: 0;
        border-collapse: collapse;
      }
      
      td {
        padding: 0;
        word-break: break-word;
      }
      
      img {
        border: 0;
        max-width: 100%;
      }
      
      p {
        margin: 0 0 15px 0;
      }
      
      h1, h2, h3 {
        margin-top: 0;
      }
      
      a {
        text-decoration: none;
      }
      
      .social-button {
        display: inline-block;
        text-align: center;
        border-radius: 6px;
        font-weight: bold;
        padding: 10px 15px;
        margin: 4px 2px;
        text-decoration: none;
        color: #ffffff !important;
      }
    </style>
  </head>
  <body style="background-color: #f8fafc; margin: 0; padding: 0;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #eaeaea; border-radius: 10px; overflow: hidden;">
      <!-- Header with Logo -->
      <div style="text-align: center; padding: 20px; background-color: #ffffff;">
        <img src="https://lojchdvtwypjqupsjynf.supabase.co/storage/v1/object/public/images/general/gate-logo.png" alt="Gate Gaborone" style="max-width: 180px; height: auto;" />
      </div>
      
      <!-- Event Image -->
      <div style="text-align: center; padding: 0 20px 20px 20px;">
        <img src="${eventImage}" alt="${eventName}" style="max-width: 100%; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);" />
      </div>
      
      <!-- Confirmation Header -->
      <div style="padding: 0 20px 20px 20px;">
        <h2 style="color: #3b82f6; text-align: center; margin-bottom: 20px;">Registration Confirmation</h2>
        <p style="margin-bottom: 15px;">Dear ${title} ${name},</p>
        <p style="margin-bottom: 15px;">Thank you for registering for <strong>${eventName}</strong>.</p>
      </div>
      
      <!-- Event Details -->
      <div style="padding: 15px 20px; margin: 0 20px 20px 20px; background-color: #f0f9ff; border-left: 4px solid #3b82f6; border-radius: 4px;">
        <h3 style="color: #3b82f6; margin-top: 0; margin-bottom: 10px;">Event Details</h3>
        <table style="width: 100%;">
          <tr>
            <td style="padding: 4px 0;"><strong>Event:</strong></td>
            <td style="padding: 4px 0; word-break: break-word;">${eventName}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0;"><strong>Date:</strong></td>
            <td style="padding: 4px 0; word-break: break-word;">${eventDate}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0;"><strong>Time:</strong></td>
            <td style="padding: 4px 0; word-break: break-word;">${eventTime}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0;"><strong>Type:</strong></td>
            <td style="padding: 4px 0; word-break: break-word;">${registrationType}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0;"><strong>Role:</strong></td>
            <td style="padding: 4px 0; word-break: break-word;">${role}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0;"><strong>Denomination:</strong></td>
            <td style="padding: 4px 0; word-break: break-word;">${denomination}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0;"><strong>Phone:</strong></td>
            <td style="padding: 4px 0; word-break: break-word;">${phone}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0;"><strong>Location:</strong></td>
            <td style="padding: 4px 0;"><a href="${location}" style="color: #3b82f6;">View on Map</a></td>
          </tr>
          <tr>
            <td style="padding: 4px 0;"><strong>Check-in ID:</strong></td>
            <td style="padding: 4px 0; word-break: break-word;">${checkInId}</td>
          </tr>
        </table>
      </div>
      
      <!-- QR Codes Section -->
      <div style="padding: 0 20px 20px 20px;">
        <table style="width: 100%; border-collapse: separate; border-spacing: 10px;">
          <tr>
            <td style="width: 50%; padding: 15px; background-color: #fff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); text-align: center; vertical-align: top;">
              <h3 style="color: #3b82f6; margin-top: 0; margin-bottom: 15px;">Event Location</h3>
              <img src="${locationQrCodeUrl}" alt="Location QR Code" style="max-width: 150px; height: auto; margin-bottom: 10px; border: 1px solid #e5e7eb; padding: 5px; background-color: #fff;" />
              <p style="font-size: 14px; color: #6b7280; margin-bottom: 0;">Scan to open in Google Maps</p>
            </td>
            <td style="width: 50%; padding: 15px; background-color: #fff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); text-align: center; vertical-align: top;">
              <h3 style="color: #3b82f6; margin-top: 0; margin-bottom: 15px;">Quick Check-In</h3>
              <img src="${checkInQrCodeUrl}" alt="Check-In QR Code" style="max-width: 150px; height: auto; margin-bottom: 10px; border: 1px solid #e5e7eb; padding: 5px; background-color: #fff;" />
              <p style="font-size: 14px; color: #6b7280; margin-bottom: 0;">Show this code at the door for faster check-in</p>
              <p style="font-size: 12px; color: #6b7280; margin-top: 5px; font-style: italic;">Your Check-in ID: ${checkInId}</p>
            </td>
          </tr>
        </table>
      </div>
      
      <!-- Add to Calendar -->
      <div style="text-align: center; margin: 0 20px 20px 20px; padding: 20px; background-color: #f0f9ff; border-radius: 8px;">
        <h3 style="color: #3b82f6; margin-bottom: 15px;">Add to Calendar</h3>
        <a href="data:text/calendar;charset=utf8,${encodedIcsContent}" download="${eventName.replace(/\\s+/g, '-')}.ics" style="display: inline-block; padding: 12px 24px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          📅 Add to Calendar
        </a>
        <p style="font-size: 14px; color: #6b7280; margin-top: 10px;">Works with Google Calendar, Apple Calendar, Outlook and more</p>
        <p style="font-size: 12px; color: #6b7280; margin-top: 5px;">
          Note: In Gmail, you may need to download the .ics file manually
        </p>
      </div>
      
      <!-- Share with Friends -->
      <div style="text-align: center; margin: 0 20px 20px 20px; padding: 20px; background-color: #f0f9ff; border-radius: 8px;">
        <h3 style="color: #3b82f6; margin-bottom: 15px;">Share with Friends</h3>
        
        <div style="margin-bottom: 15px;">
          <!-- WhatsApp -->
          <a href="${whatsappShareUrl}" target="_blank" class="social-button" style="background-color: #25D366;">
            <img src="https://cdn-icons-png.flaticon.com/512/124/124034.png" width="20" height="20" alt="WhatsApp" style="vertical-align: middle; margin-right: 8px;" />
            WhatsApp
          </a>
          
          <!-- Facebook -->
          <a href="https://www.facebook.com/sharer/sharer.php?u=https://gategaborone.com/events" target="_blank" class="social-button" style="background-color: #3b5998;">
            <img src="https://cdn-icons-png.flaticon.com/512/124/124010.png" width="20" height="20" alt="Facebook" style="vertical-align: middle; margin-right: 8px;" />
            Facebook
          </a>
          
          <!-- Twitter/X -->
          <a href="https://twitter.com/intent/tweet?text=Join%20me%20at%20${encodeURIComponent(eventName)}%20at%20Gate%20Gaborone!%20Register%20here:%20https://gategaborone.com/events" target="_blank" class="social-button" style="background-color: #000000;">
            <img src="https://cdn-icons-png.flaticon.com/512/124/124021.png" width="20" height="20" alt="Twitter" style="vertical-align: middle; margin-right: 8px;" />
            Twitter/X
          </a>
          
          <!-- LinkedIn -->
          <a href="https://www.linkedin.com/sharing/share-offsite/?url=https://gategaborone.com/events" target="_blank" class="social-button" style="background-color: #0077b5;">
            <img src="https://cdn-icons-png.flaticon.com/512/174/174857.png" width="20" height="20" alt="LinkedIn" style="vertical-align: middle; margin-right: 8px;" />
            LinkedIn
          </a>
          
          <!-- TikTok -->
          <a href="https://www.tiktok.com/" target="_blank" class="social-button" style="background-color: #000000;">
            <img src="https://cdn-icons-png.flaticon.com/512/3046/3046121.png" width="20" height="20" alt="TikTok" style="vertical-align: middle; margin-right: 8px;" />
            TikTok
          </a>
          
          <!-- Email -->
          <a href="mailto:?subject=Join%20me%20at%20${encodeURIComponent(eventName)}&body=I'm%20attending%20${encodeURIComponent(eventName)}%20at%20Gate%20Gaborone%20on%20${encodeURIComponent(eventDate)}%20at%20${encodeURIComponent(eventTime)}.%20You%20should%20join%20too!%20Register%20here:%20https://gategaborone.com/events" class="social-button" style="background-color: #718096;">
            <img src="https://cdn-icons-png.flaticon.com/512/561/561127.png" width="20" height="20" alt="Email" style="vertical-align: middle; margin-right: 8px;" />
            Email
          </a>
        </div>
        
        <p style="font-size: 14px; color: #6b7280; margin-top: 10px;">Invite friends and family to join you!</p>
      </div>
      
      <!-- Follow Us -->
      <div style="text-align: center; margin: 0 20px 20px 20px;">
        <h3 style="color: #3b82f6; margin-bottom: 15px;">Follow Us</h3>
        <table style="width: 100%; text-align: center;">
          <tr>
            <td style="padding: 5px;">
              <a href="https://www.facebook.com/GateGaborone" target="_blank" style="display: inline-block; padding: 10px; background-color: #3b5998; color: white; border-radius: 50%; width: 40px; height: 40px; text-align: center; line-height: 20px; text-decoration: none;">
                <img src="https://cdn-icons-png.flaticon.com/512/124/124010.png" width="20" height="20" alt="Facebook" />
              </a>
            </td>
            <td style="padding: 5px;">
              <a href="https://www.instagram.com/gategaborone" target="_blank" style="display: inline-block; padding: 10px; background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%); color: white; border-radius: 50%; width: 40px; height: 40px; text-align: center; line-height: 20px; text-decoration: none;">
                <img src="https://cdn-icons-png.flaticon.com/512/174/174855.png" width="20" height="20" alt="Instagram" />
              </a>
            </td>
            <td style="padding: 5px;">
              <a href="https://www.youtube.com/@GateGaborone" target="_blank" style="display: inline-block; padding: 10px; background-color: #FF0000; color: white; border-radius: 50%; width: 40px; height: 40px; text-align: center; line-height: 20px; text-decoration: none;">
                <img src="https://cdn-icons-png.flaticon.com/512/174/174883.png" width="20" height="20" alt="YouTube" />
              </a>
            </td>
            <td style="padding: 5px;">
              <a href="https://twitter.com/GateGaborone" target="_blank" style="display: inline-block; padding: 10px; background-color: #000000; color: white; border-radius: 50%; width: 40px; height: 40px; text-align: center; line-height: 20px; text-decoration: none;">
                <img src="https://cdn-icons-png.flaticon.com/512/124/124021.png" width="20" height="20" alt="Twitter/X" />
              </a>
            </td>
            <td style="padding: 5px;">
              <a href="https://www.tiktok.com/" target="_blank" style="display: inline-block; padding: 10px; background-color: #000000; color: white; border-radius: 50%; width: 40px; height: 40px; text-align: center; line-height: 20px; text-decoration: none;">
                <img src="https://cdn-icons-png.flaticon.com/512/3046/3046121.png" width="20" height="20" alt="TikTok" />
              </a>
            </td>
          </tr>
        </table>
        <p style="font-size: 14px; color: #6b7280; margin-top: 5px;">Stay connected with Gate Gaborone</p>
      </div>
      
      <!-- Footer -->
      <div style="text-align: center; font-size: 14px; color: #6b7280; border-top: 1px solid #e5e7eb; padding: 20px;">
        <p>If you have any questions, please contact us at <a href="mailto:info@gategaborone.com" style="color: #3b82f6;">info@gategaborone.com</a></p>
        <p style="margin-bottom: 0;">© 2025 Gate Gaborone. All rights reserved.</p>
      </div>
    </div>
  </body>
  </html>
  `;
}
