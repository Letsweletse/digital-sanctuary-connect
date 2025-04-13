
import { invokeEmailFunction } from './edgeFunctionService';
import { prepareEmailData } from './emailValidationService';
import { sendDirectToResend } from './directResendService';
import { getStoredResendApiKey } from '@/lib/directResendService';

/**
 * Check the health of email providers
 * @returns Status of primary and fallback email providers
 */
export const checkEmailProvidersHealth = async () => {
  console.log('Checking email provider health...');
  
  // Default health status
  const healthStatus = {
    primary: {
      available: false,
      message: 'Not checked'
    },
    fallback: {
      available: false,
      message: 'Not checked'
    },
    lastChecked: new Date()
  };
  
  try {
    // Check primary provider (Resend via send-email function)
    console.log('Checking primary email provider (Resend)...');
    const primaryCheck = await invokeEmailFunction('check-resend-status', {
      timestamp: Date.now(),
      checkType: 'health-check'
    });
    
    if (primaryCheck.success && primaryCheck.data) {
      const data = primaryCheck.data;
      healthStatus.primary.available = data.success === true && 
                                      (data.apiConnected === true || data.keyConfigured === true);
      healthStatus.primary.message = data.success ? 
                                    'Resend API is connected and configured correctly' : 
                                    (data.message || 'API key may not be configured correctly');
    } else {
      healthStatus.primary.message = primaryCheck.error || 'Failed to check primary provider';
    }
    
    // Check fallback provider (SendGrid/email-fallback function)
    console.log('Checking fallback email provider...');
    try {
      const fallbackCheck = await invokeEmailFunction('email-fallback', {
        checkType: 'health-check',
        timestamp: Date.now()
      });
      
      if (fallbackCheck.success && fallbackCheck.data) {
        healthStatus.fallback.available = fallbackCheck.data.success === true;
        healthStatus.fallback.message = fallbackCheck.data.message || 'Fallback provider is available';
      } else {
        healthStatus.fallback.message = fallbackCheck.error || 'Failed to check fallback provider';
      }
    } catch (fallbackError) {
      console.error('Error checking fallback provider:', fallbackError);
      healthStatus.fallback.message = 'Error checking fallback: ' + 
                                    (fallbackError instanceof Error ? fallbackError.message : 'Unknown error');
    }
    
    // Check if we have direct Resend API access configured
    const directApiKey = getStoredResendApiKey();
    if (directApiKey) {
      console.log('Direct Resend API access is configured');
      // We don't need to test it here, just note that it's configured
    }
    
    console.log('Provider health check results:', healthStatus);
    return healthStatus;
  } catch (error) {
    console.error('Error checking provider health:', error);
    healthStatus.primary.message = 'Error checking providers: ' + 
                                  (error instanceof Error ? error.message : 'Unknown error');
    return healthStatus;
  }
};

/**
 * Send email with redundancy - automatically fallback if primary fails
 * Enhanced with better direct to Resend routing and bypass options
 */
export const sendEmailWithRedundancy = async (emailData: any) => {
  const prepared = prepareEmailData(emailData);
  console.log('Sending email with redundancy system, data:', prepared);
  
  // Check if direct bypass mode is enabled
  const useDirectMode = localStorage.getItem('use_direct_resend_mode') === 'true';
  const directApiKey = getStoredResendApiKey();
  
  if (useDirectMode && directApiKey) {
    console.log('Direct Resend API mode is enabled, bypassing Edge Functions');
    try {
      const directResult = await sendDirectToResend(prepared);
      
      if (directResult.success) {
        console.log('Successfully sent via direct Resend API!');
        return {
          success: true,
          provider: 'direct-resend',
          bypassMode: true,
          data: directResult
        };
      }
      
      console.warn('Direct Resend API failed, falling back to regular flow:', directResult.message);
    } catch (directError) {
      console.error('Error in direct Resend API mode:', directError);
    }
  }
  
  // First try direct primary provider
  try {
    console.log('Attempting to send via primary provider (Resend)...');
    const primaryResult = await invokeEmailFunction('send-email', {
      ...prepared,
      timestamp: Date.now()
    });
    
    // If successful, return the result
    if (primaryResult.success && primaryResult.data && primaryResult.data.success) {
      console.log('Primary provider successfully sent email');
      return {
        success: true,
        provider: 'resend',
        fallbackUsed: false,
        data: primaryResult.data
      };
    }
    
    console.warn('Primary provider failed, error:', primaryResult.error || (primaryResult.data?.error));
    
    // If we hit edge function shutdown or non-2xx error, try direct Resend API
    // This is an enhancement to bypass Supabase Edge Functions when they're failing
    if ((primaryResult.error?.includes('non-2xx status code') || 
        primaryResult.error?.includes('shutdown') ||
        primaryResult.statusCode >= 500) && 
        directApiKey) {
      
      console.log('Attempting direct Resend API connection (bypassing Supabase)...');
      
      try {
        // Try direct Resend API access as first fallback
        const directFallbackResult = await sendDirectToResend(prepared);
        
        if (directFallbackResult.success) {
          console.log('Successfully sent via direct Resend API connection!');
          return {
            success: true,
            provider: 'direct-resend',
            fallbackUsed: true,
            bypassMode: true,
            primaryError: primaryResult.error || 'Edge Function error',
            data: directFallbackResult
          };
        }
      } catch (directError) {
        console.error('Error in direct Resend fallback:', directError);
      }
    }
    
    // Try email-fallback endpoint if direct connection also failed
    console.log('Attempting to send via fallback provider...');
    const fallbackResult = await invokeEmailFunction('email-fallback', {
      ...prepared,
      timestamp: Date.now()
    });
    
    if (fallbackResult.success) {
      console.log('Fallback provider successfully sent email');
      return {
        success: true,
        provider: 'sendgrid',
        fallbackUsed: true,
        primaryError: primaryResult.error || (primaryResult.data?.error || 'Unknown error'),
        data: fallbackResult.data
      };
    }
    
    // Both providers failed
    console.error('All providers failed to send email');
    return {
      success: false,
      error: 'All email providers failed',
      primaryError: primaryResult.error || (primaryResult.data?.error || 'Unknown error'),
      fallbackError: fallbackResult.error || 'Fallback provider failed'
    };
    
  } catch (error) {
    console.error('Error in email redundancy system:', error);
    
    // Try direct Resend if available
    if (directApiKey) {
      try {
        console.log('Attempting direct Resend API as emergency fallback...');
        const directEmergencyResult = await sendDirectToResend(prepared);
        
        if (directEmergencyResult.success) {
          return {
            success: true,
            provider: 'emergency-direct-resend',
            fallbackUsed: true,
            bypassMode: true,
            primaryError: error instanceof Error ? error.message : 'System error',
            data: directEmergencyResult
          };
        }
      } catch (directError) {
        console.error('Error in emergency direct Resend:', directError);
      }
    }
    
    // Try fallback as last resort
    try {
      console.log('Attempting emergency fallback after system error...');
      const emergencyResult = await invokeEmailFunction('email-fallback', {
        ...prepared,
        timestamp: Date.now(),
        emergency: true
      });
      
      if (emergencyResult.success) {
        return {
          success: true,
          provider: 'emergency-fallback',
          fallbackUsed: true,
          primaryError: error instanceof Error ? error.message : 'System error',
          data: emergencyResult.data
        };
      }
      
      return {
        success: false,
        error: 'Email sending completely failed',
        details: error instanceof Error ? error.message : 'Unknown system error'
      };
    } catch (fallbackError) {
      return {
        success: false,
        error: 'Complete email system failure',
        primaryError: error instanceof Error ? error.message : 'Primary system error',
        fallbackError: fallbackError instanceof Error ? fallbackError.message : 'Fallback system error'
      };
    }
  }
};
