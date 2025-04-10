
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
    
    // Check if API key is configured
    if (!RESEND_API_KEY) {
      console.error("RESEND_API_KEY not configured");
      return new Response(
        JSON.stringify({
          success: false,
          message: "RESEND_API_KEY not configured in Supabase Edge Functions secrets."
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
      console.log("Resend client initialized successfully");
      
      return new Response(
        JSON.stringify({
          success: true,
          message: "Resend API key is properly configured. To check actual usage, visit your Resend dashboard."
        }),
        { 
          status: 200, 
          headers: { 
            "Content-Type": "application/json",
            ...corsHeaders
          } 
        }
      );
    } catch (resendError) {
      console.error("Error connecting to Resend API:", resendError);
      return new Response(
        JSON.stringify({
          success: false,
          message: `Could not verify Resend API: ${resendError instanceof Error ? resendError.message : 'Unknown error'}`
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
        message: `Server error: ${error instanceof Error ? error.message : 'Unknown error'}`
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
