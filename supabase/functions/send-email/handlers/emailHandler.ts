
import { Resend } from "npm:resend@2.0.0";
import { logMessage } from "../utils/logger.ts";
import { trackDeliveryMetrics } from "../utils/logger.ts";

interface EmailResult {
  id: string;
  retryCount: number;
}

export const handleEmailSending = async (
  resend: Resend, 
  emailData: any, 
  deliveryMetrics: any
): Promise<EmailResult> => {
  logMessage("Sending email with Resend API", { to: emailData.to, subject: emailData.subject });
  
  let result;
  let retryCount = 0;
  let lastError = null;
  const maxRetries = 3;
  
  while (retryCount < maxRetries) {
    try {
      result = await resend.emails.send(emailData);
      logMessage("Email sent successfully", { messageId: result.id, attempt: retryCount + 1 });
      
      trackDeliveryMetrics(true, {
        to: emailData.to
      });
      
      return {
        id: result.id,
        retryCount
      };
    } catch (sendError: any) {
      lastError = sendError;
      retryCount++;
      logMessage(`Email send attempt ${retryCount} failed`, { error: sendError.message });
      
      // Check for domain verification errors
      if (sendError.message?.includes("domain is not verified")) {
        deliveryMetrics.domainVerificationErrors++;
        deliveryMetrics.lastError = {
          code: sendError.statusCode || 403,
          message: sendError.message,
          timestamp: new Date().toISOString()
        };
        
        // No point retrying for domain verification errors
        break;
      }
      
      if (retryCount >= maxRetries) {
        throw sendError;
      }
      
      // Exponential backoff with jitter
      const delay = Math.min(100 * Math.pow(2, retryCount) + Math.random() * 100, 2000);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  // If we get here with domain verification error, throw it with additional info
  if (lastError && lastError.message?.includes("domain is not verified")) {
    const enhancedError = new Error("Domain verification required");
    Object.assign(enhancedError, { 
      statusCode: lastError.statusCode || 403,
      verificationRequired: true,
      to: emailData.to
    });
    throw enhancedError;
  }
  
  // Should never get here if all retries failed, as we throw in the loop
  throw lastError || new Error("Failed to send email after multiple attempts");
}
