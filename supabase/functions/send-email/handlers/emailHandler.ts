
import { Resend } from "npm:resend@2.0.0";
import { logMessage } from "../utils/logger.ts";

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

  // Log the full email data for debugging
  console.log("DETAILED EMAIL DATA:", JSON.stringify({
    to: emailData.to,
    subject: emailData.subject,
    from: emailData.from || "default-from@example.com",
    hasHtml: !!emailData.html,
    hasText: !!emailData.text,
    timestamp: new Date().toISOString()
  }, null, 2));

  let result;
  let retryCount = 0;
  let lastError = null;
  const maxRetries = 5; // Increased from 3 to 5 for SMTP transient failures

  while (retryCount < maxRetries) {
    try {
      logMessage(`Email sending attempt ${retryCount + 1} of ${maxRetries}`, { to: emailData.to });

      // Make sure the from field is properly set
      if (!emailData.from) {
        emailData.from = "info@gategaborone.com";
        logMessage("No from address provided, using default", { from: emailData.from });
      }

      // Add SMTP retry information to force hard-retry
      const enhancedEmailData = {
        ...emailData,
        text: emailData.text ? 
          `${emailData.text}\n\n---\nSent at: ${new Date().toISOString()}` : 
          `This email was sent at: ${new Date().toISOString()}`,
        headers: {
          ...emailData.headers,
          "X-Entity-Ref-ID": `send-email-${Date.now()}-${retryCount}`,
          "X-Priority": "1",
          "X-MSMail-Priority": "High",
          "Importance": "high",
          "X-Retry-Count": `${retryCount}`,
          "X-Resend-SMTP-Force": "true" // Force SMTP delivery attempt
        }
      };

      // For retries, add increasing backoff delay
      if (retryCount > 0) {
        const backoffDelay = Math.min(500 * Math.pow(2, retryCount) + Math.random() * 500, 10000);
        logMessage(`Implementing backoff delay of ${backoffDelay}ms before retry ${retryCount + 1}...`, {
          attempt: retryCount + 1
        });
        await new Promise(resolve => setTimeout(resolve, backoffDelay));
      }

      result = await resend.emails.send(enhancedEmailData);
      logMessage("Email sent successfully", { 
        messageId: result.id, 
        attempt: retryCount + 1,
        to: Array.isArray(emailData.to) ? emailData.to.join(', ') : emailData.to
      });

      // Update metrics
      deliveryMetrics.successfulDeliveries++;
      deliveryMetrics.emailsSent.push(Array.isArray(emailData.to) ? emailData.to.join(', ') : emailData.to);

      return {
        id: result.id,
        retryCount
      };
    } catch (sendError: any) {
      retryCount++;
      lastError = sendError;

      // 🔍 Log full error detail
      console.error("Resend Send Error", {
        name: sendError.name,
        message: sendError.message,
        statusCode: sendError.statusCode,
        cause: sendError.cause,
        response: sendError.response ? JSON.stringify(sendError.response) : null,
        stack: sendError.stack
      });

      logMessage(`Email send attempt ${retryCount} failed`, { 
        error: sendError.message,
        to: Array.isArray(emailData.to) ? emailData.to.join(', ') : emailData.to,
        statusCode: sendError.statusCode || 'unknown'
      });

      // Special handling for SMTP transient failures
      if (sendError.message?.includes("temporary communication failure") || 
          sendError.message?.includes("transient") ||
          sendError.message?.includes("SMTP")) {
        logMessage("SMTP transient failure detected, will retry with longer backoff", {
          attempt: retryCount,
          message: sendError.message
        });
        
        // For SMTP failures, use longer exponential backoff
        const smtpBackoffDelay = Math.min(2000 * Math.pow(2, retryCount) + Math.random() * 1000, 30000);
        await new Promise(resolve => setTimeout(resolve, smtpBackoffDelay));
        continue;
      }

      if (sendError.message?.includes("domain is not verified") || 
          sendError.message?.includes("verification") ||
          sendError.message?.includes("invalid")) {
        deliveryMetrics.domainVerificationErrors++;
        deliveryMetrics.lastError = {
          code: sendError.statusCode || 403,
          message: sendError.message,
          timestamp: new Date().toISOString()
        };
        break; // Stop retrying for domain verification errors
      }

      if (retryCount >= maxRetries) {
        deliveryMetrics.failedDeliveries++;
        throw sendError;
      }

      // Retry with exponential backoff
      const delay = Math.min(100 * Math.pow(2, retryCount) + Math.random() * 100, 2000);
      logMessage(`Retrying in ${delay}ms...`, { attempt: retryCount });
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  // Handle domain verification fallback
  if (lastError?.message?.includes("domain is not verified") || 
      lastError?.message?.includes("verification") ||
      lastError?.message?.includes("invalid")) {
    const enhancedError = new Error("Domain verification required or API key issue");
    Object.assign(enhancedError, {
      statusCode: lastError.statusCode || 403,
      verificationRequired: true,
      to: emailData.to
    });
    throw enhancedError;
  }

  throw lastError || new Error("Failed to send email after multiple attempts");
};
