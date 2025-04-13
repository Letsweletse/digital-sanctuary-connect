
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { v4 as uuidv4 } from "https://deno.land/std@0.190.0/uuid/mod.ts";

// CORS headers for cross-origin support
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Get API key from environment or use the provided verified key
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") || "re_bGSLW5ST_HXvVo4ZUjY88qADUKpSd42Ac";
const resend = new Resend(RESEND_API_KEY);

// Logging function with timestamps
const log = (message: string, data?: any) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [Resend Email Function] ${message}`, data || '');
};

// Store delivery metrics for monitoring
const deliveryMetrics = {
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
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    deliveryMetrics.totalAttempts++;
    
    // Check if this is a request for logs
    if (body.requestType === 'logs') {
      log("Logs request received");
      return new Response(
        JSON.stringify({
          success: true,
          message: "Email delivery metrics",
          metrics: deliveryMetrics,
          apiKey: `${RESEND_API_KEY.substring(0, 10)}...`,
          timestamp: new Date().toISOString()
        }),
        { 
          status: 200, 
          headers: { 
            "Content-Type": "application/json", 
            ...corsHeaders 
          } 
        }
      );
    }
    
    // Check if this is a domain verification check
    if (body.requestType === 'domain-check') {
      log("Domain verification check requested");
      
      try {
        const { data, error } = await resend.domains.get('gategaborone.com');
        
        return new Response(
          JSON.stringify({
            success: !error,
            domain: 'gategaborone.com',
            status: data?.status || 'unknown',
            verified: data?.verified || false,
            error: error ? error.message : null,
            apiKey: `${RESEND_API_KEY.substring(0, 10)}...`,
            timestamp: new Date().toISOString()
          }),
          { 
            status: 200, 
            headers: { 
              "Content-Type": "application/json", 
              ...corsHeaders 
            } 
          }
        );
      } catch (err) {
        return new Response(
          JSON.stringify({
            success: false,
            domain: 'gategaborone.com',
            status: 'error',
            verified: false,
            error: err instanceof Error ? err.message : 'Unknown error',
            apiKey: `${RESEND_API_KEY.substring(0, 10)}...`,
            timestamp: new Date().toISOString()
          }),
          { 
            status: 200, 
            headers: { 
              "Content-Type": "application/json", 
              ...corsHeaders 
            } 
          }
        );
      }
    }
    
    log("Received email request", { to: body.to, subject: body.subject });

    // Basic validation
    if (!body.to || !body.subject) {
      log("Validation error: Missing required fields", { body });
      throw new Error("Missing required fields: 'to' and 'subject'");
    }

    // Prepare email data
    const emailData = {
      from: "Gate Gaborone <info@gategaborone.com>",
      to: Array.isArray(body.to) ? body.to : [body.to],
      subject: body.subject,
      html: body.html || `<p>${body.text || "No content provided"}</p>`,
      text: body.text || "No text content provided",
      headers: {
        "X-Entity-Ref-ID": uuidv4(), // Ensures unique message ID
        "Priority": body.priority || "normal"
      }
    };

    // Send email via Resend with retry mechanism
    log("Sending email with Resend API", { to: emailData.to, subject: emailData.subject });
    
    let result;
    let retryCount = 0;
    let lastError = null;
    const maxRetries = 3;
    
    while (retryCount < maxRetries) {
      try {
        result = await resend.emails.send(emailData);
        log("Email sent successfully", { messageId: result.id, attempt: retryCount + 1 });
        break;
      } catch (sendError: any) {
        lastError = sendError;
        retryCount++;
        log(`Email send attempt ${retryCount} failed`, { error: sendError.message });
        
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
    
    if (lastError && lastError.message?.includes("domain is not verified")) {
      // Return domain verification error with helpful message
      return new Response(
        JSON.stringify({
          success: false,
          error: "Domain verification required",
          message: "The gategaborone.com domain is not verified. Please verify your domain at https://resend.com/domains",
          verificationUrl: "https://resend.com/domains",
          statusCode: lastError.statusCode || 403,
          apiKey: `${RESEND_API_KEY.substring(0, 10)}...`,
          timestamp: new Date().toISOString()
        }),
        { 
          status: 200, 
          headers: { 
            "Content-Type": "application/json", 
            ...corsHeaders 
          } 
        }
      );
    }
    
    // Update metrics
    deliveryMetrics.successfulDeliveries++;
    deliveryMetrics.emailsSent.push(`${emailData.to.join(',')} - ${new Date().toISOString()}`);
    
    // Trim the history if it gets too large
    if (deliveryMetrics.emailsSent.length > 100) {
      deliveryMetrics.emailsSent = deliveryMetrics.emailsSent.slice(-100);
    }

    return new Response(
      JSON.stringify({
        success: true,
        messageId: result.id,
        timestamp: new Date().toISOString(),
        apiKeyUsed: `${RESEND_API_KEY.substring(0, 5)}...`,
        recipientCount: Array.isArray(body.to) ? body.to.length : 1,
        retryCount: retryCount
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
    log("Error sending email", { error: error.message, stack: error.stack });
    deliveryMetrics.failedDeliveries++;
    deliveryMetrics.lastError = {
      code: error.statusCode || 500,
      message: error.message,
      timestamp: new Date().toISOString()
    };

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
