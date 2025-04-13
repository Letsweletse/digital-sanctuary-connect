
import { supabase } from '@/integrations/supabase/client';
import { sendFallbackEmail } from './fallbackEmailService';
import { invokeEmailFunction } from './edgeFunctionService';
import { RedundancyResponse, ProviderHealth } from '../types';

/**
 * Check the health of both email providers
 */
export const checkEmailProvidersHealth = async (): Promise<Omit<ProviderHealth, 'checking' | 'lastChecked'>> => {
  try {
    console.log('Checking health of email providers...');
    
    // Check primary provider (Resend)
    let primaryAvailable = false;
    let primaryMessage = 'Not available';
    
    try {
      const primaryCheck = await supabase.functions.invoke('check-resend-status', {
        body: { checkType: 'health-check' }
      });
      
      primaryAvailable = primaryCheck.data?.success === true;
      primaryMessage = primaryCheck.data?.message || 'Status unknown';
      
      console.log('Primary provider health check:', primaryCheck.data);
    } catch (err) {
      console.error('Error checking primary provider health:', err);
      primaryMessage = err instanceof Error ? err.message : 'Error checking availability';
    }
    
    // Check fallback provider (SendGrid)
    let fallbackAvailable = false;
    let fallbackMessage = 'Not available';
    
    try {
      const fallbackCheck = await supabase.functions.invoke('email-fallback', {
        body: { checkType: 'health-check' }
      });
      
      fallbackAvailable = fallbackCheck.data?.success === true;
      fallbackMessage = fallbackCheck.data?.message || 'Status unknown';
      
      console.log('Fallback provider health check:', fallbackCheck.data);
    } catch (err) {
      console.error('Error checking fallback provider health:', err);
      fallbackMessage = err instanceof Error ? err.message : 'Error checking availability';
    }
    
    return {
      primary: {
        available: primaryAvailable,
        message: primaryMessage
      },
      fallback: {
        available: fallbackAvailable,
        message: fallbackMessage
      }
    };
  } catch (error) {
    console.error('Error in checkEmailProvidersHealth:', error);
    
    return {
      primary: {
        available: false,
        message: 'Error checking status'
      },
      fallback: {
        available: false,
        message: 'Error checking status'
      }
    };
  }
};

/**
 * Send an email with redundancy - try primary provider (Resend) first,
 * then fall back to secondary provider (SendGrid) if primary fails
 */
export const sendEmailWithRedundancy = async (emailData: any): Promise<RedundancyResponse> => {
  try {
    console.log('Attempting to send email via primary provider (Resend)...');
    
    // Try primary provider first
    const primaryResult = await invokeEmailFunction('send-email', emailData);
    
    // If primary provider succeeds, return the result
    if (primaryResult.success) {
      console.log('Email sent successfully via primary provider');
      return {
        ...primaryResult,
        fallbackUsed: false,
        provider: 'primary'
      };
    }
    
    // If primary provider fails, log the error
    console.error('Primary provider failed:', primaryResult.error);
    
    // Try fallback provider
    console.log('Attempting to send email via fallback provider...');
    const fallbackResult = await sendFallbackEmail(emailData);
    
    if (fallbackResult.success) {
      console.log('Email sent successfully via fallback provider');
      return {
        ...fallbackResult,
        fallbackUsed: true,
        primaryError: primaryResult.error
      };
    }
    
    // If both providers fail, return the primary error
    console.error('Both providers failed. Primary error:', primaryResult.error);
    console.error('Fallback error:', fallbackResult.error);
    
    return {
      success: false,
      error: `All providers failed. Primary: ${primaryResult.error}, Fallback: ${fallbackResult.error}`,
      fallbackUsed: true,
      primaryError: primaryResult.error
    };
  } catch (err) {
    console.error('Error in sendEmailWithRedundancy:', err);
    const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
    
    return {
      success: false,
      error: errorMessage,
      fallbackUsed: false
    };
  }
};
