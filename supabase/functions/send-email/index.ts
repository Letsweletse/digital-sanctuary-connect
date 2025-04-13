
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { v4 as uuidv4 } from "https://deno.land/std@0.190.0/uuid/mod.ts";

// CORS headers for cross-origin support
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Get API key from environment or use the provided verified key
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") || "re_FYtCFWri_39ciqWYc9CEKpoa3JdkWdSwN";
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
    const maxRetries = 3;
    
    while (retryCount < maxRetries) {
      try {
        result = await resend.emails.send(emailData);
        log("Email sent successfully", { messageId: result.id, attempt: retryCount + 1 });
        break;
      } catch (sendError) {
        retryCount++;
        log(`Email send attempt ${retryCount} failed`, { error: sendError.message });
        
        if (retryCount >= maxRetries) {
          throw sendError;
        }
        
        // Exponential backoff with jitter
        const delay = Math.min(100 * Math.pow(2, retryCount) + Math.random() * 100, 2000);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
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
  } catch (error) {
    log("Error sending email", { error: error.message, stack: error.stack });
    deliveryMetrics.failedDeliveries++;

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
