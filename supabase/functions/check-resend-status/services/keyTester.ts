
import { Resend } from "npm:resend@2.0.0";
import { logMessage } from "../utils/logger.ts";

interface ApiKeyTestResult {
  status: "valid" | "invalid" | "error";
  message: string;
  error?: string;
  timestamp: string;
  details?: any;
  connectionVerified?: boolean;
}

/**
 * Test if a Resend API key is valid by making a simple API call
 */
export const testApiKey = async (apiKey: string): Promise<ApiKeyTestResult> => {
  if (!apiKey || apiKey.trim() === "") {
    return {
      status: "invalid",
      message: "No API key provided",
      error: "API key is missing or empty",
      timestamp: new Date().toISOString(),
      connectionVerified: false
    };
  }

  // Quick format validation (Resend keys start with re_)
  if (!apiKey.startsWith("re_")) {
    return {
      status: "invalid",
      message: "API key has incorrect format",
      error: "API key should start with 're_'",
      timestamp: new Date().toISOString(),
      connectionVerified: false
    };
  }

  try {
    // Create a Resend client with the provided key
    const resend = new Resend(apiKey);
    
    logMessage(0, `Testing API key: ${apiKey.substring(0, 10)}...`);
    
    // Try to get account info to check if the API key is valid
    let data;
    let error;
    
    try {
      const result = await resend.domains.list();
      data = result.data;
      error = result.error;
    } catch (apiError) {
      // Handle connection errors separately
      return {
        status: "error",
        message: `Failed to connect to Resend API: ${apiError instanceof Error ? apiError.message : "Unknown error"}`,
        error: apiError instanceof Error ? apiError.message : "Connection error",
        timestamp: new Date().toISOString(),
        connectionVerified: false,
        details: apiError
      };
    }
    
    if (error) {
      logMessage(0, "API key test failed:", error);
      
      // Check if this is an authentication error
      const isAuthError = error.message?.includes("Unauthorized") || 
                         error.message?.includes("authentication") || 
                         error.statusCode === 401;
      
      return {
        status: "invalid",
        message: isAuthError ? `API key is invalid: ${error.message}` : `Error with Resend API: ${error.message}`,
        error: error.message,
        timestamp: new Date().toISOString(),
        connectionVerified: true, // We connected but the key was invalid
        details: error,
      };
    }
    
    // Check if we got a proper response
    if (!data) {
      return {
        status: "error",
        message: "API key test returned no data",
        error: "Empty response from Resend API",
        timestamp: new Date().toISOString(),
        connectionVerified: true // We connected but got an empty response
      };
    }
    
    // Key is valid - check if domains are set up
    let domainsFound = false;
    let domainVerified = false;
    
    if (Array.isArray(data) && data.length > 0) {
      domainsFound = true;
      // Check if any domain is verified
      domainVerified = data.some(domain => domain.status === "verified");
    }
    
    return {
      status: "valid",
      message: domainsFound 
        ? (domainVerified 
            ? "API key is valid and has verified domains" 
            : "API key is valid but no verified domains found")
        : "API key is valid but no domains are configured",
      timestamp: new Date().toISOString(),
      connectionVerified: true,
      details: {
        domains: {
          count: data.length,
          verified: data.filter(d => d.status === "verified").length,
          list: data.map(d => ({ id: d.id, name: d.name, status: d.status }))
        }
      }
    };
  } catch (error) {
    logMessage(0, "Error testing API key:", error);
    
    // Check for specific error types
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    const isAuthError = errorMessage.includes("Unauthorized") || 
                        errorMessage.includes("401") ||
                        errorMessage.includes("API key");
    
    return {
      status: "error",
      message: isAuthError 
        ? "API key authentication failed" 
        : "Error testing API key",
      error: errorMessage,
      timestamp: new Date().toISOString(),
      connectionVerified: false,
      details: error
    };
  }
};
