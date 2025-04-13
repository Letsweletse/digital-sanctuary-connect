
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

// Track function uptime and request count
const functionStartTime = Date.now();
let requestCount = 0;

// Create CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Get API key - use the verified key
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") || "re_bGSLW5ST_HXvVo4ZUjY88qADUKpSd42Ac";

// Initialize Resend client
const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

const handler = async (req: Request): Promise<Response> => {
  // Increment request counter
  requestCount++;
  const currentRequest = requestCount;
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Log request for debugging
  console.log(`[Request #${currentRequest}] Checking Resend API key status`);
  console.log(`[Request #${currentRequest}] Function uptime:`, Math.floor((Date.now() - functionStartTime) / 1000), "seconds");
  console.log(`[Request #${currentRequest}] Total requests handled:`, currentRequest);
  
  try {
    // Get environment info for debugging
    const envKeys = Object.keys(Deno.env.toObject());
    console.log(`[Request #${currentRequest}] Available env vars:`, envKeys);
    console.log(`[Request #${currentRequest}] RESEND_API_KEY configured:`, !!RESEND_API_KEY);
    
    if (RESEND_API_KEY) {
      console.log(`[Request #${currentRequest}] RESEND_API_KEY first 5 chars:`, RESEND_API_KEY.substring(0, 5));
    }
    
    // Parse request body
    let requestBody;
    try {
      requestBody = await req.json();
      console.log(`[Request #${currentRequest}] Request body:`, JSON.stringify(requestBody));
    } catch (e) {
      console.log(`[Request #${currentRequest}] No request body or invalid JSON`);
      requestBody = {};
    }

    // Check if API key is configured
    if (!RESEND_API_KEY) {
      return new Response(
        JSON.stringify({
          success: false,
          keyConfigured: false,
          message: "RESEND_API_KEY not configured. Using the provided fallback key.",
          timestamp: new Date().toISOString(),
          functionUptime: `${Math.floor((Date.now() - functionStartTime) / 1000)} seconds`
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }

    // Test API key by making a simple call to Resend
    try {
      // Make a simple API call to check if the key is valid
      const domains = await resend?.domains.list();
      
      console.log(`[Request #${currentRequest}] API check successful. Domains:`, domains);
      
      return new Response(
        JSON.stringify({
          success: true,
          keyConfigured: true,
          message: "Resend API key is valid and working correctly.",
          domains: domains?.data || [],
          apiKeyFirstChars: RESEND_API_KEY.substring(0, 5),
          timestamp: new Date().toISOString(),
          functionUptime: `${Math.floor((Date.now() - functionStartTime) / 1000)} seconds`,
          requestCount: currentRequest
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    } catch (apiError) {
      console.error(`[Request #${currentRequest}] API key test failed:`, apiError);
      
      return new Response(
        JSON.stringify({
          success: false,
          keyConfigured: true,
          message: `API key appears to be invalid or not working: ${apiError instanceof Error ? apiError.message : "Unknown error"}`,
          error: apiError instanceof Error ? apiError.message : "Unknown error",
          apiKeyFirstChars: RESEND_API_KEY.substring(0, 5),
          timestamp: new Date().toISOString(),
          functionUptime: `${Math.floor((Date.now() - functionStartTime) / 1000)} seconds`
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }
  } catch (error) {
    console.error(`[Request #${currentRequest}] Error in check-resend-status:`, error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : null,
        timestamp: new Date().toISOString(),
        functionUptime: `${Math.floor((Date.now() - functionStartTime) / 1000)} seconds`
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  }
};

// Log function initialization
console.log("check-resend-status function starting at:", new Date().toISOString());
console.log("RESEND_API_KEY configured:", !!RESEND_API_KEY);
if (RESEND_API_KEY) {
  console.log("RESEND_API_KEY starts with:", RESEND_API_KEY.substring(0, 5) + "...");
}

// Add a shutdown handler to log when the function is terminated
addEventListener("beforeunload", (event) => {
  console.log("Edge function shutting down at", new Date().toISOString());
  console.log("Function ran for", Math.floor((Date.now() - functionStartTime) / 1000), "seconds");
  console.log("Handled", requestCount, "requests");
  console.log("Shutdown reason:", event.detail?.reason || "unknown");
});

serve(handler);
