
import { AdminEmailProps, ConfirmationEmailProps } from "../types/emailTypes.ts";
import { generateAdminEmailContent } from "./components/adminEmail.ts";
import { renderEmailHeader } from "./components/emailHeader.ts";
import { renderEventDetails } from "./components/eventDetails.ts";
import { renderQrCodes } from "./components/qrCodes.ts";
import { renderCalendarAdd } from "./components/calendarAdd.ts";
import { 
  getSocialIcons, 
  renderShareWithFriends, 
  renderFollowUs 
} from "./components/socialShare.ts";
import { renderEmailFooter } from "./components/emailFooter.ts";
import { getEmailWrapper } from "./components/emailStyles.ts";

export { generateAdminEmailContent };

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
  
  // Get social media icons
  const socialIcons = getSocialIcons();
  
  // Build email content from components
  const headerContent = renderEmailHeader(logoUrl, eventName, eventImage);
  
  const eventDetailsContent = renderEventDetails({
    eventName,
    eventDate,
    eventTime,
    registrationType,
    role,
    denomination,
    phone,
    location,
    checkInId
  });
  
  const qrCodesContent = renderQrCodes({
    locationQrCodeUrl,
    checkInQrCodeUrl,
    checkInId,
    location
  });
  
  const calendarContent = renderCalendarAdd(encodedIcsContent, eventName);
  
  const shareContent = renderShareWithFriends({
    eventName,
    eventDate,
    eventTime,
    whatsappShareUrl,
    socialIcons
  });
  
  const followUsContent = renderFollowUs(socialIcons);
  
  const footerContent = renderEmailFooter();
  
  // Combine all content sections - ensure proper HTML structure and nesting
  const emailContent = `
    ${headerContent}
    
    <!-- Confirmation Message -->
    <tr>
      <td style="padding: 20px;">
        <h2 style="margin: 0 0 15px 0; font-size: 22px; color: #3b82f6; text-align: center;">Registration Confirmation</h2>
        <p style="margin-bottom: 15px;">Dear ${title} ${name},</p>
        <p style="margin-bottom: 20px;">Thank you for registering for <strong>${eventName}</strong>.</p>
      </td>
    </tr>
    
    ${eventDetailsContent}
    ${qrCodesContent}
    ${calendarContent}
    ${shareContent}
    ${followUsContent}
    ${footerContent}
  `;
  
  // Wrap the email content with the HTML structure and styles
  return getEmailWrapper(emailContent);
}
