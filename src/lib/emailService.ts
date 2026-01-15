
import { supabase } from "@/integrations/supabase/client";

// Admin email addresses for notifications
export const ADMIN_EMAILS = [
  'info@gategaborone.com',
  'blimenterprise@zohomail.com'
];

// Core email sending function with improved error handling
const sendEmail = async (emailData: any) => {
  console.log('📧 [Email Service] Sending email with data:', emailData);
  
  try {
    // Call the Supabase edge function with timeout
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: emailData,
    });

    if (error) {
      console.error('❌ [Email Service] Error invoking send-email function:', error);
      throw error;
    }

    console.log('✅ [Email Service] Email sent successfully:', data);
    return {
      success: true,
      data: data,
      message: 'Email sent successfully'
    };
  } catch (error) {
    console.error('💥 [Email Service] Error in sendEmail:', error);
    throw error;
  }
};

// Send event registration email with improved data handling
export const sendEventRegistrationEmail = async (eventTitle: string, registrationData: any) => {
  console.log('📧 [Email Service] Sending event registration email for:', eventTitle);
  console.log('👤 [Email Service] Registration data:', registrationData);
  
  try {
    // Generate a unique check-in ID
    const checkInId = crypto.randomUUID();
    console.log('🆔 [Email Service] Generated check-in ID:', checkInId);
    
    // Prepare the email request body with all required fields
    const emailRequestBody = {
      to: [
        ...ADMIN_EMAILS,
        registrationData.attendee.email
      ],
      subject: `New Registration for ${eventTitle}`,
      name: registrationData.attendee.name,
      email: registrationData.attendee.email,
      title: registrationData.attendee.title || 'Mr',
      role: registrationData.attendee.role || 'Individual',
      denomination: registrationData.attendee.denomination || 'N/A',
      phone: registrationData.attendee.phone || 'N/A',
      message: registrationData.message || 'No additional message',
      eventName: eventTitle,
      registrationType: registrationData.registrationType || 'Standard',
      sendConfirmation: true,
      location: registrationData.location || 'TBD',
      eventDate: registrationData.eventDate || 'TBD',
      eventTime: registrationData.eventTime || 'TBD',
      eventImage: registrationData.eventImage || '',
      checkInId: checkInId,
      attendeeEmail: registrationData.attendee.email,
      churchLogo: 'https://lojchdvtwypjqupsjynf.supabase.co/storage/v1/object/public/images/general/gate-logo.png'
    };

    console.log('📤 [Email Service] Prepared email request body:', emailRequestBody);
    console.log('🚀 [Email Service] Calling Supabase function with request body:', emailRequestBody);
    
    const result = await sendEmail(emailRequestBody);
    
    // Return successful result with check-in information
    return {
      success: true,
      data: {
        ...result.data,
        checkInId: checkInId,
        checkInUrl: `https://gategaborone.com/check-in/${checkInId}`
      },
      recipients: emailRequestBody.to,
      message: 'Event registration email sent successfully'
    };
    
  } catch (error) {
    console.error('💥 [Email Service] Error preparing event registration email:', error);
    throw new Error(error instanceof Error ? error.message : 'Unknown email service error');
  }
};

// Simple contact form email
export const sendContactEmail = async (contactData: any) => {
  try {
    const emailData = {
      to: ADMIN_EMAILS,
      subject: `New Contact Form Submission from ${contactData.name}`,
      name: contactData.name,
      email: contactData.email,
      message: contactData.message,
      sendConfirmation: false,
      phone: contactData.phone || 'Not provided'
    };

    const result = await sendEmail(emailData);
    return {
      success: true,
      message: 'Contact email sent successfully',
      data: result.data
    };
  } catch (error) {
    console.error('Error sending contact email:', error);
    throw error;
  }
};

// Newsletter subscription email
export const sendNewsletterSubscriptionEmail = async (subscriberData: any) => {
  try {
    const emailData = {
      to: [...ADMIN_EMAILS, subscriberData.email],
      subject: 'Welcome to Gate Gaborone Newsletter',
      name: subscriberData.name || subscriberData.email,
      email: subscriberData.email,
      message: 'Thank you for subscribing to our newsletter!',
      sendConfirmation: true
    };

    const result = await sendEmail(emailData);
    return {
      success: true,
      message: 'Newsletter subscription email sent successfully',
      data: result.data
    };
  } catch (error) {
    console.error('Error sending newsletter subscription email:', error);
    throw error;
  }
};

// Image upload notification email
export const sendImageUploadEmail = async (fileName: string, category: string) => {
  try {
    const emailData = {
      to: ADMIN_EMAILS,
      subject: `New Image Uploaded - ${category}`,
      name: 'System',
      email: 'system@gategaborone.com',
      message: `A new image has been uploaded to the ${category} category: ${fileName}`,
      sendConfirmation: false
    };

    const result = await sendEmail(emailData);
    return {
      success: true,
      message: 'Image upload notification sent successfully',
      data: result.data
    };
  } catch (error) {
    console.error('Error sending image upload notification:', error);
    throw error;
  }
};
