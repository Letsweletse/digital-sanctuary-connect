
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { corsHeaders, handleCorsRequest } from "./utils/cors.ts";
import { testApiKey, testExternalApiKey } from "./services/keyTester.ts";
import { logMessage, trackMetrics } from "./utils/logger.ts";
import { handleApiKeyStatusCheck, handleApiKeyHistoryCheck } from "./handlers/statusHandler.ts";

// Track function uptime and request count
const functionStartTime = Date.now();
export const metrics = {
  requestCount: 0,
  successfulChecks: 0,
  failedChecks: 0
};

// Get API key from environment or use the provided key
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") || "";

// Initialize Resend client
export const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

const handler = async (req: Request): Promise<Response> => {
  // Increment request counter
  metrics.requestCount++;
  const currentRequest = metrics.requestCount;
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return handleCorsRequest();
  }

  logMessage(currentRequest, "Checking Resend API key status");
  logMessage(currentRequest, "Function uptime:", Math.floor((Date.now() - functionStartTime) / 1000) + " seconds");
  logMessage(currentRequest, "Total requests handled:", currentRequest);
  
  try {
    // Parse request
    const requestData = await req.json().catch(() => ({}));
    const checkHistory = requestData.checkHistory === true;
    const checkType = requestData.checkType || 'status-check';
    const externalApiKey = requestData.externalApiKey;
    
    // If this is a request to test an external API key
    if (checkType === 'direct-key-test' && externalApiKey) {
      logMessage(currentRequest, "Testing external API key");
      
      const testResult = await testExternalApiKey(externalApiKey);
      
      return new Response(
        JSON.stringify({
          success: testResult.valid,
          message: testResult.message,
          details: testResult.details,
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
    
    if (checkHistory) {
      return handleApiKeyHistoryCheck(currentRequest, RESEND_API_KEY, functionStartTime);
    } else {
      return handleApiKeyStatusCheck(currentRequest, RESEND_API_KEY, functionStartTime);
    }
  } catch (error) {
    metrics.failedChecks++;
    logMessage(currentRequest, "Error in function execution:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        message: `Error checking API key: ${error instanceof Error ? error.message : "Unknown error"}`,
        timestamp: new Date().toISOString(),
        apiKey: RESEND_API_KEY ? `${RESEND_API_KEY.substring(0, 5)}...` : "Not configured",
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

serve(handler);
