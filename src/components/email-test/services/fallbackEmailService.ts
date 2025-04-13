
import { supabase } from '@/integrations/supabase/client';
import { EmailResponse } from '../types';

/**
 * Fallback service for when primary email provider (Resend) fails
 * This function will attempt to send an email using the backup provider (SendGrid)
 */
export const sendFallbackEmail = async (emailData: any): Promise<{
  success: boolean;
  data?: any;
  error?: string;
  provider?: string;
}> => {
  try {
    console.log('Attempting to send email via fallback provider...');
    
    // Add provider information to the request
    const requestData = {
      ...emailData,
      useFallbackProvider: true,
      timestamp: new Date().getTime(),
      fallbackReason: 'Primary provider failed or unreachable'
    };
    
    // Call a separate edge function for the fallback provider
    const { data, error } = await supabase.functions.invoke<EmailResponse>('email-fallback', {
      body: requestData
    });
    
    if (error) {
      console.error('Error invoking fallback email function:', error);
      return {
        success: false,
        error: `Fallback provider error: ${error.message || 'Unknown error'}`,
        provider: 'fallback'
      };
    }
    
    return {
      success: true,
      data,
      provider: 'fallback'
    };
  } catch (err) {
    console.error('Error in fallback email service:', err);
    const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
    
    return {
      success: false,
      error: errorMessage,
      provider: 'fallback'
    };
  }
};
