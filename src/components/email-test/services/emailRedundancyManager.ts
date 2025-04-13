
import { invokeEmailFunction } from './edgeFunctionService';
import { RedundancyResponse, ProviderHealth } from '../types';

/**
 * Send an email with automatic redundancy and failover
 */
export async function sendEmailWithRedundancy(emailData: any): Promise<RedundancyResponse> {
  try {
    console.log('Trying primary email provider (Resend)...');
    
    // Try primary provider first
    const primaryResult = await invokeEmailFunction('send-email', emailData);
    
    // If primary succeeded, return the result
    if (primaryResult.success && primaryResult.data?.success) {
      console.log('Email sent successfully via primary provider');
      return {
        success: true,
        data: primaryResult.data,
        provider: 'resend-primary'
      };
    }
    
    // Primary failed, try fallback
    console.log('Primary email provider failed, trying fallback...');
    console.log('Primary failure reason:', primaryResult.error || primaryResult.data?.error || 'Unknown error');
    
    const fallbackResult = await invokeEmailFunction('email-fallback', emailData);
    
    if (fallbackResult.success && fallbackResult.data?.success) {
      console.log('Email sent successfully via fallback provider');
      return {
        success: true,
        data: fallbackResult.data,
        provider: fallbackResult.data.provider || 'fallback',
        fallbackUsed: true,
        primaryError: primaryResult.error || primaryResult.data?.error || 'Primary provider failed'
      };
    }
    
    // Both primary and fallback failed
    console.error('All email providers failed');
    return {
      success: false,
      error: 'All email providers failed',
      primaryError: primaryResult.error || primaryResult.data?.error || 'Unknown primary error',
      provider: 'none'
    };
  } catch (error) {
    console.error('Error in email redundancy system:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error in redundancy system',
      provider: 'none'
    };
  }
}

/**
 * Check the health of email providers
 */
export async function checkEmailProvidersHealth(): Promise<ProviderHealth> {
  try {
    console.log('Checking health of email providers...');
    
    // Check primary provider (Resend)
    const primaryResult = await invokeEmailFunction('check-resend-status', {
      checkType: 'health-check',
      timestamp: Date.now()
    });
    
    // Check fallback provider
    const fallbackResult = await invokeEmailFunction('email-fallback', {
      checkType: 'health-check',
      timestamp: Date.now()
    });
    
    return {
      checking: false,
      primary: {
        available: primaryResult.success && primaryResult.data?.success === true,
        message: primaryResult.data?.message || (primaryResult.success ? 'Available' : 'Unavailable')
      },
      fallback: {
        available: fallbackResult.success && fallbackResult.data?.success,
        message: fallbackResult.data?.message || (fallbackResult.success ? 'Available' : 'Not configured')
      },
      lastChecked: new Date()
    };
  } catch (error) {
    console.error('Error checking provider health:', error);
    
    return {
      checking: false,
      primary: {
        available: false,
        message: 'Error checking: ' + (error instanceof Error ? error.message : 'Unknown error')
      },
      fallback: {
        available: false,
        message: 'Error checking fallback service'
      },
      lastChecked: new Date()
    };
  }
}
