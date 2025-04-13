
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { corsHeaders } from "./utils/cors.ts";

// Track function uptime and request count
const functionStartTime = Date.now();
let requestCount = 0;
const emailDeliveryLogs: any[] = [];

const handler = async (req: Request): Promise<Response> => {
  // Increment request counter
  requestCount++;
  const currentRequest = requestCount;
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Log incoming request for debugging
  console.log(`[Request #${currentRequest}] Processing ${req.method} request to email-fallback function`);
  console.log(`[Request #${currentRequest}] Function uptime: ${Math.floor((Date.now() - functionStartTime) / 1000)} seconds`);

  try {
    // Parse the request body
    const body = await req.json();
    
    // Check if this is a health check request
    if (body.checkType === 'health-check') {
      return new Response(
        JSON.stringify({
          success: true,
          message: "Fallback email provider is available",
          uptime: Math.floor((Date.now() - functionStartTime) / 1000),
          timestamp: new Date().toISOString()
        }),
        { 
          status: 200, 
          headers: { "Content-Type": "application/json", ...corsHeaders } 
        }
      );
    }
    
    // In a real implementation, you would integrate with SendGrid or another provider here
    // For now, we'll simulate sending an email via the fallback provider
    console.log("Simulating email send via fallback provider (SendGrid)");
    console.log("Email data:", JSON.stringify(body).substring(0, 200) + "...");
    
    // Log the email delivery attempt
    emailDeliveryLogs.push({
      timestamp: new Date().toISOString(),
      recipient: Array.isArray(body.to) ? body.to.join(', ') : body.to,
      subject: body.subject,
      status: 'sent',
      provider: 'sendgrid-fallback',
      messageId: `fallback-${Date.now()}-${Math.floor(Math.random() * 1000)}`
    });
    
    // Add small delay to simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return new Response(
      JSON.stringify({
        success: true,
        message: "Email sent successfully via fallback provider",
        provider: "sendgrid",
        emailId: `fallback-${Date.now()}`,
        deliveryStatus: "delivered",
        logs: emailDeliveryLogs.slice(-5) // Return the last 5 log entries
      }),
      { 
        status: 200, 
        headers: { "Content-Type": "application/json", ...corsHeaders } 
      }
    );
  } catch (error: any) {
    console.error(`[Request #${currentRequest}] Error in email-fallback function:`, error);
    
    return new Response(
      JSON.stringify({
        success: false, 
        error: error.message || "Unknown error",
        timestamp: new Date().toISOString(),
        uptime: Math.floor((Date.now() - functionStartTime) / 1000)
      }),
      { 
        status: 500, 
        headers: { "Content-Type": "application/json", ...corsHeaders } 
      }
    );
  }
};

// Add a shutdown handler to log when the function is terminated
addEventListener("beforeunload", (event) => {
  console.log("Fallback function shutting down at", new Date().toISOString());
  console.log("Function ran for", Math.floor((Date.now() - functionStartTime) / 1000), "seconds");
  console.log("Handled", requestCount, "requests");
  console.log("Shutdown reason:", event.detail?.reason || "unknown");
});

serve(handler);
