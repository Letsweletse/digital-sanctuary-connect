
/**
 * Email service utility for sending notifications
 * Using Supabase Edge Functions
 */

// Email address for admin notifications - exported for use in components
export const ADMIN_EMAIL = 'otenggate@gmail.com';
// Add additional recipient emails
export const BACKUP_EMAIL = 'info@gategaborone.com';
export const ZOHO_EMAIL = 'iblimenterprise@zohomail.com';
export const ADMIN_EMAILS = [ADMIN_EMAIL, BACKUP_EMAIL, ZOHO_EMAIL];

import { supabase } from "@/integrations/supabase/client";

/**
 * Base email sending function
 * @param requestBody - The email request data to send
 */
async function sendEmail(requestBody: any) {
  try {
    console.log("Invoking send-email function with data:", JSON.stringify(requestBody).substring(0, 200) + "...");
    
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: requestBody
    });
    
    if (error) {
      console.error('Error invoking send-email function:', error);
      return { success: false, message: error.message };
    }
    
    console.log("Email function response:", data);
    
    if (!data) {
      console.error('No data returned from send-email function');
      return { success: false, message: 'No response data from email service' };
    }
    
    return {
      success: true,
      message: 'Email sent successfully',
      data
    };
  } catch (invokeError) {
    console.error('Error in email service:', invokeError);
    return { 
      success: false, 
      message: invokeError instanceof Error ? invokeError.message : 'Unknown error occurred'
    };
  }
}

/**
 * Sends event registration notification to church admins
 */
export const sendEventRegistrationEmail = async (eventName: string, registrantData: any) => {
  try {
    console.log("Sending event registration email for:", eventName);
    console.log("Registration data:", registrantData);
    
    // Generate a unique check-in ID for this registration
    const checkInId = crypto.randomUUID();
    
    // Ensure we have all the required data for the enhanced confirmation email
    const eventLocation = registrantData.location || 'https://maps.app.goo.gl/mVLNzv5R2T8wQZNt7';
    const eventDate = registrantData.eventDate || '2025-05-10';
    const eventTime = registrantData.eventTime || '9:00 AM - 1:30 PM';
    const eventImage = registrantData.eventImage || 'https://lojchdvtwypjqupsjynf.supabase.co/storage/v1/object/public/images/leadership/POA_1743681812478.jpg';
    
    // Prepare the email request body with all required fields
    const emailRequestBody = {
      to: ADMIN_EMAILS,
      subject: `New Registration for ${eventName}`,
      name: registrantData.attendee.name,
      email: registrantData.attendee.email,
      title: registrantData.attendee.title,
      role: registrantData.attendee.role,
      denomination: registrantData.attendee.denomination,
      phone: registrantData.attendee.phone,
      message: registrantData.message || `numberOfAttendees: ${registrantData.attendee.numberOfAttendees}`,
      eventName: eventName,
      registrationType: registrantData.registrationType || 'Standard',
      sendConfirmation: true, // Always enable sending confirmation email to the registrant
      location: eventLocation,
      eventDate: eventDate,
      eventTime: eventTime,
      eventImage: eventImage,
      checkInId: checkInId, // Pass the unique check-in ID
      attendeeEmail: registrantData.attendee.email // Pass the attendee email for personalized check-in
    };
    
    console.log("Sending email with request body:", JSON.stringify(emailRequestBody).substring(0, 200) + "...");
    
    const result = await sendEmail(emailRequestBody);
    
    if (!result.success) {
      throw new Error(result.message || "Failed to send registration email");
    }
    
    return {
      success: true,
      message: 'Email notification and confirmation sent successfully',
      recipients: ADMIN_EMAILS,
      timestamp: new Date().toISOString(),
      data: result.data
    };
  } catch (error) {
    console.error('Error preparing event registration email:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

/**
 * Sends contact form submission notification to church admins
 */
export const sendContactFormEmail = async (formData: any) => {
  try {
    const emailRequestBody = {
      to: ADMIN_EMAILS,
      subject: 'New Contact Form Submission',
      name: formData.name,
      email: formData.email,
      message: formData.message
    };
    
    const result = await sendEmail(emailRequestBody);
    
    if (!result.success) {
      throw new Error(result.message || "Failed to send contact form email");
    }
    
    return {
      success: true,
      message: 'Email notification sent successfully',
      recipients: ADMIN_EMAILS,
      timestamp: new Date().toISOString(),
      data: result.data
    };
  } catch (error) {
    console.error('Error sending contact form email:', error);
    return {
      success: false, 
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

/**
 * Sends image upload notification to church admins
 */
export const sendImageUploadEmail = async (imageName: string, category: string) => {
  try {
    const emailRequestBody = {
      to: ADMIN_EMAILS,
      subject: 'New Image Uploaded',
      name: 'System',
      email: 'info@gategaborone.com',
      message: `A new image "${imageName}" has been uploaded in the ${category} category.`
    };
    
    const result = await sendEmail(emailRequestBody);
    
    if (!result.success) {
      throw new Error(result.message || "Failed to send image upload email");
    }
    
    return {
      success: true,
      message: 'Email notification sent successfully',
      data: result.data
    };
  } catch (error) {
    console.error('Error sending image upload email:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};
