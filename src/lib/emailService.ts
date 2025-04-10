
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
 * Sends event registration notification to church admins
 */
export const sendEventRegistrationEmail = async (eventName: string, registrantData: any) => {
  try {
    console.log("Sending event registration email for:", eventName);
    console.log("Registration data:", registrantData);
    
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: {
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
        sendConfirmation: true, // Enable sending confirmation email to the registrant
        location: registrantData.location || 'https://maps.app.goo.gl/mVLNzv5R2T8wQZNt7',
        eventDate: registrantData.eventDate || '2025-05-10',
        eventTime: registrantData.eventTime || '9:00 AM - 1:30 PM',
        eventImage: registrantData.eventImage || 'https://lojchdvtwypjqupsjynf.supabase.co/storage/v1/object/public/images/leadership/POA_1743681812478.jpg'
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
      timestamp: new Date().toISOString(),
      data
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
