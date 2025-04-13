/**
 * Email service utility for sending notifications
 * Using Supabase Edge Functions with direct Resend API fallback
 */

// Email address for admin notifications - exported for use in components
export const ADMIN_EMAIL = 'otenggate@gmail.com';
// Add additional recipient emails
export const BACKUP_EMAIL = 'info@gategaborone.com';
export const ZOHO_EMAIL = 'iblimenterprise@zohomail.com';
export const ADMIN_EMAILS = [ADMIN_EMAIL, BACKUP_EMAIL, ZOHO_EMAIL];

import { supabase } from "@/integrations/supabase/client";
import { sendDirectToResend, forceDirectModeForRegistration } from "@/components/email-test/services/directResendService";
import { getStoredResendApiKey, isDirectModeEnabled, enableDirectMode } from "./directResendService";
import { toast } from "sonner";

/**
 * Base email sending function with direct Resend fallback
 * @param requestBody - The email request data to send
 */
async function sendEmail(requestBody: any) {
  try {
    console.log("Preparing to send email:", JSON.stringify(requestBody).substring(0, 200) + "...");
    
    // Add a timestamp to prevent caching issues
    const timestampedRequest = {
      ...requestBody,
      timestamp: Date.now()
    };
    
    // Check if we have a direct API key and should use it
    const directApiKey = getStoredResendApiKey();
    
    // Force direct mode to be enabled for all email sends
    if (directApiKey) {
      enableDirectMode();
    }
    
    // If direct mode is enabled, try that first
    if (directApiKey && isDirectModeEnabled()) {
      console.log("Using direct Resend API mode...");
      try {
        const directResult = await sendDirectToResend(timestampedRequest);
        if (directResult.success) {
          console.log("Email sent successfully via direct Resend API");
          return {
            success: true,
            message: 'Email sent successfully via direct Resend API',
            data: directResult
          };
        } else {
          console.error("Direct Resend API send failed:", directResult.message);
          
          // Show toast notification for debugging
          toast.error("Direct email send failed", {
            description: directResult.message || "Unknown error",
            duration: 5000
          });
        }
      } catch (directError) {
        console.error("Error in direct Resend API send:", directError);
      }
    } else if (!directApiKey) {
      // If no direct API key, show a message
      console.error("No direct Resend API key configured. Set it up in Admin > Email Test.");
      toast.error("Email configuration issue", {
        description: "No direct Resend API key configured. Set it up in Admin > Email Test.",
        duration: 5000
      });
    }
    
    // Use retry logic for more reliability
    let attempts = 0;
    const maxAttempts = 3;
    let lastError = null;
    
    while (attempts < maxAttempts) {
      try {
        console.log(`Email sending attempt ${attempts + 1} of ${maxAttempts} via Edge Function...`);
        
        const { data, error } = await supabase.functions.invoke('send-email', {
          body: timestampedRequest
        });
        
        if (error) {
          console.error(`Error invoking send-email function (attempt ${attempts + 1}):`, error);
          lastError = error;
          attempts++;
          
          // If this is the last attempt and we have a direct API key, try that as a final fallback
          if (attempts >= maxAttempts && directApiKey) {
            console.log("Edge Function failed after all attempts, trying direct Resend API as last resort...");
            enableDirectMode(); // Force direct mode
            try {
              const emergencyDirectResult = await sendDirectToResend(timestampedRequest);
              if (emergencyDirectResult.success) {
                console.log("Email sent successfully via emergency direct Resend API");
                return {
                  success: true,
                  message: 'Email sent successfully via emergency direct Resend API fallback',
                  data: {
                    ...emergencyDirectResult,
                    bypassMode: true,
                    edgeFunctionError: lastError?.message || 'Edge Function failed after multiple attempts'
                  }
                };
              }
            } catch (directFallbackError) {
              console.error("Emergency direct Resend API fallback also failed:", directFallbackError);
            }
          }
          
          if (attempts < maxAttempts) {
            // Wait before retrying (exponential backoff with jitter)
            const backoffTime = Math.min(1000 * Math.pow(2, attempts) * (0.9 + Math.random() * 0.2), 10000);
            console.log(`Retrying in ${backoffTime}ms...`);
            await new Promise(resolve => setTimeout(resolve, backoffTime));
          }
          continue;
        }
        
        console.log("Email function response:", data);
        
        if (!data) {
          console.error('No data returned from send-email function');
          lastError = new Error('No response data from email service');
          attempts++;
          
          if (attempts < maxAttempts) {
            // Wait before retrying
            const backoffTime = Math.min(1000 * Math.pow(2, attempts) * (0.9 + Math.random() * 0.2), 10000);
            console.log(`Retrying in ${backoffTime}ms...`);
            await new Promise(resolve => setTimeout(resolve, backoffTime));
          }
          continue;
        }
        
        return {
          success: true,
          message: 'Email sent successfully',
          data
        };
      } catch (invokeError) {
        console.error(`Error in email service (attempt ${attempts + 1}):`, invokeError);
        lastError = invokeError;
        attempts++;
        
        if (attempts < maxAttempts) {
          // Wait before retrying
          const backoffTime = Math.min(1000 * Math.pow(2, attempts) * (0.9 + Math.random() * 0.2), 10000);
          console.log(`Retrying in ${backoffTime}ms...`);
          await new Promise(resolve => setTimeout(resolve, backoffTime));
        }
      }
    }
    
    // If we have a direct API key, try that as a final fallback
    if (directApiKey) {
      console.log("Edge Function failed after all attempts, trying direct Resend API as last resort...");
      enableDirectMode(); // Force direct mode
      try {
        const emergencyDirectResult = await sendDirectToResend(timestampedRequest);
        if (emergencyDirectResult.success) {
          console.log("Email sent successfully via emergency direct Resend API");
          return {
            success: true,
            message: 'Email sent successfully via emergency direct Resend API fallback',
            data: {
              ...emergencyDirectResult,
              bypassMode: true,
              edgeFunctionError: lastError instanceof Error ? lastError.message : 'Edge Function failed after multiple attempts'
            }
          };
        }
      } catch (directFallbackError) {
        console.error("Emergency direct Resend API fallback also failed:", directFallbackError);
      }
    }
    
    // If we've exhausted all attempts, throw the last error
    return { 
      success: false, 
      message: lastError instanceof Error ? lastError.message : 'Failed after multiple attempts',
      error: lastError
    };
  } catch (finalError) {
    console.error('Fatal error in email service:', finalError);
    return { 
      success: false, 
      message: finalError instanceof Error ? finalError.message : 'Unknown error occurred',
      error: finalError
    };
  }
}

/**
 * Sends event registration notification to church admins
 */
export const sendEventRegistrationEmail = async (registrationData: any, recipientEmail?: string) => {
  try {
    console.log("Sending event registration email for:", registrationData.eventName);
    console.log("Registration data:", registrationData);
    
    // Force direct mode for registration emails
    forceDirectModeForRegistration();
    
    // Generate a unique check-in ID for this registration
    const checkInId = registrationData.checkInId || crypto.randomUUID();
    
    // Ensure we have all the required data for the enhanced confirmation email
    const eventLocation = registrationData.location || 'https://maps.app.goo.gl/mVLNzv5R2T8wQZNt7';
    const eventDate = registrationData.eventDate || '2025-05-10';
    const eventTime = registrationData.eventTime || '9:00 AM - 1:30 PM';
    const eventImage = registrationData.eventImage || 'https://lojchdvtwypjqupsjynf.supabase.co/storage/v1/object/public/images/leadership/POA_1743681812478.jpg';
    
    // Prepare the email request body with all required fields
    const emailRequestBody = {
      to: ADMIN_EMAILS,
      subject: registrationData.subject || `New Registration for ${registrationData.eventName}`,
      name: registrationData.name,
      email: registrationData.email,
      title: registrationData.title,
      role: registrationData.role,
      denomination: registrationData.denomination,
      phone: registrationData.phone,
      message: registrationData.message || '',
      eventName: registrationData.eventName,
      registrationType: registrationData.registrationType || 'Standard',
      sendConfirmation: registrationData.sendConfirmation || true,
      location: eventLocation,
      eventDate: eventDate,
      eventTime: eventTime,
      eventImage: eventImage,
      checkInId: checkInId,
      attendeeEmail: recipientEmail || registrationData.email,
      forceHtml: true, // Force HTML email rendering
      priority: "high", // Set high priority for important emails
      directBypass: true // Force direct bypass
    };
    
    console.log("Sending email with request body:", JSON.stringify(emailRequestBody).substring(0, 200) + "...");
    
    // First show toast to provide feedback
    toast.info("Sending registration confirmation...", {
      duration: 3000,
    });
    
    const result = await sendEmail(emailRequestBody);
    
    if (!result.success) {
      throw new Error(result.message || "Failed to send registration email");
    }
    
    toast.success("Registration email sent successfully", {
      description: "Check your inbox for confirmation email",
      duration: 5000
    });
    
    return {
      success: true,
      message: 'Email notification and confirmation sent successfully',
      recipients: ADMIN_EMAILS,
      timestamp: new Date().toISOString(),
      data: result.data
    };
  } catch (error) {
    console.error('Error preparing event registration email:', error);
    
    toast.error("Registration email failed", {
      description: error instanceof Error ? error.message : "Unknown error occurred",
      duration: 5000
    });
    
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
