
import { sendTestEmail } from './emailTestService';
import { sendFallbackEmail } from './fallbackEmailService';
import { invokeEmailFunction } from './edgeFunctionService';

/**
 * Email redundancy manager to handle failover between different email providers
 */
export const sendEmailWithRedundancy = async (emailData: any): Promise<{
  success: boolean;
  data?: any;
  error?: string;
  provider?: string;
  fallbackUsed?: boolean;
}> => {
  try {
    console.log('Sending email with redundancy management...');
    
    // Add reliability tracking to the request
    const requestWithTracking = {
      ...emailData,
      reliabilityTracking: {
        attemptTimestamp: Date.now(),
        clientType: 'web-redundancy-system',
        retryCount: 0
      }
    };
    
    // First try with primary provider (Resend via send-email function)
    console.log('Attempting primary email provider...');
    const primaryResult = await sendTestEmail(requestWithTracking);
    
    if (primaryResult.success) {
      console.log('Primary email provider succeeded');
      return {
        ...primaryResult,
        provider: 'primary',
        fallbackUsed: false
      };
    }
    
    // If primary fails, try with fallback provider
    console.log('Primary email provider failed, switching to fallback...');
    console.log('Failure reason:', primaryResult.error);
    
    // Update tracking information
    const fallbackRequest = {
      ...requestWithTracking,
      reliabilityTracking: {
        ...requestWithTracking.reliabilityTracking,
        retryCount: 1,
        primaryProviderError: primaryResult.error,
        failoverTimestamp: Date.now()
      }
    };
    
    const fallbackResult = await sendFallbackEmail(fallbackRequest);
    
    // Return fallback result with additional info
    return {
      ...fallbackResult,
      fallbackUsed: true,
      primaryError: primaryResult.error
    };
  } catch (err) {
    console.error('Error in email redundancy manager:', err);
    const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
    
    return {
      success: false,
      error: `Both primary and fallback providers failed. Error: ${errorMessage}`,
      fallbackUsed: true
    };
  }
};

/**
 * Check the health of all email providers
 */
export const checkEmailProvidersHealth = async (): Promise<{
  primary: {
    available: boolean;
    message?: string;
  };
  fallback: {
    available: boolean;
    message?: string;
  };
}> => {
  const result = {
    primary: {
      available: false,
      message: 'Not checked'
    },
    fallback: {
      available: false,
      message: 'Not checked'
    }
  };
  
  try {
    // Check primary provider (Resend)
    const primaryCheck = await invokeEmailFunction('check-resend-status', {
      checkType: 'health-check',
      timestamp: Date.now()
    });
    
    result.primary.available = primaryCheck.success;
    result.primary.message = primaryCheck.success 
      ? 'Provider is available'
      : primaryCheck.error || 'Provider is unavailable';
    
    // Check fallback provider
    const fallbackCheck = await invokeEmailFunction('email-fallback', {
      checkType: 'health-check',
      timestamp: Date.now()
    });
    
    result.fallback.available = fallbackCheck.success;
    result.fallback.message = fallbackCheck.success
      ? 'Provider is available'
      : fallbackCheck.error || 'Provider is unavailable';
    
    return result;
  } catch (err) {
    console.error('Error checking email providers health:', err);
    return result;
  }
};
