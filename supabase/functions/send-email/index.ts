
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { corsHeaders } from "./utils/cors.ts";
import { Resend } from "npm:resend@2.0.0";
import { handleEmailSending } from "./handlers/emailHandler.ts";
import { handleDomainVerification } from "./handlers/domainHandler.ts";
import { logMessage } from "./utils/logger.ts";

// Track function uptime and request count
const functionStartTime = Date.now();
let requestCount = 0;

// Track delivery metrics
export const deliveryMetrics = {
  successfulDeliveries: 0,
  failedDeliveries: 0,
  domainVerificationErrors: 0,
  emailsSent: [],
  lastError: null
};

// Get Resend API key from environment
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") || "";

// Initialize Resend client
const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

// Main handler function
const handler = async (req: Request): Promise<Response> => {
  // Increment counter and track metrics
  requestCount++;
  const currentRequest = requestCount;
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Log request info
  logMessage("Received request #" + currentRequest);
  logMessage("Function uptime:", Math.floor((Date.now() - functionStartTime) / 1000) + " seconds");
  
  try {
    const requestData = await req.json();
    
    // Handle domain verification check
    if (requestData.requestType === 'domain-check') {
      return handleDomainVerification(resend);
    }
    
    // Basic validation
    if (!requestData || !requestData.to) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Missing required email fields",
          resendKeyConfigured: !!RESEND_API_KEY
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders
          }
        }
      );
    }

    // Check if Resend API key is configured
    if (!resend) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Resend API key not configured",
          resendKeyConfigured: false
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

    try {
      // Handle email sending
      const { id, retryCount } = await handleEmailSending(resend, requestData, deliveryMetrics);

      // Prepare success response
      const successResponse = {
        success: true,
        messageId: id,
        resendKeyConfigured: true,
        retriesNeeded: retryCount,
        timestamp: new Date().toISOString(),
        provider: "resend"
      };

      return new Response(
        JSON.stringify(successResponse),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders
          }
        }
      );
    } catch (emailError: any) {
      logMessage("Error sending email:", emailError);

      // Domain verification error
      if (emailError.verificationRequired) {
        deliveryMetrics.domainVerificationErrors++;
        deliveryMetrics.lastError = {
          code: emailError.statusCode || 403,
          message: emailError.message,
          timestamp: new Date().toISOString()
        };

        return new Response(
          JSON.stringify({
            success: false,
            error: "Domain verification required",
            detail: emailError.message,
            to: emailError.to,
            resendKeyConfigured: true,
            verificationRequired: true,
            timestamp: new Date().toISOString()
          }),
          {
            status: 403,
            headers: {
              "Content-Type": "application/json",
              ...corsHeaders
            }
          }
        );
      }

      // General email sending error
      deliveryMetrics.failedDeliveries++;
      deliveryMetrics.lastError = {
        code: emailError.statusCode || 500,
        message: emailError.message,
        timestamp: new Date().toISOString()
      };

      return new Response(
        JSON.stringify({
          success: false,
          error: emailError.message || "Failed to send email",
          statusCode: emailError.statusCode,
          resendKeyConfigured: true,
          timestamp: new Date().toISOString(),
          provider: "resend"
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
  } catch (error) {
    logMessage("Error processing request:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        resendKeyConfigured: !!RESEND_API_KEY,
        timestamp: new Date().toISOString()
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

// Handle function shutdown
addEventListener("beforeunload", (event) => {
  logMessage("Function shutting down after handling", requestCount, "requests");
  logMessage("Shutdown reason:", event.detail?.reason || "unknown");
  logMessage("Function ran for", Math.floor((Date.now() - functionStartTime) / 1000), "seconds");
  
  // Log delivery metrics
  logMessage("Successful deliveries:", deliveryMetrics.successfulDeliveries);
  logMessage("Failed deliveries:", deliveryMetrics.failedDeliveries);
  logMessage("Domain verification errors:", deliveryMetrics.domainVerificationErrors);
  
  // You could implement state saving here if needed
});

// Start the server
serve(handler);
