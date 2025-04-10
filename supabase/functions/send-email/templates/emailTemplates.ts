
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
  // Fixed logo URL with full path to ensure visibility
  const logoUrl = "https://lojchdvtwypjqupsjynf.supabase.co/storage/v1/object/public/images/general/gate-logo.png";
  
  // Define social media icon URLs from a reliable source
  const socialIcons = {
    whatsapp: "https://cdn4.iconfinder.com/data/icons/social-messaging-ui-color-shapes-2-free/128/social-whatsapp-circle-512.png",
    facebook: "https://cdn4.iconfinder.com/data/icons/social-messaging-ui-color-shapes-2-free/128/social-facebook-circle-512.png",
    twitter: "https://cdn4.iconfinder.com/data/icons/social-messaging-ui-color-shapes-2-free/128/social-twitter-circle-512.png",
    linkedin: "https://cdn4.iconfinder.com/data/icons/social-messaging-ui-color-shapes-2-free/128/social-linkedin-circle-512.png",
    email: "https://cdn4.iconfinder.com/data/icons/social-messaging-ui-color-shapes-2-free/128/social-gmail-circle-512.png",
    youtube: "https://cdn4.iconfinder.com/data/icons/social-messaging-ui-color-shapes-2-free/128/social-youtube-circle-512.png",
    instagram: "https://cdn4.iconfinder.com/data/icons/social-messaging-ui-color-shapes-2-free/128/social-instagram-circle-512.png",
    tiktok: "https://cdn4.iconfinder.com/data/icons/logos-brands-7/512/tiktok_logo-512.png"
  };

  return `
  <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
  <html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>Registration Confirmation</title>
    <style type="text/css">
      /* Essential Email-Safe CSS */
      body, html, table, tr, td, div, p, h1, h2, h3 {
        margin: 0;
        padding: 0;
        font-family: Arial, sans-serif;
        line-height: 1.5;
      }
      /* Force Outlook to provide normal text spacing */
      .ExternalClass, .ExternalClass p, 
      .ExternalClass span, .ExternalClass font, 
      .ExternalClass td, .ExternalClass div {
        line-height: 100%;
      }
      /* Prevent WebKit and Windows mobile from changing text sizes */
      body, table, td, p, a, li, blockquote {
        -ms-text-size-adjust: 100%;
        -webkit-text-size-adjust: 100%;
      }
      /* Force Hotmail to display emails at full width */
      .ExternalClass {
        width: 100%;
      }
      /* Fix for Outlook iOS App */
      @media only screen and (min-device-width: 414px) {
        u ~ div .email-container {
          min-width: 414px !important;
        }
      }
      /* Ensure 100% width on all browsers */
      table, td {
        mso-table-lspace: 0pt !important;
        mso-table-rspace: 0pt !important;
      }
      /* Reset styles */
      img {
        -ms-interpolation-mode: bicubic;
        max-width: 100%;
        border: 0;
        height: auto;
        line-height: 100%;
        outline: none;
        text-decoration: none;
      }
      /* Fix for Yahoo Mail */
      table {
        border-spacing: 0 !important;
        border-collapse: collapse !important;
        table-layout: fixed !important;
      }
      /* Standard Styles */
      .main-table {
        width: 100%;
        max-width: 600px;
        margin: 0 auto;
        background-color: #ffffff;
      }
      .header {
        padding: 20px;
        text-align: center;
        background-color: #ffffff;
      }
      .content {
        padding: 20px;
      }
      .footer {
        padding: 20px;
        text-align: center;
        color: #6b7280;
        font-size: 14px;
      }
      .button {
        display: inline-block;
        padding: 12px 24px;
        background-color: #3b82f6;
        color: white !important;
        text-decoration: none;
        border-radius: 6px;
        font-weight: bold;
        mso-padding-alt: 12px 24px;
        text-align: center;
      }
      .social-button {
        display: inline-block;
        margin: 5px;
        text-align: center;
      }
      .data-table {
        width: 100%;
        margin-bottom: 20px;
        border-left: 4px solid #3b82f6;
        background-color: #f0f9ff;
      }
      .data-table td {
        padding: 8px;
        word-break: break-word;
      }
      /* Make it responsive */
      @media screen and (max-width: 600px) {
        .main-table {
          width: 100% !important;
        }
        .content {
          padding: 10px !important;
        }
        .two-column {
          width: 100% !important;
          display: block !important;
        }
      }
    </style>
  </head>
  <body style="margin: 0; padding: 0; background-color: #f8fafc; word-spacing: normal;">
    <!-- Master Table -->
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc;">
      <tr>
        <td align="center" valign="top">
          <!-- Email Container -->
          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; border: 1px solid #eaeaea; border-radius: 10px; overflow: hidden; margin: 20px auto;">
            <!-- Header with Logo -->
            <tr>
              <td align="center" style="padding: 20px; background-color: #ffffff;">
                <img src="${logoUrl}" alt="Gate Gaborone" width="180" style="display: block; margin: 0 auto; max-width: 180px; height: auto;" />
              </td>
            </tr>
            
            <!-- Event Image -->
            <tr>
              <td align="center" style="padding: 0 20px 20px 20px;">
                <img src="${eventImage}" alt="${eventName}" style="display: block; width: 100%; max-width: 560px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);" />
              </td>
            </tr>
            
            <!-- Confirmation Header -->
            <tr>
              <td align="left" style="padding: 0 20px 20px 20px;">
                <h2 style="color: #3b82f6; text-align: center; margin-bottom: 20px;">Registration Confirmation</h2>
                <p style="margin-bottom: 15px;">Dear ${title} ${name},</p>
                <p style="margin-bottom: 15px;">Thank you for registering for <strong>${eventName}</strong>.</p>
              </td>
            </tr>
            
            <!-- Event Details -->
            <tr>
              <td align="left" style="padding: 0 20px 20px 20px;">
                <table border="0" cellpadding="0" cellspacing="0" class="data-table" style="border-radius: 4px; overflow: hidden;">
                  <tr>
                    <td colspan="2" style="padding: 10px; background-color: #f0f9ff;">
                      <h3 style="color: #3b82f6; margin: 0;">Event Details</h3>
                    </td>
                  </tr>
                  <tr>
                    <td width="120" style="padding: 8px 10px; background-color: #f0f9ff;"><strong>Event:</strong></td>
                    <td style="padding: 8px 10px; background-color: #f0f9ff;">${eventName}</td>
                  </tr>
                  <tr>
                    <td width="120" style="padding: 8px 10px; background-color: #f0f9ff;"><strong>Date:</strong></td>
                    <td style="padding: 8px 10px; background-color: #f0f9ff;">${eventDate}</td>
                  </tr>
                  <tr>
                    <td width="120" style="padding: 8px 10px; background-color: #f0f9ff;"><strong>Time:</strong></td>
                    <td style="padding: 8px 10px; background-color: #f0f9ff;">${eventTime}</td>
                  </tr>
                  <tr>
                    <td width="120" style="padding: 8px 10px; background-color: #f0f9ff;"><strong>Type:</strong></td>
                    <td style="padding: 8px 10px; background-color: #f0f9ff;">${registrationType}</td>
                  </tr>
                  <tr>
                    <td width="120" style="padding: 8px 10px; background-color: #f0f9ff;"><strong>Role:</strong></td>
                    <td style="padding: 8px 10px; background-color: #f0f9ff;">${role}</td>
                  </tr>
                  <tr>
                    <td width="120" style="padding: 8px 10px; background-color: #f0f9ff;"><strong>Denomination:</strong></td>
                    <td style="padding: 8px 10px; background-color: #f0f9ff;">${denomination}</td>
                  </tr>
                  <tr>
                    <td width="120" style="padding: 8px 10px; background-color: #f0f9ff;"><strong>Phone:</strong></td>
                    <td style="padding: 8px 10px; background-color: #f0f9ff;">${phone}</td>
                  </tr>
                  <tr>
                    <td width="120" style="padding: 8px 10px; background-color: #f0f9ff;"><strong>Location:</strong></td>
                    <td style="padding: 8px 10px; background-color: #f0f9ff;"><a href="${location}" style="color: #3b82f6;">View on Map</a></td>
                  </tr>
                  <tr>
                    <td width="120" style="padding: 8px 10px; background-color: #f0f9ff;"><strong>Check-in ID:</strong></td>
                    <td style="padding: 8px 10px; background-color: #f0f9ff;">${checkInId}</td>
                  </tr>
                </table>
              </td>
            </tr>
            
            <!-- QR Codes Section -->
            <tr>
              <td align="center" style="padding: 0 20px 20px 20px;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td width="50%" align="center" class="two-column" style="padding: 15px; background-color: #fff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); vertical-align: top;">
                      <h3 style="color: #3b82f6; margin-top: 0; margin-bottom: 15px;">Event Location</h3>
                      <img src="${locationQrCodeUrl}" alt="Location QR Code" style="max-width: 150px; height: auto; margin-bottom: 10px; border: 1px solid #e5e7eb; padding: 5px; background-color: #fff;" />
                      <p style="font-size: 14px; color: #6b7280; margin-bottom: 0;">Scan to open in Google Maps</p>
                    </td>
                    <td width="10" class="two-column" style="padding: 0; font-size: 0;">&nbsp;</td>
                    <td width="50%" align="center" class="two-column" style="padding: 15px; background-color: #fff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); vertical-align: top;">
                      <h3 style="color: #3b82f6; margin-top: 0; margin-bottom: 15px;">Quick Check-In</h3>
                      <img src="${checkInQrCodeUrl}" alt="Check-In QR Code" style="max-width: 150px; height: auto; margin-bottom: 10px; border: 1px solid #e5e7eb; padding: 5px; background-color: #fff;" />
                      <p style="font-size: 14px; color: #6b7280; margin-bottom: 0;">Show this code at the door for faster check-in</p>
                      <p style="font-size: 12px; color: #6b7280; margin-top: 5px; font-style: italic;">Your Check-in ID: ${checkInId}</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            
            <!-- Add to Calendar -->
            <tr>
              <td align="center" style="padding: 0 20px 20px 20px;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f0f9ff; border-radius: 8px;">
                  <tr>
                    <td align="center" style="padding: 20px;">
                      <h3 style="color: #3b82f6; margin-bottom: 15px;">Add to Calendar</h3>
                      <a href="data:text/calendar;charset=utf8,${encodedIcsContent}" download="${eventName.replace(/\\s+/g, '-')}.ics" class="button" style="display: inline-block; padding: 12px 24px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        📅 Add to Calendar
                      </a>
                      <p style="font-size: 14px; color: #6b7280; margin-top: 10px;">Works with Google Calendar, Apple Calendar, Outlook and more</p>
                      <p style="font-size: 12px; color: #6b7280; margin-top: 5px;">
                        Note: In Gmail, you may need to download the .ics file manually or use Google Calendar directly
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            
            <!-- Share with Friends -->
            <tr>
              <td align="center" style="padding: 0 20px 20px 20px;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f0f9ff; border-radius: 8px;">
                  <tr>
                    <td align="center" style="padding: 20px;">
                      <h3 style="color: #3b82f6; margin-bottom: 15px;">Share with Friends</h3>
                      
                      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 450px;">
                        <tr>
                          <!-- WhatsApp -->
                          <td align="center" style="padding: 5px;">
                            <a href="${whatsappShareUrl}" target="_blank" style="text-decoration: none; display: inline-block;">
                              <img src="${socialIcons.whatsapp}" width="40" height="40" alt="WhatsApp" style="display: block; width: 40px; height: 40px;" />
                              <span style="display: block; font-size: 12px; margin-top: 5px; color: #333;">WhatsApp</span>
                            </a>
                          </td>
                          
                          <!-- Facebook -->
                          <td align="center" style="padding: 5px;">
                            <a href="https://www.facebook.com/sharer/sharer.php?u=https://gategaborone.com/events" target="_blank" style="text-decoration: none; display: inline-block;">
                              <img src="${socialIcons.facebook}" width="40" height="40" alt="Facebook" style="display: block; width: 40px; height: 40px;" />
                              <span style="display: block; font-size: 12px; margin-top: 5px; color: #333;">Facebook</span>
                            </a>
                          </td>
                          
                          <!-- Twitter/X -->
                          <td align="center" style="padding: 5px;">
                            <a href="https://twitter.com/intent/tweet?text=Join%20me%20at%20${encodeURIComponent(eventName)}%20at%20Gate%20Gaborone!%20Register%20here:%20https://gategaborone.com/events" target="_blank" style="text-decoration: none; display: inline-block;">
                              <img src="${socialIcons.twitter}" width="40" height="40" alt="Twitter" style="display: block; width: 40px; height: 40px;" />
                              <span style="display: block; font-size: 12px; margin-top: 5px; color: #333;">Twitter/X</span>
                            </a>
                          </td>
                          
                          <!-- LinkedIn -->
                          <td align="center" style="padding: 5px;">
                            <a href="https://www.linkedin.com/sharing/share-offsite/?url=https://gategaborone.com/events" target="_blank" style="text-decoration: none; display: inline-block;">
                              <img src="${socialIcons.linkedin}" width="40" height="40" alt="LinkedIn" style="display: block; width: 40px; height: 40px;" />
                              <span style="display: block; font-size: 12px; margin-top: 5px; color: #333;">LinkedIn</span>
                            </a>
                          </td>
                          
                          <!-- TikTok -->
                          <td align="center" style="padding: 5px;">
                            <a href="https://www.tiktok.com/" target="_blank" style="text-decoration: none; display: inline-block;">
                              <img src="${socialIcons.tiktok}" width="40" height="40" alt="TikTok" style="display: block; width: 40px; height: 40px;" />
                              <span style="display: block; font-size: 12px; margin-top: 5px; color: #333;">TikTok</span>
                            </a>
                          </td>
                          
                          <!-- Email -->
                          <td align="center" style="padding: 5px;">
                            <a href="mailto:?subject=Join%20me%20at%20${encodeURIComponent(eventName)}&body=I'm%20attending%20${encodeURIComponent(eventName)}%20at%20Gate%20Gaborone%20on%20${encodeURIComponent(eventDate)}%20at%20${encodeURIComponent(eventTime)}.%20You%20should%20join%20too!%20Register%20here:%20https://gategaborone.com/events" style="text-decoration: none; display: inline-block;">
                              <img src="${socialIcons.email}" width="40" height="40" alt="Email" style="display: block; width: 40px; height: 40px;" />
                              <span style="display: block; font-size: 12px; margin-top: 5px; color: #333;">Email</span>
                            </a>
                          </td>
                        </tr>
                      </table>
                      
                      <p style="font-size: 14px; color: #6b7280; margin-top: 15px;">Invite friends and family to join you!</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            
            <!-- Follow Us -->
            <tr>
              <td align="center" style="padding: 0 20px 20px 20px;">
                <h3 style="color: #3b82f6; margin-bottom: 15px;">Follow Us</h3>
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 350px;">
                  <tr>
                    <td align="center" style="padding: 5px;">
                      <a href="https://www.facebook.com/GateGaborone" target="_blank" style="text-decoration: none; display: inline-block;">
                        <img src="${socialIcons.facebook}" width="40" height="40" alt="Facebook" style="display: block; width: 40px; height: 40px;" />
                      </a>
                    </td>
                    <td align="center" style="padding: 5px;">
                      <a href="https://www.instagram.com/gategaborone" target="_blank" style="text-decoration: none; display: inline-block;">
                        <img src="${socialIcons.instagram}" width="40" height="40" alt="Instagram" style="display: block; width: 40px; height: 40px;" />
                      </a>
                    </td>
                    <td align="center" style="padding: 5px;">
                      <a href="https://www.youtube.com/@GateGaborone" target="_blank" style="text-decoration: none; display: inline-block;">
                        <img src="${socialIcons.youtube}" width="40" height="40" alt="YouTube" style="display: block; width: 40px; height: 40px;" />
                      </a>
                    </td>
                    <td align="center" style="padding: 5px;">
                      <a href="https://twitter.com/GateGaborone" target="_blank" style="text-decoration: none; display: inline-block;">
                        <img src="${socialIcons.twitter}" width="40" height="40" alt="Twitter/X" style="display: block; width: 40px; height: 40px;" />
                      </a>
                    </td>
                    <td align="center" style="padding: 5px;">
                      <a href="https://www.tiktok.com/" target="_blank" style="text-decoration: none; display: inline-block;">
                        <img src="${socialIcons.tiktok}" width="40" height="40" alt="TikTok" style="display: block; width: 40px; height: 40px;" />
                      </a>
                    </td>
                  </tr>
                </table>
                <p style="font-size: 14px; color: #6b7280; margin-top: 5px;">Stay connected with Gate Gaborone</p>
              </td>
            </tr>
            
            <!-- Footer -->
            <tr>
              <td align="center" style="font-size: 14px; color: #6b7280; border-top: 1px solid #e5e7eb; padding: 20px;">
                <p>If you have any questions, please contact us at <a href="mailto:info@gategaborone.com" style="color: #3b82f6;">info@gategaborone.com</a></p>
                <p style="margin-bottom: 0;">© 2025 Gate Gaborone. All rights reserved.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
}
