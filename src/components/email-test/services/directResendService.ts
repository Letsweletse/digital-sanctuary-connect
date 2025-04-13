
import { getStoredResendApiKey, sendDirectResendEmail } from '@/lib/directResendService';
import { prepareEmailData } from './emailValidationService';

/**
 * Send email directly to Resend API, bypassing Supabase Edge Functions
 */
export async function sendDirectToResend(emailData: any) {
  console.log('Attempting to send directly to Resend API, bypassing Supabase');
  
  const apiKey = getStoredResendApiKey();
  
  if (!apiKey) {
    return {
      success: false,
      message: 'No Resend API key found in local storage. Please add your API key in the Direct Resend API Access section.',
      provider: 'direct-resend',
      timestamp: new Date().toISOString()
    };
  }
  
  try {
    // Prepare the email data
    const prepared = prepareEmailData(emailData);
    
    // Send directly to Resend API
    const result = await sendDirectResendEmail(apiKey, prepared);
    
    return {
      ...result,
      bypassMode: true
    };
  } catch (error) {
    console.error('Error in direct send to Resend:', error);
    
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error in direct Resend send',
      provider: 'direct-resend',
      bypassMode: true,
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Test if stored Resend API key is valid
 */
export async function testDirectResendApiKey(apiKey?: string): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    const keyToTest = apiKey || getStoredResendApiKey();
    
    if (!keyToTest) {
      return {
        success: false,
        message: 'No API key provided'
      };
    }
    
    // Send a test email to validate the API key
    const testResult = await sendDirectResendEmail(keyToTest, {
      to: "test@resend.dev", // Resend's test email address
      subject: "API Key Validation",
      text: "This is a test to validate the API key"
    });
    
    return {
      success: testResult.success,
      message: testResult.success ? 
        'API key is valid and working correctly' : 
        testResult.message || 'API key validation failed'
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error testing API key'
    };
  }
}
