
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

// Initialize Resend with API key from environment variable
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

// Set up CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Checking Resend API key configuration...");
    console.log("Request headers:", Object.fromEntries(req.headers.entries()));
    
    // Log Deno.env keys for debugging
    const envKeys = Object.keys(Deno.env.toObject());
    console.log("Available environment variables:", envKeys);
    
    // Check if API key is configured
    if (!RESEND_API_KEY) {
      console.error("RESEND_API_KEY not configured");
      return new Response(
        JSON.stringify({
          success: false,
          message: "RESEND_API_KEY not configured in Supabase Edge Functions secrets.",
          keyConfigured: false,
          envKeys: envKeys
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
    
    console.log("RESEND_API_KEY found with length:", RESEND_API_KEY.length);
    console.log("RESEND_API_KEY starts with:", RESEND_API_KEY.substring(0, 5) + "...");
    
    // Validate API key format (simple check for Resend key format)
    if (!RESEND_API_KEY.startsWith('re_')) {
      console.error("RESEND_API_KEY appears to be invalid (should start with 're_')");
      return new Response(
        JSON.stringify({
          success: false,
          message: "The provided RESEND_API_KEY appears to be invalid. Resend API keys should start with 're_'.",
          keyConfigured: false,
          keyFormat: RESEND_API_KEY.substring(0, 5) + "..."
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
    console.log("Requesting API key details from Resend...");
    try {
      // This will throw an error if the API key is invalid or has issues
      // For now, let's just check if we can initialize Resend
      console.log("Resend client initialized successfully with API key: " + RESEND_API_KEY.substring(0, 5) + "...");
      
      // Try to make a simple API call to verify the key works
      try {
        // Instead of sending an email, we'll try to get domains which is a lighter operation
        const domainsResponse = await resend.domains.list();
        console.log("Successfully verified API key by listing domains:", domainsResponse);
        
        return new Response(
          JSON.stringify({
            success: true,
            message: "Resend API key is properly configured and working.",
            keyConfigured: true,
            domains: domainsResponse
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
        console.error("Error making test API call with Resend:", apiCallError);
        return new Response(
          JSON.stringify({
            success: false,
            message: `Resend API key appears valid but failed a test request: ${apiCallError instanceof Error ? apiCallError.message : 'Unknown error'}.`,
            keyConfigured: false,
            validFormat: true,
            error: apiCallError instanceof Error ? apiCallError.message : 'Unknown error'
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
      console.error("Error connecting to Resend API:", resendError);
      return new Response(
        JSON.stringify({
          success: false,
          message: `Could not verify Resend API: ${resendError instanceof Error ? resendError.message : 'Unknown error'}`,
          keyConfigured: false,
          error: resendError instanceof Error ? resendError.message : 'Unknown error'
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
    console.error("Error in check-resend-status function:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: `Server error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        keyConfigured: false,
        error: error instanceof Error ? error.stack : 'Unknown error'
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
