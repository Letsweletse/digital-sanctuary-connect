
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { corsHeaders } from "./utils/cors.ts";
import { processEmailRequest, getEmailDeliveryLogs } from "./handlers/emailHandler.ts";

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Log incoming request for debugging
  console.log(`Processing ${req.method} request to send-email function with refreshed DNS settings`);
  console.log("Headers:", Object.fromEntries(req.headers.entries()));
  console.log("URL:", req.url);
  
  // Log environment variables available (without values for security)
  const envKeys = Object.keys(Deno.env.toObject());
  console.log("Available environment variables:", envKeys);
  console.log("RESEND_API_KEY configured:", !!Deno.env.get("RESEND_API_KEY"));
  console.log("Using updated RESEND_API_KEY");

  try {
    // Check if this is a request for email logs
    const url = new URL(req.url);
    
    // Parse the request body to check for logs request
    let requestBody;
    if (req.method === "POST") {
      try {
        const bodyText = await req.text();
        console.log("Request body text:", bodyText.substring(0, 200) + (bodyText.length > 200 ? "..." : ""));
        
        try {
          requestBody = JSON.parse(bodyText);
          console.log("Parsed request body:", JSON.stringify(requestBody).substring(0, 200) + "...");
        } catch (parseError) {
          console.error("Error parsing JSON body:", parseError);
          requestBody = {};
        }
      } catch (e) {
        console.log("Error reading request body:", e);
        requestBody = {};
      }
      
      // Create a new Request with the parsed body for further processing
      req = new Request(req.url, {
        method: req.method,
        headers: req.headers,
        body: JSON.stringify(requestBody)
      });
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
    console.error("Error stack:", error.stack);
    
    // Add more detailed error information for troubleshooting
    const errorInfo = {
      success: false, 
      error: error.message || "Unknown error",
      errorType: error.name,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      path: new URL(req.url).pathname,
      resendKeyConfigured: !!Deno.env.get("RESEND_API_KEY"),
      envKeys: Object.keys(Deno.env.toObject())
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
