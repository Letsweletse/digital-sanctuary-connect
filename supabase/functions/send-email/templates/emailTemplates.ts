
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
  // Using absolute URLs for all images to ensure email client compatibility
  const logoUrl = "https://lojchdvtwypjqupsjynf.supabase.co/storage/v1/object/public/images/general/gate-logo.png";
  
  // Social media icons with secure, reliable CDN URLs
  const socialIcons = {
    whatsapp: "https://cdn-icons-png.flaticon.com/512/3670/3670051.png",
    facebook: "https://cdn-icons-png.flaticon.com/512/5968/5968764.png",
    twitter: "https://cdn-icons-png.flaticon.com/512/5968/5968958.png", 
    linkedin: "https://cdn-icons-png.flaticon.com/512/3536/3536505.png",
    email: "https://cdn-icons-png.flaticon.com/512/561/561127.png",
    youtube: "https://cdn-icons-png.flaticon.com/512/1384/1384060.png",
    instagram: "https://cdn-icons-png.flaticon.com/512/2111/2111463.png",
    tiktok: "https://cdn-icons-png.flaticon.com/512/3046/3046121.png"
  };

  return `
  <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
  <html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>Registration Confirmation</title>
    <!--[if mso]>
    <style type="text/css">
      .fallback-text {
        font-family: Arial, sans-serif;
      }
    </style>
    <![endif]-->
    <style type="text/css">
      /* Base styles for better email compatibility */
      body, html {
        margin: 0;
        padding: 0;
        width: 100% !important;
        font-family: 'Segoe UI', Arial, sans-serif;
        line-height: 1.5;
        color: #333333;
      }
      table {
        border-spacing: 0;
        border-collapse: collapse;
        mso-table-lspace: 0pt;
        mso-table-rspace: 0pt;
        width: 100%;
      }
      table td {
        padding: 0;
        vertical-align: top;
        word-break: break-word; /* For long text handling */
      }
      img {
        -ms-interpolation-mode: bicubic;
        border: 0;
        height: auto;
        line-height: 100%;
        outline: none;
        text-decoration: none;
        display: block;
      }
      p {
        margin: 0 0 15px 0;
      }
      .wrapper {
        width: 100%;
        table-layout: fixed;
        background-color: #f8fafc;
        padding: 20px 0;
      }
      .main-table {
        width: 100%;
        max-width: 600px;
        margin: 0 auto;
        background-color: #ffffff;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 4px 6px rgba(0,0,0,0.05);
      }
      .header {
        background-color: #ffffff;
        padding: 20px;
        text-align: center;
      }
      .content {
        padding: 20px;
      }
      .section {
        margin-bottom: 20px;
      }
      .blue-text {
        color: #3b82f6;
      }
      .button {
        display: inline-block;
        background-color: #3b82f6;
        color: #ffffff !important;
        text-decoration: none;
        font-weight: bold;
        padding: 12px 24px;
        border-radius: 6px;
        text-align: center;
        mso-padding-alt: 12px 24px;
      }
      .social-icon {
        width: 40px;
        height: 40px;
        display: inline-block;
        margin: 0 5px;
      }
      .footer {
        background-color: #f8fafc;
        padding: 20px;
        text-align: center;
        font-size: 14px;
        color: #6b7280;
      }
      .data-table {
        width: 100%;
        background-color: #f0f9ff;
        border-left: 4px solid #3b82f6;
        border-radius: 4px;
        overflow: hidden;
      }
      .data-table td {
        padding: 8px;
        border-bottom: 1px solid #e5e7eb;
        word-break: break-word;
      }
      .data-table tr:last-child td {
        border-bottom: none;
      }
      /* For all clients */
      .qr-code-container {
        background-color: #ffffff;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        padding: 15px;
        text-align: center;
        vertical-align: top;
      }
      .qr-code {
        max-width: 150px;
        height: auto;
        margin: 0 auto 10px auto;
        border: 1px solid #e5e7eb;
        padding: 5px;
        background-color: #fff;
        display: inline-block;
      }
      .social-container {
        background-color: #f0f9ff;
        border-radius: 8px;
        padding: 20px;
        text-align: center;
      }
      .social-button {
        display: inline-block;
        text-align: center;
        margin: 5px;
      }
      /* Mobile responsiveness */
      @media screen and (max-width: 600px) {
        .main-table {
          width: 100% !important;
        }
        .two-column {
          width: 100% !important;
          display: block !important;
        }
        .two-column-spacer {
          display: none !important;
        }
        .qr-code-container {
          margin-bottom: 20px;
        }
      }
    </style>
  </head>
  <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: 'Segoe UI', Arial, sans-serif;">
    <!-- Email Wrapper -->
    <table class="wrapper" width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td align="center" valign="top">
          <!-- Main Email Container -->
          <table class="main-table" width="600" cellpadding="0" cellspacing="0" border="0" style="border: 1px solid #eaeaea; border-radius: 8px; overflow: hidden;">
            <!-- Header with Logo -->
            <tr>
              <td class="header" align="center" style="padding: 20px; background-color: #ffffff;">
                <img src="${logoUrl}" alt="Gate Gaborone" width="180" style="max-width: 180px; height: auto; display: block; margin: 0 auto;" />
              </td>
            </tr>
            
            <!-- Event Header -->
            <tr>
              <td align="center" style="background-color: #f0f9ff; padding: 20px 20px 10px 20px;">
                <h1 style="margin: 0; font-size: 24px; color: #000000; text-align: center;">${eventName}</h1>
              </td>
            </tr>
            
            <!-- Event Image -->
            <tr>
              <td align="center" style="padding: 0 20px 20px 20px; background-color: #f0f9ff;">
                <img src="${eventImage}" alt="${eventName}" width="560" style="max-width: 100%; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);" />
              </td>
            </tr>
            
            <!-- Confirmation Message -->
            <tr>
              <td class="content" style="padding: 20px;">
                <h2 style="margin: 0 0 15px 0; font-size: 22px; color: #3b82f6; text-align: center;">Registration Confirmation</h2>
                <p style="margin-bottom: 15px;">Dear ${title} ${name},</p>
                <p style="margin-bottom: 20px;">Thank you for registering for <strong>${eventName}</strong>.</p>
                
                <!-- Event Details Table -->
                <table class="data-table" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 25px;">
                  <tr>
                    <td colspan="2" style="padding: 10px; background-color: #f0f9ff;">
                      <h3 style="margin: 0; font-size: 18px; color: #3b82f6;">Event Details</h3>
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
              <td style="padding: 0 20px 20px 20px;">
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <!-- Location QR Code -->
                    <td class="two-column" width="48%" style="vertical-align: top;">
                      <table class="qr-code-container" width="100%" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          <td align="center">
                            <h3 style="margin: 0 0 15px 0; font-size: 18px; color: #3b82f6;">Event Location</h3>
                            <img src="${locationQrCodeUrl}" alt="Location QR Code" class="qr-code" width="150" />
                            <p style="font-size: 14px; color: #6b7280; margin: 0;">Scan to open in Google Maps</p>
                          </td>
                        </tr>
                      </table>
                    </td>
                    
                    <!-- Spacer for desktop view -->
                    <td class="two-column-spacer" width="4%">&nbsp;</td>
                    
                    <!-- Check-in QR Code -->
                    <td class="two-column" width="48%" style="vertical-align: top;">
                      <table class="qr-code-container" width="100%" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          <td align="center">
                            <h3 style="margin: 0 0 15px 0; font-size: 18px; color: #3b82f6;">Quick Check-In</h3>
                            <img src="${checkInQrCodeUrl}" alt="Check-In QR Code" class="qr-code" width="150" />
                            <p style="font-size: 14px; color: #6b7280; margin: 0;">Show this code at the door for faster check-in</p>
                            <p style="font-size: 12px; color: #6b7280; margin-top: 5px; font-style: italic;">Your Check-in ID: ${checkInId}</p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            
            <!-- Add to Calendar -->
            <tr>
              <td style="padding: 0 20px 20px 20px;">
                <table class="social-container" width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td align="center" style="padding: 20px;">
                      <h3 style="margin: 0 0 15px 0; font-size: 18px; color: #3b82f6;">Add to Calendar</h3>
                      <a href="data:text/calendar;charset=utf8,${encodedIcsContent}" download="${eventName.replace(/\s+/g, '-')}.ics" class="button" style="display: inline-block; padding: 12px 24px; background-color: #3b82f6; color: white !important; text-decoration: none; border-radius: 6px; font-weight: bold;">
                        📅 Add to Calendar
                      </a>
                      <p style="font-size: 14px; color: #6b7280; margin-top: 10px;">Works with Google Calendar, Apple Calendar, Outlook and more</p>
                      <p style="font-size: 12px; color: #6b7280; margin-top: 5px;">
                        Gmail users: Right-click the button, select "Save link as..." to download the .ics file, then import it to your calendar
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            
            <!-- Share with Friends -->
            <tr>
              <td style="padding: 0 20px 20px 20px;">
                <table class="social-container" width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td align="center" style="padding: 20px;">
                      <h3 style="margin: 0 0 15px 0; font-size: 18px; color: #3b82f6;">Share with Friends</h3>
                      
                      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 450px;">
                        <tr>
                          <!-- WhatsApp -->
                          <td align="center" style="padding: 5px; width: 16.66%;">
                            <a href="${whatsappShareUrl}" target="_blank" style="text-decoration: none; display: inline-block;">
                              <img src="${socialIcons.whatsapp}" alt="WhatsApp" width="40" height="40" style="display: block; width: 40px; max-width: 40px; height: 40px;" />
                              <span style="display: block; font-size: 12px; margin-top: 5px; color: #333333;">WhatsApp</span>
                            </a>
                          </td>
                          
                          <!-- Facebook -->
                          <td align="center" style="padding: 5px; width: 16.66%;">
                            <a href="https://www.facebook.com/sharer/sharer.php?u=https://gategaborone.com/events" target="_blank" style="text-decoration: none; display: inline-block;">
                              <img src="${socialIcons.facebook}" alt="Facebook" width="40" height="40" style="display: block; width: 40px; max-width: 40px; height: 40px;" />
                              <span style="display: block; font-size: 12px; margin-top: 5px; color: #333333;">Facebook</span>
                            </a>
                          </td>
                          
                          <!-- Twitter/X -->
                          <td align="center" style="padding: 5px; width: 16.66%;">
                            <a href="https://twitter.com/intent/tweet?text=Join%20me%20at%20${encodeURIComponent(eventName)}%20at%20Gate%20Gaborone!%20Register%20here:%20https://gategaborone.com/events" target="_blank" style="text-decoration: none; display: inline-block;">
                              <img src="${socialIcons.twitter}" alt="Twitter" width="40" height="40" style="display: block; width: 40px; max-width: 40px; height: 40px;" />
                              <span style="display: block; font-size: 12px; margin-top: 5px; color: #333333;">Twitter/X</span>
                            </a>
                          </td>
                          
                          <!-- LinkedIn -->
                          <td align="center" style="padding: 5px; width: 16.66%;">
                            <a href="https://www.linkedin.com/sharing/share-offsite/?url=https://gategaborone.com/events" target="_blank" style="text-decoration: none; display: inline-block;">
                              <img src="${socialIcons.linkedin}" alt="LinkedIn" width="40" height="40" style="display: block; width: 40px; max-width: 40px; height: 40px;" />
                              <span style="display: block; font-size: 12px; margin-top: 5px; color: #333333;">LinkedIn</span>
                            </a>
                          </td>
                          
                          <!-- TikTok -->
                          <td align="center" style="padding: 5px; width: 16.66%;">
                            <a href="https://www.tiktok.com/" target="_blank" style="text-decoration: none; display: inline-block;">
                              <img src="${socialIcons.tiktok}" alt="TikTok" width="40" height="40" style="display: block; width: 40px; max-width: 40px; height: 40px;" />
                              <span style="display: block; font-size: 12px; margin-top: 5px; color: #333333;">TikTok</span>
                            </a>
                          </td>
                          
                          <!-- Email -->
                          <td align="center" style="padding: 5px; width: 16.66%;">
                            <a href="mailto:?subject=Join%20me%20at%20${encodeURIComponent(eventName)}&body=I'm%20attending%20${encodeURIComponent(eventName)}%20at%20Gate%20Gaborone%20on%20${encodeURIComponent(eventDate)}%20at%20${encodeURIComponent(eventTime)}.%20You%20should%20join%20too!%20Register%20here:%20https://gategaborone.com/events" style="text-decoration: none; display: inline-block;">
                              <img src="${socialIcons.email}" alt="Email" width="40" height="40" style="display: block; width: 40px; max-width: 40px; height: 40px;" />
                              <span style="display: block; font-size: 12px; margin-top: 5px; color: #333333;">Email</span>
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
              <td style="padding: 0 20px 20px 20px;">
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td align="center">
                      <h3 style="margin: 0 0 15px 0; font-size: 18px; color: #3b82f6;">Follow Us</h3>
                      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 300px;">
                        <tr>
                          <td align="center" style="padding: 5px;">
                            <a href="https://www.facebook.com/GateGaborone" target="_blank" style="text-decoration: none;">
                              <img src="${socialIcons.facebook}" width="40" height="40" alt="Facebook" style="display: block; width: 40px; height: 40px;" />
                            </a>
                          </td>
                          <td align="center" style="padding: 5px;">
                            <a href="https://www.instagram.com/gategaborone" target="_blank" style="text-decoration: none;">
                              <img src="${socialIcons.instagram}" width="40" height="40" alt="Instagram" style="display: block; width: 40px; height: 40px;" />
                            </a>
                          </td>
                          <td align="center" style="padding: 5px;">
                            <a href="https://www.youtube.com/@GateGaborone" target="_blank" style="text-decoration: none;">
                              <img src="${socialIcons.youtube}" width="40" height="40" alt="YouTube" style="display: block; width: 40px; height: 40px;" />
                            </a>
                          </td>
                          <td align="center" style="padding: 5px;">
                            <a href="https://twitter.com/GateGaborone" target="_blank" style="text-decoration: none;">
                              <img src="${socialIcons.twitter}" width="40" height="40" alt="Twitter/X" style="display: block; width: 40px; height: 40px;" />
                            </a>
                          </td>
                          <td align="center" style="padding: 5px;">
                            <a href="https://www.tiktok.com/" target="_blank" style="text-decoration: none;">
                              <img src="${socialIcons.tiktok}" width="40" height="40" alt="TikTok" style="display: block; width: 40px; height: 40px;" />
                            </a>
                          </td>
                        </tr>
                      </table>
                      <p style="font-size: 14px; color: #6b7280; margin-top: 5px;">Stay connected with Gate Gaborone</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            
            <!-- Footer -->
            <tr>
              <td class="footer" style="padding: 20px; text-align: center; font-size: 14px; color: #6b7280; border-top: 1px solid #e5e7eb;">
                <p style="margin-bottom: 10px;">If you have any questions, please contact us at <a href="mailto:info@gategaborone.com" style="color: #3b82f6;">info@gategaborone.com</a></p>
                <p style="margin: 0;">© 2025 Gate Gaborone. All rights reserved.</p>
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
