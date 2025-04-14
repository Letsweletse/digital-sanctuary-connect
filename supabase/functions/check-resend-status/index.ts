
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
  failedChecks: 0,
  duplicateRequests: 0
};

// Track processed requests to prevent duplicates
const processedRequests = new Map();

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
    
    // Generate a unique request ID
    const requestId = requestData.requestId || 
                     `check-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
                     
    // Check if this is a duplicate request
    if (processedRequests.has(requestId)) {
      metrics.duplicateRequests++;
      logMessage(currentRequest, `⚠️ DUPLICATE REQUEST DETECTED: ${requestId} (already processed)`);
      
      return new Response(
        JSON.stringify({
          success: true,
          alreadyProcessed: true,
          duplicateRequest: true,
          message: "This request was already processed",
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
    }
    
    const checkHistory = requestData.checkHistory === true;
    const checkType = requestData.checkType || 'status-check';
    const externalApiKey = requestData.externalApiKey;
    
    // Store this request ID to prevent duplicates
    processedRequests.set(requestId, { timestamp: Date.now(), type: checkType });
    
    // Cleanup old entries to prevent memory leaks
    if (processedRequests.size > 100) {
      const keysToDelete = Array.from(processedRequests.keys()).slice(0, processedRequests.size - 100);
      keysToDelete.forEach(key => processedRequests.delete(key));
    }
    
    // If this is a request to test an external API key
    if (checkType === 'direct-key-test' && externalApiKey) {
      logMessage(currentRequest, "Testing external API key");
      
      const testResult = await testExternalApiKey(externalApiKey);
      
      return new Response(
        JSON.stringify({
          success: testResult.valid,
          message: testResult.message,
          details: testResult.details,
          timestamp: new Date().toISOString(),
          requestId: requestId
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

// Handle function shutdown
addEventListener("beforeunload", (event) => {
  logMessage("SHUTDOWN", "Function shutting down after handling", metrics.requestCount, "requests");
  logMessage("SHUTDOWN", "Shutdown reason:", event.detail?.reason || "unknown");
  logMessage("SHUTDOWN", "Function ran for", Math.floor((Date.now() - functionStartTime) / 1000), "seconds");
  logMessage("SHUTDOWN", "Metrics:", JSON.stringify(metrics));
});

// Log function initialization
console.log("check-resend-status function starting at:", new Date().toISOString());
console.log("RESEND_API_KEY configured:", !!RESEND_API_KEY);
if (RESEND_API_KEY) {
  console.log("RESEND_API_KEY starts with:", RESEND_API_KEY.substring(0, 5) + "...");
}

serve(handler);
