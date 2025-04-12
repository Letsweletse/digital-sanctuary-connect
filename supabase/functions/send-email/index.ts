
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { corsHeaders } from "./utils/cors.ts";
import { processEmailRequest, getEmailDeliveryLogs } from "./handlers/emailHandler.ts";

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Log incoming request for debugging
  console.log(`Processing ${req.method} request to send-email function`);
  console.log("Headers:", Object.fromEntries(req.headers.entries()));
  console.log("URL:", req.url);

  try {
    // Check if this is a request for email logs
    const url = new URL(req.url);
    
    // Parse the request body to check for logs request
    let requestBody;
    if (req.method === "POST") {
      try {
        requestBody = await req.json();
        console.log("Request body:", requestBody);
      } catch (e) {
        console.log("No valid JSON body or empty body");
        requestBody = {};
      }
    }
    
    // Check various ways the logs might be requested
    const isLogsRequest = 
      url.pathname.endsWith("/logs") || 
      url.searchParams.has("logs") || 
      (requestBody && requestBody.requestType === "logs");
    
    if (isLogsRequest) {
      console.log("Getting email delivery logs");
      return await getEmailDeliveryLogs(req);
    }
    
    // Otherwise process as a normal email request
    return await processEmailRequest(req);
  } catch (error: any) {
    console.error("Error in send-email function:", error);
    
    // Add more detailed error information for troubleshooting
    const errorInfo = {
      success: false, 
      error: error.message || "Unknown error",
      errorType: error.name,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      path: new URL(req.url).pathname,
      resendKeyConfigured: !!Deno.env.get("RESEND_API_KEY")
    };
    
    console.error("Error details:", errorInfo);
    
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

serve(handler);
