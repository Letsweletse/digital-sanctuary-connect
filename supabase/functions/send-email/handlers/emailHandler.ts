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

      trackDeliveryMetrics(true, { to: emailData.to });

      return {
        id: result.id,
        retryCount
      };
    } catch (sendError: any) {
      retryCount++;
      lastError = sendError;

      // 🔍 New: Log full error detail
      console.error("Resend Send Error", {
        name: sendError.name,
        message: sendError.message,
        statusCode: sendError.statusCode,
        cause: sendError.cause,
        response: sendError.response,
        stack: sendError.stack
      });

      logMessage(`Email send attempt ${retryCount} failed`, { error: sendError.message });

      if (sendError.message?.includes("domain is not verified")) {
        deliveryMetrics.domainVerificationErrors++;
        deliveryMetrics.lastError = {
          code: sendError.statusCode || 403,
          message: sendError.message,
          timestamp: new Date().toISOString()
        };
        break; // Stop retrying
      }

      if (retryCount >= maxRetries) {
        throw sendError;
      }

      // Retry delay
      const delay = Math.min(100 * Math.pow(2, retryCount) + Math.random() * 100, 2000);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  // Handle domain verification fallback
  if (lastError?.message?.includes("domain is not verified")) {
    const enhancedError = new Error("Domain verification required");
    Object.assign(enhancedError, {
      statusCode: lastError.statusCode || 403,
      verificationRequired: true,
      to: emailData.to
    });
    throw enhancedError;
  }

  throw lastError || new Error("Failed to send email after multiple attempts");
};
