
/**
 * Email service utility for sending notifications
 * 
 * Note: This is a mock implementation that logs to console
 * In a real app, it would connect to a backend service for sending emails
 */

// Email addresses for admin notifications
const ADMIN_EMAILS = ['otenggate@gmail.com'];

/**
 * Sends event registration notification to church admins
 */
export const sendEventRegistrationEmail = (eventName: string, registrantData: any) => {
  console.log(`[EMAIL SERVICE] Sending event registration notification for "${eventName}"`);
  console.log(`Recipients: ${ADMIN_EMAILS.join(', ')}`);
  console.log('Registration data:', registrantData);
  
  // In a real implementation, this would call an API to send the email
  // For now we just log it
  
  return {
    success: true,
    message: 'Email notification queued for sending'
  };
};

/**
 * Sends image upload notification to church admins
 */
export const sendImageUploadEmail = (imageName: string, category: string) => {
  console.log(`[EMAIL SERVICE] Sending image upload notification for "${imageName}" (${category})`);
  console.log(`Recipients: ${ADMIN_EMAILS.join(', ')}`);
  
  // In a real implementation, this would call an API to send the email
  // For now we just log it
  
  return {
    success: true,
    message: 'Email notification queued for sending'
  };
};

/**
 * Sends contact form submission notification to church admins
 */
export const sendContactFormEmail = (formData: any) => {
  console.log(`[EMAIL SERVICE] Sending contact form notification`);
  console.log(`Recipients: ${ADMIN_EMAILS.join(', ')}`);
  console.log('Form data:', formData);
  
  // In a real implementation, this would call an API to send the email
  // For now we just log it
  
  return {
    success: true,
    message: 'Email notification queued for sending'
  };
};
