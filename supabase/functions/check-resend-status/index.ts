
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

// Initialize Resend with API key from environment variable
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

// Set up CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Monitor and log important details about the function's environment
let functionStartTime = Date.now();
let requestCount = 0;
let lastSuccessfulCheck = null;
let lastErrorDetails = null;

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Increment request counter for monitoring
  requestCount++;
  const currentRequestNumber = requestCount;
  console.log(`[Request #${currentRequestNumber}] Handling check-resend-status request`);

  try {
    console.log(`[Request #${currentRequestNumber}] Checking Resend API key configuration...`);
    console.log(`[Request #${currentRequestNumber}] Request headers:`, Object.fromEntries(req.headers.entries()));
    
    // Check for connection test parameter
    let requestBody = {};
    try {
      requestBody = await req.json();
      console.log(`[Request #${currentRequestNumber}] Request body:`, requestBody);
    } catch (e) {
      console.log(`[Request #${currentRequestNumber}] No request body or invalid JSON`);
    }
    
    const isConnectionTest = requestBody?.connectionTest === true;
    if (isConnectionTest) {
      console.log(`[Request #${currentRequestNumber}] Processing connection test only`);
      return new Response(
        JSON.stringify({
          success: true,
          message: "Edge function connection successful",
          functionUptime: Math.floor((Date.now() - functionStartTime) / 1000) + " seconds",
          requestCount: requestCount,
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
    
    // Log Deno.env keys for debugging
    const envKeys = Object.keys(Deno.env.toObject());
    console.log(`[Request #${currentRequestNumber}] Available environment variables:`, envKeys);
    
    // Check if API key is configured
    if (!RESEND_API_KEY) {
      console.error(`[Request #${currentRequestNumber}] RESEND_API_KEY not configured`);
      lastErrorDetails = {
        error: "API key missing",
        timestamp: new Date().toISOString()
      };
      
      return new Response(
        JSON.stringify({
          success: false,
          message: "RESEND_API_KEY not configured in Supabase Edge Functions secrets.",
          keyConfigured: false,
          envKeys: envKeys,
          functionUptime: Math.floor((Date.now() - functionStartTime) / 1000) + " seconds",
          requestCount: requestCount,
          lastSuccessfulCheck: lastSuccessfulCheck
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
    
    console.log(`[Request #${currentRequestNumber}] RESEND_API_KEY found with length:`, RESEND_API_KEY.length);
    console.log(`[Request #${currentRequestNumber}] RESEND_API_KEY starts with:`, RESEND_API_KEY.substring(0, 5) + "...");
    
    // Validate API key format (simple check for Resend key format)
    if (!RESEND_API_KEY.startsWith('re_')) {
      console.error(`[Request #${currentRequestNumber}] RESEND_API_KEY appears to be invalid (should start with 're_')`);
      lastErrorDetails = {
        error: "API key invalid format",
        timestamp: new Date().toISOString()
      };
      
      return new Response(
        JSON.stringify({
          success: false,
          message: "The provided RESEND_API_KEY appears to be invalid. Resend API keys should start with 're_'.",
          keyConfigured: false,
          keyFormat: RESEND_API_KEY.substring(0, 5) + "...",
          functionUptime: Math.floor((Date.now() - functionStartTime) / 1000) + " seconds",
          requestCount: requestCount,
          lastSuccessfulCheck: lastSuccessfulCheck
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
    
    // Initialize Resend client
    const resend = new Resend(RESEND_API_KEY);
    
    // Get API key details to check usage
    console.log(`[Request #${currentRequestNumber}] Requesting API key details from Resend...`);
    try {
      // This will throw an error if the API key is invalid or has issues
      // For now, let's just check if we can initialize Resend
      console.log(`[Request #${currentRequestNumber}] Resend client initialized successfully with API key: ` + RESEND_API_KEY.substring(0, 5) + "...");
      
      // Try to make a simple API call to verify the key works
      try {
        // Send a test ping email to verify connectivity
        // Instead of sending an actual email, we'll try to get domains which is a lighter operation
        const domainsResponse = await resend.domains.list();
        console.log(`[Request #${currentRequestNumber}] Successfully verified API key by listing domains:`, domainsResponse);
        
        lastSuccessfulCheck = {
          timestamp: new Date().toISOString(),
          domains: domainsResponse?.data?.length || 0
        };
        
        return new Response(
          JSON.stringify({
            success: true,
            message: "Resend API key is properly configured and working.",
            keyConfigured: true,
            domains: domainsResponse,
            functionUptime: Math.floor((Date.now() - functionStartTime) / 1000) + " seconds",
            requestCount: requestCount,
            lastSuccessfulCheck: lastSuccessfulCheck,
            systemInfo: {
              heapSize: Deno.memoryUsage().heapUsed / 1024 / 1024 + " MB",
              timestamp: new Date().toISOString()
            }
          }),
          { 
            status: 200, 
            headers: { 
              "Content-Type": "application/json",
              ...corsHeaders
            } 
          }
        );
      } catch (apiCallError) {
        // The API key might be valid in format but doesn't have correct permissions
        console.error(`[Request #${currentRequestNumber}] Error making test API call with Resend:`, apiCallError);
        lastErrorDetails = {
          error: "API call failed",
          message: apiCallError instanceof Error ? apiCallError.message : "Unknown error",
          timestamp: new Date().toISOString()
        };
        
        return new Response(
          JSON.stringify({
            success: false,
            message: `Resend API key appears valid but failed a test request: ${apiCallError instanceof Error ? apiCallError.message : 'Unknown error'}.`,
            keyConfigured: false,
            validFormat: true,
            error: apiCallError instanceof Error ? apiCallError.message : 'Unknown error',
            functionUptime: Math.floor((Date.now() - functionStartTime) / 1000) + " seconds",
            requestCount: requestCount,
            lastSuccessfulCheck: lastSuccessfulCheck,
            lastErrorDetails: lastErrorDetails
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
    } catch (resendError) {
      console.error(`[Request #${currentRequestNumber}] Error connecting to Resend API:`, resendError);
      lastErrorDetails = {
        error: "Resend connection failed",
        message: resendError instanceof Error ? resendError.message : "Unknown error",
        timestamp: new Date().toISOString()
      };
      
      return new Response(
        JSON.stringify({
          success: false,
          message: `Could not verify Resend API: ${resendError instanceof Error ? resendError.message : 'Unknown error'}`,
          keyConfigured: false,
          error: resendError instanceof Error ? resendError.message : 'Unknown error',
          functionUptime: Math.floor((Date.now() - functionStartTime) / 1000) + " seconds",
          requestCount: requestCount,
          lastSuccessfulCheck: lastSuccessfulCheck,
          lastErrorDetails: lastErrorDetails
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
    console.error(`[Request #${currentRequestNumber}] Error in check-resend-status function:`, error);
    lastErrorDetails = {
      error: "Function error",
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    };
    
    return new Response(
      JSON.stringify({
        success: false,
        message: `Server error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        keyConfigured: false,
        error: error instanceof Error ? error.stack : 'Unknown error',
        functionUptime: Math.floor((Date.now() - functionStartTime) / 1000) + " seconds",
        requestCount: requestCount,
        lastSuccessfulCheck: lastSuccessfulCheck,
        lastErrorDetails: lastErrorDetails
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

// Log startup information
console.log("Edge function check-resend-status starting up at", new Date().toISOString());
console.log("RESEND_API_KEY configured:", !!RESEND_API_KEY);
if (RESEND_API_KEY) {
  console.log("RESEND_API_KEY format valid:", RESEND_API_KEY.startsWith('re_'));
  console.log("RESEND_API_KEY starts with:", RESEND_API_KEY.substring(0, 5) + "...");
}

// Add a shutdown handler to log when the function is terminated
addEventListener("beforeunload", (event) => {
  console.log("Edge function shutting down at", new Date().toISOString());
  console.log("Function ran for", Math.floor((Date.now() - functionStartTime) / 1000), "seconds");
  console.log("Handled", requestCount, "requests");
  console.log("Last successful check:", lastSuccessfulCheck);
  console.log("Last error details:", lastErrorDetails);
});

serve(handler);
