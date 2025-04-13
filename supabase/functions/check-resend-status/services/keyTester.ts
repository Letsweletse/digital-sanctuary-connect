
import { Resend } from "npm:resend@2.0.0";
import { logMessage } from "../utils/logger.ts";

// Helper function to test a specific API key
export async function testApiKey(apiKey: string, requestId: number) {
  try {
    const tempResend = new Resend(apiKey);
    
    // First check domain information
    const domainResult = await tempResend.domains.get('gategaborone.com');
    
    // Then do a test email
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
          domainDetails: domainResult.data,
          statusCode: error.statusCode,
          message: error.message,
          error: "Domain not verified"
        };
      } else if (error.statusCode === 400 && !error.message.includes("API key is invalid")) {
        return {
          isValid: true,
          domainVerified: false,
          domainDetails: domainResult.data,
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
      domainVerified: domainResult.data?.verified || false,
      domainStatus: domainResult.data?.status || "unknown",
      domainDetails: domainResult.data,
      statusCode: 200,
      message: "Key valid" + (domainResult.data?.verified ? " and domain verified" : " but domain verification status unknown")
    };
  } catch (error) {
    logMessage(requestId, `Test failed for key ${apiKey.substring(0, 5)}...`, error);
    return {
      isValid: false,
      domainVerified: false,
      statusCode: 500,
      message: error instanceof Error ? error.message : "Unknown error",
      error: "Test failed"
    };
  }
}
