
import { corsHeaders } from "../utils/cors.ts";
import { logMessage, trackMetrics } from "../utils/logger.ts";
import { testApiKey } from "../services/keyTester.ts";
import { resend } from "../index.ts";

// Handle API key history check request
export const handleApiKeyHistoryCheck = async (requestId: number, currentApiKey: string, functionStartTime: number) => {
  // Previous API keys for verification
  const previousKeys = [
    "re_FYtCFWri_39ciqWYc9CEKpoa3JdkWdSwN",
    "re_9Qv59yHG_NMEwVDtURcNbdNoiYHjGhSmH",
    "re_hthmXL4A_LjaqCxvdzaHoz4QK6rif6UVb"
  ];
  
  const keyResults = [];
  
  // Current key test
  const currentKeyResult = await testApiKey(currentApiKey, requestId);
  keyResults.push({
    key: `${currentApiKey.substring(0, 10)}...`,
    isCurrent: true,
    ...currentKeyResult
  });
  
  // Previous keys tests
  for (const prevKey of previousKeys) {
    if (prevKey !== currentApiKey) { // Skip if same as current key
      const result = await testApiKey(prevKey, requestId);
      keyResults.push({
        key: `${prevKey.substring(0, 10)}...`,
        isCurrent: false,
        ...result
      });
    }
  }
  
  return new Response(
    JSON.stringify({
      success: true,
      message: "API key history check completed",
      currentKey: `${currentApiKey.substring(0, 10)}...`,
      keyResults,
      timestamp: new Date().toISOString(),
      functionUptime: `${Math.floor((Date.now() - functionStartTime) / 1000)} seconds`,
      requestCount: requestId
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    }
  );
};

// Handle API key status check request
export const handleApiKeyStatusCheck = async (requestId: number, apiKey: string, functionStartTime: number) => {
  // Do a real API call to check key validity - not just a mock check
  try {
    // First, try to get domain info (this is a real data operation)
    const domainResponse = await resend?.domains.get('gategaborone.com');
    
    if (domainResponse?.error) {
      logMessage(requestId, "Domain check failed but API may still be valid", domainResponse.error);
    } else {
      logMessage(requestId, "Domain check successful", { 
        domain: 'gategaborone.com',
        verified: domainResponse?.data?.verified,
        status: domainResponse?.data?.status
      });
    }
    
    // Next do a lightweight email send test
    const { data, error } = await resend?.emails.send({
      from: "Gate Gaborone <info@gategaborone.com>",
      to: ["test@resend.dev"], // Special test address that doesn't actually send emails
      subject: "API Key Validation Test",
      text: "This is a test to verify the API key is working.",
      tags: [{ name: "test", value: "true" }]
    }) || { data: null, error: { message: "Resend client not initialized" } };
    
    let isKeyValid = true;
    let message = "Resend API key is valid and working correctly.";
    let domainVerified = domainResponse?.data?.verified || false;
    let domainStatus = domainResponse?.data?.status || "unknown";
    
    // Check for error response
    if (error) {
      // Some errors indicate the key is valid but other issues exist
      if (error.statusCode === 400 && !error.message.includes("API key is invalid")) {
        // 400 error but not an invalid key (e.g. domain not verified)
        message = "Resend API key is valid but there are other issues: " + error.message;
      } else if (error.message?.includes("domain is not verified")) {
        // Domain verification error (key valid but domain needs verification)
        isKeyValid = true;
        domainVerified = false;
        message = "API key is valid but domain needs verification: " + error.message;
      } else {
        isKeyValid = false;
        message = "API key appears to be invalid: " + error.message;
      }
    }
    
    logMessage(requestId, "API check result:", { isKeyValid, message });
    
    trackMetrics(isKeyValid);
    
    return new Response(
      JSON.stringify({
        success: isKeyValid,
        keyConfigured: true,
        message: message,
        domainVerified,
        domainStatus,
        domainDetails: domainResponse?.data,
        domainVerificationRequired: !domainVerified,
        lastTestedAt: new Date().toISOString(),
        apiKeyFirstChars: apiKey.substring(0, 5),
        apiKey: `${apiKey.substring(0, 10)}...`,
        timestamp: new Date().toISOString(),
        functionUptime: `${Math.floor((Date.now() - functionStartTime) / 1000)} seconds`,
        requestCount: requestId,
        metrics: {
          successfulChecks: 0,
          failedChecks: 0,
          totalRequests: requestId
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
    trackMetrics(false);
    logMessage(requestId, "API key test failed:", apiError);
    
    return new Response(
      JSON.stringify({
        success: false,
        keyConfigured: true,
        message: `API key appears to be invalid or not working: ${apiError instanceof Error ? apiError.message : "Unknown error"}`,
        error: apiError instanceof Error ? apiError.message : "Unknown error",
        apiKeyFirstChars: apiKey.substring(0, 5),
        timestamp: new Date().toISOString(),
        functionUptime: `${Math.floor((Date.now() - functionStartTime) / 1000)} seconds`,
        metrics: {
          successfulChecks: 0,
          failedChecks: 0,
          totalRequests: requestId
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
