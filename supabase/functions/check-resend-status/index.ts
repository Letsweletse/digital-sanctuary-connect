
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

// Track function uptime and request count
const functionStartTime = Date.now();
let requestCount = 0;
let successfulChecks = 0;
let failedChecks = 0;

// Create CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Get API key from environment or use the provided key
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") || "re_FYtCFWri_39ciqWYc9CEKpoa3JdkWdSwN";

// Initialize Resend client
const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

// Helper for structured logging
const log = (requestId: number, message: string, data?: any) => {
  console.log(`[Request #${requestId}] ${message}`, data ? JSON.stringify(data).substring(0, 200) + "..." : "");
};

const handler = async (req: Request): Promise<Response> => {
  // Increment request counter
  requestCount++;
  const currentRequest = requestCount;
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  log(currentRequest, "Checking Resend API key status");
  log(currentRequest, "Function uptime:", Math.floor((Date.now() - functionStartTime) / 1000) + " seconds");
  log(currentRequest, "Total requests handled:", currentRequest);
  log(currentRequest, "API key first 10 chars:", RESEND_API_KEY.substring(0, 10));
  
  try {
    // Do a lightweight API call to check key validity
    const { data, error } = await resend.emails.send({
      from: "Gate Gaborone <info@gategaborone.com>",
      to: ["test@resend.dev"], // Special test address that doesn't actually send emails
      subject: "API Key Validation Test",
      text: "This is a test to verify the API key is working.",
      tags: [{ name: "test", value: "true" }]
    });
    
    let isKeyValid = true;
    let message = "Resend API key is valid and working correctly.";
    
    // Check for error response
    if (error) {
      // Some errors indicate the key is valid but other issues exist
      if (error.statusCode === 400 && !error.message.includes("API key is invalid")) {
        // 400 error but not an invalid key (e.g. domain not verified)
        message = "Resend API key is valid but there are other issues: " + error.message;
      } else {
        isKeyValid = false;
        message = "API key appears to be invalid: " + error.message;
      }
    }
    
    log(currentRequest, "API check result:", { isKeyValid, message });
    
    isKeyValid ? successfulChecks++ : failedChecks++;
    
    return new Response(
      JSON.stringify({
        success: isKeyValid,
        keyConfigured: true,
        message: message,
        lastTestedAt: new Date().toISOString(),
        apiKeyFirstChars: RESEND_API_KEY.substring(0, 5),
        timestamp: new Date().toISOString(),
        functionUptime: `${Math.floor((Date.now() - functionStartTime) / 1000)} seconds`,
        requestCount: currentRequest,
        metrics: {
          successfulChecks,
          failedChecks,
          totalRequests: requestCount
        }
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
    failedChecks++;
    log(currentRequest, "API key test failed:", apiError);
    
    return new Response(
      JSON.stringify({
        success: false,
        keyConfigured: true,
        message: `API key appears to be invalid or not working: ${apiError instanceof Error ? apiError.message : "Unknown error"}`,
        error: apiError instanceof Error ? apiError.message : "Unknown error",
        apiKeyFirstChars: RESEND_API_KEY.substring(0, 5),
        timestamp: new Date().toISOString(),
        functionUptime: `${Math.floor((Date.now() - functionStartTime) / 1000)} seconds`,
        metrics: {
          successfulChecks,
          failedChecks,
          totalRequests: requestCount
        }
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
};

// Log function initialization
console.log("check-resend-status function starting at:", new Date().toISOString());
console.log("RESEND_API_KEY configured:", !!RESEND_API_KEY);
if (RESEND_API_KEY) {
  console.log("RESEND_API_KEY starts with:", RESEND_API_KEY.substring(0, 5) + "...");
}

serve(handler);
