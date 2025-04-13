
import { corsHeaders } from "../utils/cors.ts";
import { testApiKey } from "../services/keyTester.ts";
import { logMessage, trackMetrics } from "../utils/logger.ts";
import { metrics } from "../index.ts";

// Handle API key status check
export const handleApiKeyStatusCheck = async (
  requestId: number, 
  apiKey: string,
  functionStartTime: number
): Promise<Response> => {
  try {
    logMessage(requestId, "Testing API key...");
    
    const testResult = await testApiKey(apiKey);
    const keyStatus = testResult.status;
    
    // Track success or failure in metrics
    trackMetrics(keyStatus === "valid");
    
    logMessage(requestId, `API key test result: ${keyStatus}`);
    
    // Calculate uptime in seconds
    const uptime = Math.floor((Date.now() - functionStartTime) / 1000);
    
    // Get uptime in a human-readable format
    const seconds = uptime % 60;
    const minutes = Math.floor(uptime / 60) % 60;
    const hours = Math.floor(uptime / 3600);
    const uptimeString = `${hours}h ${minutes}m ${seconds}s`;
    
    return new Response(
      JSON.stringify({
        success: keyStatus === "valid",
        keyConfigured: keyStatus === "valid",
        message: testResult.message,
        timestamp: new Date().toISOString(),
        apiKey: apiKey ? `${apiKey.substring(0, 10)}...` : "Not configured",
        apiKeyValid: keyStatus === "valid",
        functionUptime: uptimeString,
        requestsHandled: metrics.requestCount,
        error: keyStatus !== "valid" ? testResult.error : null,
        detailedStatus: testResult,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error) {
    metrics.failedChecks++;
    logMessage(requestId, "Error testing API key:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        keyConfigured: false,
        message: `Error testing API key: ${error instanceof Error ? error.message : "Unknown error"}`,
        timestamp: new Date().toISOString(),
        apiKey: apiKey ? `${apiKey.substring(0, 10)}...` : "Not configured",
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

// Handle API key history check
export const handleApiKeyHistoryCheck = async (
  requestId: number, 
  apiKey: string,
  functionStartTime: number
): Promise<Response> => {
  try {
    logMessage(requestId, "Checking API key usage history...");
    
    const testResult = await testApiKey(apiKey);
    const keyStatus = testResult.status;
    
    // Track success or failure in metrics
    trackMetrics(keyStatus === "valid");
    
    // Calculate uptime in seconds
    const uptime = Math.floor((Date.now() - functionStartTime) / 1000);
    
    return new Response(
      JSON.stringify({
        success: keyStatus === "valid",
        keyConfigured: keyStatus === "valid",
        message: testResult.message,
        timestamp: new Date().toISOString(),
        apiKey: apiKey ? `${apiKey.substring(0, 10)}...` : "Not configured",
        metrics: {
          totalRequests: metrics.requestCount,
          successfulChecks: metrics.successfulChecks,
          failedChecks: metrics.failedChecks,
          successRate: metrics.requestCount > 0 
            ? (metrics.successfulChecks / metrics.requestCount) * 100 
            : 0,
        },
        uptime: {
          seconds: uptime,
          formatted: `${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m ${uptime % 60}s`,
          startTime: new Date(Date.now() - uptime * 1000).toISOString(),
        },
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error) {
    metrics.failedChecks++;
    logMessage(requestId, "Error checking API key history:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        keyConfigured: false,
        message: `Error checking API key history: ${error instanceof Error ? error.message : "Unknown error"}`,
        timestamp: new Date().toISOString(),
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
