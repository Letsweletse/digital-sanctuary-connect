
/**
 * Email service utility for sending notifications
 * Using Supabase Edge Functions
 */

// Email address for admin notifications - exported for use in components
export const ADMIN_EMAIL = 'otenggate@gmail.com';
export const ADMIN_EMAILS = [ADMIN_EMAIL];

import { supabase } from "@/integrations/supabase/client";

/**
 * Sends event registration notification to church admins
 */
export const sendEventRegistrationEmail = async (eventName: string, registrantData: any) => {
  try {
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: {
        to: ADMIN_EMAILS,
        subject: `New Registration for ${eventName}`,
        name: registrantData.attendee.name,
        email: registrantData.attendee.email,
        message: registrantData.message || `numberOfAttendees: ${registrantData.attendee.numberOfAttendees}`,
        eventName: eventName,
        registrationType: registrantData.registrationType || 'Standard',
        sendConfirmation: true // Enable sending confirmation email to the registrant
      }
    });
    
    if (error) {
      console.error('Error sending event registration email:', error);
      return { success: false, message: error.message };
    }
    
    return {
      success: true,
      message: 'Email notification and confirmation sent successfully',
      recipients: ADMIN_EMAILS,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error sending event registration email:', error);
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
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: {
        to: ADMIN_EMAILS,
        subject: 'New Contact Form Submission',
        name: formData.name,
        email: formData.email,
        message: formData.message
      }
    });
    
    if (error) {
      console.error('Error sending contact form email:', error);
      return { success: false, message: error.message };
    }
    
    return {
      success: true,
      message: 'Email notification sent successfully',
      recipients: ADMIN_EMAILS,
      timestamp: new Date().toISOString()
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
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: {
        to: ADMIN_EMAILS,
        subject: 'New Image Uploaded',
        name: 'System',
        email: 'info@gategaborone.com',
        message: `A new image "${imageName}" has been uploaded in the ${category} category.`
      }
    });
    
    if (error) {
      console.error('Error sending image upload email:', error);
      return { success: false, message: error.message };
    }
    
    return {
      success: true,
      message: 'Email notification sent successfully'
    };
  } catch (error) {
    console.error('Error sending image upload email:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};
