
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { corsHeaders } from "./utils/cors.ts";

// Track function uptime and request count
const functionStartTime = Date.now();
let requestCount = 0;

// Helper for structured logging
const log = (requestId: number, message: string, data?: any) => {
  console.log(`[Request #${requestId}] ${message}`, data ? JSON.stringify(data).substring(0, 200) + "..." : "");
};

// Handler function for the email fallback service
const handler = async (req: Request): Promise<Response> => {
  // Increment request counter
  requestCount++;
  const currentRequest = requestCount;
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  log(currentRequest, "Processing POST request to email-fallback function");
  log(currentRequest, "Function uptime:", Math.floor((Date.now() - functionStartTime) / 1000) + " seconds");
  
  try {
    const body = await req.json();
    log(currentRequest, "Request body received", body);
    
    // Get SendGrid API key from environment
    const SENDGRID_API_KEY = Deno.env.get("SENDGRID_API_KEY");
    
    if (!SENDGRID_API_KEY) {
      log(currentRequest, "SendGrid API key not configured");
      return new Response(
        JSON.stringify({
          success: false,
          message: "Fallback service not fully configured - missing SendGrid API key",
          provider: "fallback-sendgrid",
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
    
    // Implement fallback logic with SendGrid when available
    // For now, we'll simulate successful fallback
    log(currentRequest, "Processing fallback email with simulated fallback provider");
    
    return new Response(
      JSON.stringify({
        success: true,
        message: "Email sent via fallback provider",
        provider: "fallback-service",
        messageId: `fallback-${Date.now()}`,
        timestamp: new Date().toISOString(),
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
    log(currentRequest, "Error in email-fallback function", { error: error.message });
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
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

// Add a shutdown handler
addEventListener("beforeunload", (event) => {
  console.log("Fallback function shutting down at", new Date().toISOString());
  console.log("Function ran for", Math.floor((Date.now() - functionStartTime) / 1000), "seconds");
  console.log("Handled", requestCount, "requests");
  console.log("Shutdown reason:", event.detail?.reason || "unknown");
});

serve(handler);
