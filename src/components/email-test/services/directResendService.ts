
import { getStoredResendApiKey, sendDirectResendEmail, enableDirectMode } from '@/lib/directResendService';
import { prepareEmailData } from './emailValidationService';
import { toast } from 'sonner';

/**
 * Send email directly to Resend API, bypassing Supabase Edge Functions
 */
export async function sendDirectToResend(emailData: any) {
  console.log('Attempting to send directly to Resend API, bypassing Supabase');
  
  const apiKey = getStoredResendApiKey();
  
  if (!apiKey) {
    console.error('⚠️ NO DIRECT API KEY FOUND - Email delivery may fail!');
    toast.error('No Resend API key configured', {
      description: 'Please add your API key in the Admin > Email Test section.'
    });
    
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
    
    // Force direct mode to be enabled since we're using this method
    enableDirectMode();
    
    // Log sending details for debugging
    console.log('DIRECT EMAIL SEND: Sending to:', Array.isArray(prepared.to) ? prepared.to.join(', ') : prepared.to);
    console.log('DIRECT EMAIL SEND: Subject:', prepared.subject);
    console.log('DIRECT EMAIL SEND: Using API key:', `${apiKey.substring(0, 5)}...${apiKey.substring(apiKey.length - 4)}`);
    
    // Confirm in the UI we're attempting to send
    toast.info('Sending email directly via Resend API...', {
      duration: 3000
    });
    
    // Send directly to Resend API with multiple retries if needed
    const result = await sendDirectResendEmail(apiKey, prepared);
    
    // Log the complete result for debugging
    console.log('Direct to Resend complete result:', JSON.stringify(result, null, 2));
    
    // Provide user feedback
    if (result.success) {
      toast.success('Email sent successfully via Direct Resend API', {
        description: `Email sent to ${Array.isArray(prepared.to) ? prepared.to.join(', ') : prepared.to}`,
        duration: 5000
      });
    } else {
      toast.error('Failed to send email via Direct Resend API', {
        description: result.message || 'Unknown error',
        duration: 5000
      });
    }
    
    return {
      ...result,
      bypassMode: true
    };
  } catch (error) {
    console.error('Error in direct send to Resend:', error);
    
    toast.error('Error sending email directly', {
      description: error instanceof Error ? error.message : 'Unknown error in direct Resend send',
      duration: 5000
    });
    
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
    
    console.log('Testing direct Resend API key:', `${keyToTest.substring(0, 3)}...${keyToTest.substring(keyToTest.length - 3)}`);
    
    // Send a test email to validate the API key
    const testResult = await sendDirectResendEmail(keyToTest, {
      to: "test@resend.dev", // Resend's test email address
      subject: "API Key Validation",
      text: "This is a test to validate the API key",
      from: "onboarding@resend.dev" // Use Resend's verified sender for testing
    });
    
    console.log('API key test result:', testResult);
    
    return {
      success: testResult.success,
      message: testResult.success ? 
        'API key is valid and working correctly' : 
        testResult.message || 'API key validation failed'
    };
  } catch (error) {
    console.error('Error testing API key:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error testing API key'
    };
  }
}

/**
 * Force the direct mode for an event registration
 */
export function forceDirectModeForRegistration() {
  enableDirectMode();
  console.log('⚠️ IMPORTANT: Direct mode FORCED for registration - bypassing Supabase Edge Functions');
  toast.info('Using direct email mode', {
    description: 'Bypassing Supabase Edge Functions for more reliable delivery',
    duration: 3000
  });
  return true;
}
