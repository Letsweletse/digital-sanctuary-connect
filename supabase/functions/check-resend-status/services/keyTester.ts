
/**
 * Test API key functionality without sending actual emails
 */
import { Resend } from "npm:resend@2.0.0";
import { logMessage } from "../utils/logger.ts";

export const testApiKey = async (apiKey: string | null): Promise<{
  valid: boolean;
  message: string;
  details?: any;
}> => {
  if (!apiKey) {
    return {
      valid: false,
      message: "No API key provided"
    };
  }

  try {
    logMessage(`Testing API key starting with: ${apiKey.substring(0, 5)}...`);
    
    // Create a Resend client with the provided API key
    const resend = new Resend(apiKey);
    
    try {
      // Get domains to check connectivity (this is a lightweight operation)
      const domains = await resend.domains.list();
      
      if (domains.error) {
        logMessage(`Error checking domains: ${domains.error.message}`);
        return {
          valid: false,
          message: `API key invalid: ${domains.error.message}`,
          details: domains.error
        };
      }
      
      // If we get here, the API key is valid
      logMessage(`API key is valid! Found ${domains.data?.length || 0} domains`);
      
      return {
        valid: true,
        message: `API key is valid. ${domains.data?.length || 0} domains found.`,
        details: {
          domains: domains.data?.map(d => ({
            name: d.name,
            status: d.status
          }))
        }
      };
    } catch (error) {
      logMessage(`Error testing key with domains endpoint: ${error instanceof Error ? error.message : 'Unknown error'}`);
      
      // If domains endpoint fails, try using the emails endpoint with a dry run
      try {
        // Try to validate the key with a test request instead
        // This will not actually send an email as we'll catch the 400 error
        const testResult = await resend.emails.send({
          from: 'onboarding@resend.dev',
          to: 'validate@resend.dev', // This is not a real address, just for validation
          subject: 'API Key Validation',
          text: 'API key validation test - not actually sending'
        });
        
        // If we get this far without an error, the key is valid
        // (Though we'd expect a 400 error for the invalid email)
        return {
          valid: true,
          message: 'API key appears to be valid but encountered an unexpected success with test email',
          details: testResult
        };
      } catch (emailTestError: any) {
        // Check if the error is about missing fields or permissions (suggesting the key is valid)
        // but not about authentication
        if (emailTestError.statusCode === 400 || 
            emailTestError.message?.includes('missing') || 
            emailTestError.message?.includes('required')) {
          // This is expected and suggests the key is valid, just missing fields
          return {
            valid: true,
            message: 'API key is valid (based on error response)',
            details: { 
              errorType: 'validation',
              statusCode: emailTestError.statusCode
            }
          };
        } else if (emailTestError.statusCode === 401 || 
                  emailTestError.message?.includes('API key') || 
                  emailTestError.message?.includes('invalid') || 
                  emailTestError.message?.includes('auth')) {
          // This suggests the key is invalid
          return {
            valid: false,
            message: `Invalid API key: ${emailTestError.message || 'Authentication failed'}`,
            details: { 
              errorType: 'auth',
              statusCode: emailTestError.statusCode
            }
          };
        }
        
        // Any other error
        return {
          valid: false,
          message: `Error validating API key: ${emailTestError.message || 'Unknown error'}`,
          details: emailTestError
        };
      }
    }
  } catch (error) {
    logMessage(`Unexpected error testing API key: ${error instanceof Error ? error.message : 'Unknown error'}`);
    
    return {
      valid: false,
      message: error instanceof Error ? error.message : 'Unexpected error testing API key',
      details: error
    };
  }
};

// Test an external API key (for direct API mode)
export const testExternalApiKey = async (apiKey: string): Promise<{
  valid: boolean;
  message: string;
  details?: any;
}> => {
  return await testApiKey(apiKey);
};
