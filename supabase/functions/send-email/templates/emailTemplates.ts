
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
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
      <h1 style="color: #3b82f6;">New Conference Registration</h1>
      <table style="width: 100%;">
        <tr><td><strong>Conference:</strong></td><td>${eventName}</td></tr>
        <tr><td><strong>Registration Type:</strong></td><td>${registrationType}</td></tr>
        <tr><td><strong>Title:</strong></td><td>${title}</td></tr>
        <tr><td><strong>Name:</strong></td><td>${name}</td></tr>
        <tr><td><strong>Email:</strong></td><td>${email}</td></tr>
        <tr><td><strong>Phone:</strong></td><td>${phone}</td></tr>
        <tr><td><strong>Role:</strong></td><td>${role}</td></tr>
        <tr><td><strong>Denomination:</strong></td><td>${denomination}</td></tr>
        <tr><td><strong>Message:</strong></td><td>${message}</td></tr>
        <tr><td><strong>Check-in ID:</strong></td><td>${checkInId}</td></tr>
        <tr><td><strong>Check-in Link:</strong></td><td><a href="https://www.gategaborone.com/check-in/${checkInId}">View Check-in</a></td></tr>
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
  whatsappShareUrl,
  churchLogo = 'https://lojchdvtwypjqupsjynf.supabase.co/storage/v1/object/public/images/general/gate-logo.png'
}: ConfirmationEmailProps): string {
  const churchUrl = "https://www.gategaborone.com"; // Ensure using www subdomain
  const shareTextBase = `Join me at ${eventName} at Gate Gaborone on July 3-5, 2025 at Travelodge Conference Centre, Gaborone.`;
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
    <p style="margin-bottom: 15px;">Thank you for registering for <strong>${eventName}</strong>.</p>
    
    <div style="background-color: #f0f9ff; border-left: 4px solid #3b82f6; padding: 15px; margin-bottom: 20px; border-radius: 4px;">
      <h3 style="color: #3b82f6; margin-top: 0; margin-bottom: 10px;">Conference Details</h3>
      <ul style="padding-left: 20px; margin-bottom: 0;">
        <li style="margin-bottom: 8px;"><strong>Conference:</strong> ${eventName}</li>
        <li style="margin-bottom: 8px;"><strong>Dates:</strong> July 3-5, 2025</li>
        <li style="margin-bottom: 8px;"><strong>Schedule:</strong></li>
        <ul style="padding-left: 20px; margin-top: 5px;">
          <li style="margin-bottom: 4px;">Thursday Evening: Session 1 (18:00–20:30)</li>
          <li style="margin-bottom: 4px;">Friday Morning: Sessions 2–4 (08:30–13:30)</li>
          <li style="margin-bottom: 4px;">Friday Evening: Session 5 (18:00–20:30)</li>
          <li style="margin-bottom: 4px;">Saturday Morning: Sessions 6–8 (08:30–13:30)</li>
        </ul>
        <li style="margin-bottom: 8px;"><strong>Registration Type:</strong> ${registrationType}</li>
        <li style="margin-bottom: 8px;"><strong>Role:</strong> ${role}</li>
        <li style="margin-bottom: 8px;"><strong>Denomination:</strong> ${denomination}</li>
        <li style="margin-bottom: 8px;"><strong>Phone:</strong> ${phone}</li>
        <li style="margin-bottom: 8px;"><strong>Location:</strong> <a href="https://maps.app.goo.gl/Y5BPKfURyqQJ8EuXA" style="color: #3b82f6;">Travelodge Conference Centre, Gaborone</a></li>
        <li style="margin-bottom: 8px;"><strong>Registration Fee:</strong> P250</li>
        <li style="margin-bottom: 8px;"><strong>Check-in ID:</strong> ${checkInId}</li>
        <li style="margin-bottom: 8px;"><strong>Check-in Link:</strong> <a href="${checkInUrl}" style="color: #3b82f6;">Quick Check-in Portal</a></li>
      </ul>
    </div>

    <div style="display: flex; justify-content: space-between; margin-bottom: 30px; flex-wrap: wrap; gap: 20px;">
      <div style="flex: 1; min-width: 250px; text-align: center; padding: 15px; background-color: #fff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h3 style="color: #3b82f6; margin-top: 0; margin-bottom: 15px;">Conference Location</h3>
        <img src="${locationQrCodeUrl}" alt="Location QR Code" style="max-width: 180px; height: auto; margin-bottom: 10px; border: 1px solid #e5e7eb; padding: 5px; background-color: #fff;" />
        <p style="font-size: 14px; color: #6b7280; margin-bottom: 0;">Scan to open in Google Maps</p>
        <p style="font-size: 12px; color: #6b7280; margin-top: 5px;">Travelodge Conference Centre, Gaborone</p>
      </div>
      
      <div style="flex: 1; min-width: 250px; text-align: center; padding: 15px; background-color: #fff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h3 style="color: #3b82f6; margin-top: 0; margin-bottom: 15px;">Quick Check-In</h3>
        <img src="${checkInQrCodeUrl}" alt="Check-In QR Code" style="max-width: 180px; height: auto; margin-bottom: 10px; border: 1px solid #e5e7eb; padding: 5px; background-color: #fff;" />
        <p style="font-size: 14px; color: #6b7280; margin-bottom: 0;">Show this code at registration for faster check-in</p>
        <p style="font-size: 12px; color: #6b7280; margin-top: 5px; font-style: italic;">Your Check-in ID: ${checkInId}</p>
        <p style="font-size: 14px; margin-top: 10px;"><a href="${checkInUrl}" style="color: #3b82f6; text-decoration: underline;">Access Your Check-in Portal</a></p>
      </div>
    </div>

    <div style="text-align: center; margin-bottom: 30px; padding: 20px; background-color: #f0f9ff; border-radius: 8px;">
      <h3 style="color: #3b82f6; margin-bottom: 15px;">Add to Calendar</h3>
      <a href="data:text/calendar;charset=utf8,${encodedIcsContent}" download="${eventName.replace(/\\s+/g, '-')}.ics" style="display: inline-block; padding: 12px 24px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        📅 Add to Calendar
      </a>
      <p style="font-size: 14px; color: #6b7280; margin-top: 10px;">Works with Google Calendar, Apple Calendar, Outlook and more</p>
      <p style="font-size: 12px; color: #6b7280; margin-top: 5px;">
        Note: In Gmail, you may need to download the .ics file manually
      </p>
    </div>

    <div style="text-align: center; margin-bottom: 30px; padding: 20px; background-color: #f0f9ff; border-radius: 8px;">
      <h3 style="color: #3b82f6; margin-bottom: 15px;">Share with Friends</h3>
      
      <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; margin-bottom: 15px;">
        <!-- WhatsApp -->
        <a href="${whatsappShareUrl || `https://api.whatsapp.com/send?text=${encodeURIComponent(shareTextBase + ` Register here: ${churchUrl}/events`)}`}" target="_blank" style="display: inline-flex; align-items: center; padding: 10px 15px; background-color: #25D366; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#ffffff" style="margin-right: 8px;">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
          WhatsApp
        </a>
        
        <!-- Facebook -->
        <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${churchUrl}/events`)}" target="_blank" style="display: inline-flex; align-items: center; padding: 10px 15px; background-color: #3b5998; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#ffffff" style="margin-right: 8px;">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
          Facebook
        </a>
        
        <!-- Twitter/X -->
        <a href="https://twitter.com/intent/tweet?text=${encodeURIComponent(`${shareTextBase} Register here: ${churchUrl}/events`)}" target="_blank" style="display: inline-flex; align-items: center; padding: 10px 15px; background-color: #000000; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#ffffff" style="margin-right: 8px;">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
          Twitter/X
        </a>
        
        <!-- LinkedIn -->
        <a href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`${churchUrl}/events`)}" target="_blank" style="display: inline-flex; align-items: center; padding: 10px 15px; background-color: #0077b5; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#ffffff" style="margin-right: 8px;">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
          LinkedIn
        </a>
        
        <!-- Email -->
        <a href="mailto:?subject=${encodeURIComponent(eventName)}&body=${encodeURIComponent(`${shareTextBase} Register here: ${churchUrl}/events`)}" style="display: inline-flex; align-items: center; padding: 10px 15px; background-color: #718096; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#ffffff" style="margin-right: 8px;">
            <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z"/>
            <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z"/>
          </svg>
          Email
        </a>
      </div>
      
      <p style="font-size: 14px; color: #6b7280; margin-top: 10px;">Invite friends and family to join you at this transformative conference!</p>
    </div>
    
    <div style="text-align: center; margin-bottom: 30px;">
      <h3 style="color: #3b82f6; margin-bottom: 15px;">Follow Us</h3>
      <div style="display: flex; justify-content: center; gap: 15px; margin-bottom: 10px;">
        <!-- Facebook -->
        <a href="https://www.facebook.com/profile.php?id=61575319345710" target="_blank" style="display: inline-block; padding: 10px; background-color: #3b5998; color: white; border-radius: 50%; width: 40px; height: 40px; text-align: center; line-height: 20px;">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#ffffff">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        </a>
        
        <!-- Instagram -->
        <a href="https://www.instagram.com/gategaborone" target="_blank" style="display: inline-block; padding: 10px; background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%); color: white; border-radius: 50%; width: 40px; height: 40px; text-align: center; line-height: 20px;">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#ffffff">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
          </svg>
        </a>
        
        <!-- YouTube -->
        <a href="https://www.youtube.com/@gategaboronebotswana2702" target="_blank" style="display: inline-block; padding: 10px; background-color: #FF0000; color: white; border-radius: 50%; width: 40px; height: 40px; text-align: center; line-height: 20px;">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#ffffff">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
        </a>
        
        <!-- Twitter/X -->
        <a href="https://twitter.com/GateGaborone" target="_blank" style="display: inline-block; padding: 10px; background-color: #000000; color: white; border-radius: 50%; width: 40px; height: 40px; text-align: center; line-height: 20px;">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#ffffff">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        </a>
      </div>
      <p style="font-size: 14px; color: #6b7280; margin-top: 5px;">Stay connected with Gate Gaborone</p>
    </div>
    
    <div style="text-align: center; font-size: 14px; color: #6b7280; border-top: 1px solid #e5e7eb; padding-top: 20px;">
      <p>If you have any questions, please contact us at <a href="mailto:info@gategaborone.com" style="color: #3b82f6;">info@gategaborone.com</a></p>
      <p style="margin-bottom: 0;">© 2025 Gate Gaborone. All rights reserved.</p>
    </div>
  </div>
  `;
}
