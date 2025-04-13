
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
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") || "re_bGSLW5ST_HXvVo4ZUjY88qADUKpSd42Ac";

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
    // Parse request
    const requestData = await req.json().catch(() => ({}));
    const checkHistory = requestData.checkHistory === true;
    
    // Check if the request wants to compare with previous API keys
    if (checkHistory) {
      // Previous API keys for verification
      const previousKeys = [
        "re_FYtCFWri_39ciqWYc9CEKpoa3JdkWdSwN",
        "re_9Qv59yHG_NMEwVDtURcNbdNoiYHjGhSmH",
        "re_hthmXL4A_LjaqCxvdzaHoz4QK6rif6UVb"
      ];
      
      const keyResults = [];
      
      // Current key test
      const currentKeyResult = await testApiKey(RESEND_API_KEY, currentRequest);
      keyResults.push({
        key: `${RESEND_API_KEY.substring(0, 10)}...`,
        isCurrent: true,
        ...currentKeyResult
      });
      
      // Previous keys tests
      for (const prevKey of previousKeys) {
        if (prevKey !== RESEND_API_KEY) { // Skip if same as current key
          const result = await testApiKey(prevKey, currentRequest);
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
          currentKey: `${RESEND_API_KEY.substring(0, 10)}...`,
          keyResults,
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
    }
    
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
    let domainVerified = true;
    
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
    
    log(currentRequest, "API check result:", { isKeyValid, message });
    
    isKeyValid ? successfulChecks++ : failedChecks++;
    
    return new Response(
      JSON.stringify({
        success: isKeyValid,
        keyConfigured: true,
        message: message,
        domainVerified,
        domainVerificationRequired: !domainVerified,
        lastTestedAt: new Date().toISOString(),
        apiKeyFirstChars: RESEND_API_KEY.substring(0, 5),
        apiKey: `${RESEND_API_KEY.substring(0, 10)}...`,
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

// Helper function to test a specific API key
async function testApiKey(apiKey: string, requestId: number) {
  try {
    const tempResend = new Resend(apiKey);
    const { data, error } = await tempResend.emails.send({
      from: "Gate Gaborone <info@gategaborone.com>",
      to: ["test@resend.dev"],
      subject: "API Key Test",
      text: "This is a key validation test.",
    });
    
    if (error) {
      // Analyze the error to determine key validity and domain status
      if (error.message?.includes("domain is not verified")) {
        return {
          isValid: true,
          domainVerified: false,
          statusCode: error.statusCode,
          message: error.message,
          error: "Domain not verified"
        };
      } else if (error.statusCode === 400 && !error.message.includes("API key is invalid")) {
        return {
          isValid: true,
          domainVerified: false,
          statusCode: error.statusCode,
          message: error.message,
          error: "Configuration issue"
        };
      } else {
        return {
          isValid: false,
          domainVerified: false,
          statusCode: error.statusCode,
          message: error.message,
          error: "Invalid key"
        };
      }
    }
    
    return {
      isValid: true,
      domainVerified: true,
      statusCode: 200,
      message: "Key valid and domain verified"
    };
  } catch (error) {
    log(requestId, `Test failed for key ${apiKey.substring(0, 5)}...`, error);
    return {
      isValid: false,
      domainVerified: false,
      statusCode: 500,
      message: error instanceof Error ? error.message : "Unknown error",
      error: "Test failed"
    };
  }
}

// Log function initialization
console.log("check-resend-status function starting at:", new Date().toISOString());
console.log("RESEND_API_KEY configured:", !!RESEND_API_KEY);
if (RESEND_API_KEY) {
  console.log("RESEND_API_KEY starts with:", RESEND_API_KEY.substring(0, 5) + "...");
}

serve(handler);
