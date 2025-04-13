
import { invokeEmailFunction } from './edgeFunctionService';
import { toast } from 'sonner';
import { ProviderHealth, RedundancyResponse } from '../types';

/**
 * Send email with redundancy system
 * This will try the primary provider first, then fall back to secondary
 */
export async function sendEmailWithRedundancy(emailData: any): Promise<RedundancyResponse> {
  try {
    console.log('Attempting to send email with primary provider...');
    
    // First attempt with primary provider (Resend)
    const primaryResult = await invokeEmailFunction('send-email', {
      ...emailData,
      _timestamp: Date.now(),
      _provider: 'primary'
    });
    
    // If primary is successful, return the result
    if (primaryResult.success) {
      console.log('Primary provider successful');
      return {
        success: true,
        data: primaryResult.data,
        provider: 'Resend',
        fallbackUsed: false
      };
    }
    
    // If primary fails, attempt with fallback
    console.warn('Primary provider failed, falling back to secondary provider');
    console.error('Primary error:', primaryResult.error);
    
    // Show toast notification about primary failure
    toast.warning('Primary email provider failed', {
      description: 'Attempting to send via backup system...',
      duration: 5000
    });
    
    // Attempt with fallback provider (SendGrid via email-fallback function)
    const fallbackResult = await invokeEmailFunction('email-fallback', {
      ...emailData,
      _timestamp: Date.now(),
      _provider: 'fallback',
      _primaryError: primaryResult.error
    });
    
    if (fallbackResult.success) {
      console.log('Fallback provider successful');
      
      // Show success notification about fallback
      toast.success('Email sent via backup system', {
        description: 'Your message was delivered using the backup email provider.',
        duration: 5000
      });
      
      return {
        success: true,
        data: fallbackResult.data,
        provider: 'SendGrid',
        fallbackUsed: true,
        primaryError: primaryResult.error
      };
    }
    
    // Both providers failed
    console.error('Both providers failed');
    console.error('Primary error:', primaryResult.error);
    console.error('Fallback error:', fallbackResult.error);
    
    toast.error('Email delivery failed', {
      description: 'All email providers failed to deliver your message. Please try again later.',
      duration: 0 // Keep visible until dismissed
    });
    
    return {
      success: false,
      error: `All email providers failed. Primary: ${primaryResult.error}. Fallback: ${fallbackResult.error}`,
      fallbackUsed: true,
      primaryError: primaryResult.error
    };
  } catch (error) {
    console.error('Error in redundancy system:', error);
    
    toast.error('Email system error', {
      description: error instanceof Error ? error.message : 'Unknown error in email delivery system',
      duration: 0 // Keep visible until dismissed
    });
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error in redundancy system',
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
      timestamp: Date.now(),
      checkType: 'health-check'
    });
    
    // Check fallback provider
    const fallbackResult = await invokeEmailFunction('email-fallback', {
      _timestamp: Date.now(),
      requestType: 'health-check'
    });
    
    // Determine primary provider status
    const primaryStatus = {
      available: primaryResult.success && 
                 primaryResult.data && 
                 (primaryResult.data.keyConfigured || primaryResult.data.success),
      message: primaryResult.success ? 
               (primaryResult.data?.message || 'API key is active') : 
               (primaryResult.error || 'Unknown error')
    };
    
    // Determine fallback provider status
    const fallbackStatus = {
      available: fallbackResult.success && fallbackResult.data?.available,
      message: fallbackResult.success ? 
               (fallbackResult.data?.message || 'Fallback system is operational') : 
               (fallbackResult.error || 'Unknown error')
    };
    
    // Log comprehensive health status
    console.log('Email providers health check results:', {
      primary: primaryStatus,
      fallback: fallbackStatus,
      timestamp: new Date().toISOString()
    });
    
    return {
      checking: false,
      primary: primaryStatus,
      fallback: fallbackStatus,
      lastChecked: new Date()
    };
  } catch (error) {
    console.error('Unexpected error checking provider health:', error);
    
    return {
      checking: false,
      primary: {
        available: false,
        message: error instanceof Error ? error.message : 'Unexpected error checking provider'
      },
      fallback: {
        available: false,
        message: 'Could not check fallback availability due to error'
      },
      lastChecked: new Date()
    };
  }
}
