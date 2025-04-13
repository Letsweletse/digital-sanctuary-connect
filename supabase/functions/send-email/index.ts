
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { corsHeaders } from "./utils/cors.ts";
import { processEmailRequest, getEmailDeliveryLogs } from "./handlers/emailHandler.ts";

// Track function uptime and request count
const functionStartTime = Date.now();
let requestCount = 0;

const handler = async (req: Request): Promise<Response> => {
  // Increment request counter
  requestCount++;
  const currentRequest = requestCount;
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Log incoming request for debugging
  console.log(`[Request #${currentRequest}] Processing ${req.method} request to send-email function with refreshed DNS settings`);
  console.log(`[Request #${currentRequest}] Headers:`, Object.fromEntries(req.headers.entries()));
  console.log(`[Request #${currentRequest}] URL:`, req.url);
  
  // Log environment variables available (without values for security)
  const envKeys = Object.keys(Deno.env.toObject());
  console.log(`[Request #${currentRequest}] Available environment variables:`, envKeys);
  console.log(`[Request #${currentRequest}] RESEND_API_KEY configured:`, !!Deno.env.get("RESEND_API_KEY"));
  console.log(`[Request #${currentRequest}] RESEND_API_KEY first 5 chars:`, Deno.env.get("RESEND_API_KEY")?.substring(0, 5) || "Not available");
  console.log(`[Request #${currentRequest}] Using updated RESEND_API_KEY starting with re_9Q`);
  console.log(`[Request #${currentRequest}] Function uptime:`, Math.floor((Date.now() - functionStartTime) / 1000), "seconds");
  console.log(`[Request #${currentRequest}] Total requests handled:`, currentRequest);

  try {
    // Check if this is a request for email logs
    const url = new URL(req.url);
    
    // Parse the request body to check for logs request
    let requestBody;
    if (req.method === "POST") {
      try {
        const bodyText = await req.text();
        console.log(`[Request #${currentRequest}] Request body text:`, bodyText.substring(0, 200) + (bodyText.length > 200 ? "..." : ""));
        
        try {
          requestBody = JSON.parse(bodyText);
          console.log(`[Request #${currentRequest}] Parsed request body:`, JSON.stringify(requestBody).substring(0, 200) + "...");
        } catch (parseError) {
          console.error(`[Request #${currentRequest}] Error parsing JSON body:`, parseError);
          requestBody = {};
        }
      } catch (e) {
        console.log(`[Request #${currentRequest}] Error reading request body:`, e);
        requestBody = {};
      }
      
      // Create a new Request with the parsed body for further processing
      req = new Request(req.url, {
        method: req.method,
        headers: req.headers,
        body: JSON.stringify(requestBody)
      });
    }
    
    // Add request timestamp to the logs
    console.log(`[Request #${currentRequest}] Request timestamp:`, new Date().toISOString());
    
    // Check various ways the logs might be requested
    const isLogsRequest = 
      url.pathname.endsWith("/logs") || 
      url.searchParams.has("logs") || 
      (requestBody && requestBody.requestType === "logs");
    
    if (isLogsRequest) {
      console.log(`[Request #${currentRequest}] Getting email delivery logs`);
      return await getEmailDeliveryLogs(req);
    }
    
    // Otherwise process as a normal email request
    return await processEmailRequest(req);
  } catch (error: any) {
    console.error(`[Request #${currentRequest}] Error in send-email function:`, error);
    console.error(`[Request #${currentRequest}] Error stack:`, error.stack);
    
    // Add more detailed error information for troubleshooting
    const errorInfo = {
      success: false, 
      error: error.message || "Unknown error",
      errorType: error.name,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      path: new URL(req.url).pathname,
      resendKeyConfigured: !!Deno.env.get("RESEND_API_KEY"),
      resendKeyFirstChars: Deno.env.get("RESEND_API_KEY")?.substring(0, 5) || "Not available",
      envKeys: Object.keys(Deno.env.toObject()),
      functionUptime: `${Math.floor((Date.now() - functionStartTime) / 1000)} seconds`,
      requestCount: currentRequest
    };
    
    console.error(`[Request #${currentRequest}] Error details:`, errorInfo);
    
    return new Response(
      JSON.stringify(errorInfo),
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

// Log function initialization
console.log("Send-email edge function starting at:", new Date().toISOString());
console.log("RESEND_API_KEY configured:", !!Deno.env.get("RESEND_API_KEY"));
if (Deno.env.get("RESEND_API_KEY")) {
  console.log("RESEND_API_KEY starts with:", Deno.env.get("RESEND_API_KEY")?.substring(0, 5) + "...");
}

// Add a shutdown handler to log when the function is terminated
addEventListener("beforeunload", (event) => {
  console.log("Edge function shutting down at", new Date().toISOString());
  console.log("Function ran for", Math.floor((Date.now() - functionStartTime) / 1000), "seconds");
  console.log("Handled", requestCount, "requests");
  console.log("Shutdown reason:", event.detail?.reason || "unknown");
});

serve(handler);
