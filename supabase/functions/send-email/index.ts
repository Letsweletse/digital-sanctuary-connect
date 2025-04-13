
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { v4 as uuid } from "https://deno.land/std@0.190.0/uuid/mod.ts";
import { corsHeaders, handleCorsRequest } from "./utils/cors.ts";
import { logMessage, trackDeliveryMetrics } from "./utils/logger.ts";
import { handleEmailSending } from "./handlers/emailHandler.ts";
import { handleDomainVerification } from "./handlers/domainHandler.ts";
import { handleLogsRequest } from "./handlers/logsHandler.ts";
import { logEmailDelivery, getDeliveryLogs, generateDeliveryReport } from "./utils/emailLogging.ts";

// Get API key from environment or use the provided verified key
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") || "re_bGSLW5ST_HXvVo4ZUjY88qADUKpSd42Ac";
const resend = new Resend(RESEND_API_KEY);

// Store delivery metrics for monitoring (real data from production)
export const deliveryMetrics = {
  totalAttempts: 0,
  successfulDeliveries: 0,
  failedDeliveries: 0,
  emailsSent: [] as string[],
  domainVerificationErrors: 0,
  lastError: null as any
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return handleCorsRequest();
  }

  try {
    const body = await req.json();
    deliveryMetrics.totalAttempts++;
    
    // Check if this is a request for logs
    if (body.requestType === 'logs') {
      return handleLogsRequest(deliveryMetrics, RESEND_API_KEY);
    }
    
    // Check if this is a domain verification check
    if (body.requestType === 'domain-check') {
      return handleDomainVerification(resend);
    }
    
    logMessage("Received email request", { to: body.to, subject: body.subject });

    // Basic validation
    if (!body.to || !body.subject) {
      logMessage("Validation error: Missing required fields", { body });
      throw new Error("Missing required fields: 'to' and 'subject'");
    }

    // Prepare email data with unique message ID
    const emailData = {
      from: "Gate Gaborone <info@gategaborone.com>",
      to: Array.isArray(body.to) ? body.to : [body.to],
      subject: body.subject,
      html: body.html || `<p>${body.text || "No content provided"}</p>`,
      text: body.text || "No text content provided",
      headers: {
        "X-Entity-Ref-ID": uuid(), // Ensures unique message ID
        "Priority": body.priority || "normal"
      }
    };

    // Send email via Resend with retry mechanism
    const result = await handleEmailSending(resend, emailData, deliveryMetrics);
    
    // Update email delivery logs
    logEmailDelivery(
      emailData.to.join(','), 
      body.emailType || 'test', 
      'sent', 
      { messageId: result.id },
      result.id
    );

    return new Response(
      JSON.stringify({
        success: true,
        messageId: result.id,
        timestamp: new Date().toISOString(),
        apiKeyUsed: `${RESEND_API_KEY.substring(0, 5)}...`,
        recipientCount: Array.isArray(body.to) ? body.to.length : 1,
        deliveryReport: generateDeliveryReport(),
        logs: getDeliveryLogs().slice(-5) // Return the most recent 5 logs
      }),
      { 
        status: 200, 
        headers: { 
          "Content-Type": "application/json", 
          ...corsHeaders 
        } 
      }
    );
  } catch (error: any) {
    logMessage("Error sending email", { error: error.message, stack: error.stack });
    deliveryMetrics.failedDeliveries++;
    deliveryMetrics.lastError = {
      code: error.statusCode || 500,
      message: error.message,
      timestamp: new Date().toISOString()
    };

    // Log the failed delivery
    if (error.to) {
      logEmailDelivery(
        Array.isArray(error.to) ? error.to.join(',') : error.to,
        error.emailType || 'unknown',
        'failed',
        { error: error.message }
      );
    }

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
        apiKeyUsed: `${RESEND_API_KEY.substring(0, 5)}...`,
        errorDetails: error.stack?.split("\n").slice(0, 3) || []
      }),
      { 
        status: 500, 
        headers: { 
          "Content-Type": "application/json", 
          ...corsHeaders 
        } 
      }
    );
  }
};

serve(handler);
