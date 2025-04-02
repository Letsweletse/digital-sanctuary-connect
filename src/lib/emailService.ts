
/**
 * Email service utility for sending notifications
 * 
 * Note: This is a mock implementation that logs to console
 * In a real app, it would connect to a backend service for sending emails
 */

// Email address for admin notifications - exported for use in components
export const ADMIN_EMAIL = 'otenggate@gmail.com';
export const ADMIN_EMAILS = [ADMIN_EMAIL];

/**
 * Sends event registration notification to church admins
 */
export const sendEventRegistrationEmail = (eventName: string, registrantData: any) => {
  console.log(`[EMAIL SERVICE] Sending event registration notification for "${eventName}"`);
  console.log(`Recipients: ${ADMIN_EMAILS.join(', ')}`);
  console.log('Registration data:', registrantData);
  
  // In a production environment, you would:
  // 1. Connect to a real email service API (like SendGrid, Mailgun, etc.)
  // 2. Format the email with proper HTML templates
  // 3. Send the email to all admin recipients
  
  // For now, this is just a mock implementation that logs to console
  // To receive actual emails, you would need to:
  // 1. Set up a backend API endpoint (Node.js, Supabase Edge Functions, etc.)
  // 2. Connect that endpoint to an email service provider
  // 3. Call that endpoint from this function
  
  return {
    success: true,
    message: 'Email notification queued for sending',
    recipients: ADMIN_EMAILS,
    timestamp: new Date().toISOString()
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
