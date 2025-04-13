
import { supabase, retryOperation } from '@/integrations/supabase/client';
import { validateEmailData } from './emailValidationService';
import { EmailResponse } from '../types';

/**
 * Send a test email using the edge function
 */
export const sendTestEmail = async (testEmailData: any): Promise<{ 
  success: boolean; 
  data?: EmailResponse; 
  error?: string;
}> => {
  try {
    console.log('Sending test email with data:', testEmailData);
    
    // Validate the email data before sending
    const validation = validateEmailData(testEmailData);
    if (!validation.valid) {
      throw new Error(`Validation error: ${validation.error}`);
    }
    
    console.log('Invoking send-email function with validated data');
    
    // Add a timestamp to prevent caching
    const requestData = {
      ...testEmailData,
      timestamp: new Date().getTime()
    };
    
    // Use retry operation for better resilience
    const result = await retryOperation(async () => {
      const { data, error } = await supabase.functions.invoke<EmailResponse>('send-email', {
        body: requestData
      });
      
      if (error) {
        console.error('Error invoking send-email function:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));
        
        // Check if this is a Supabase auth issue
        if (error.message?.includes('No API key found') || 
            error.message?.includes('JWT') || 
            error.status === 401) {
          throw new Error(`Supabase authentication error: ${error.message}. Try refreshing the page to get a new session.`);
        }
        
        throw new Error(`Edge Function Error: ${error.message || 'Unknown error'}. Check Edge Function logs in Supabase dashboard for details.`);
      }
      
      if (!data) {
        throw new Error('No response received from edge function (null data).');
      }
      
      // Check if we got an error response even though the HTTP status was 200
      if (data.success === false) {
        throw new Error(data.message || data.error || 'Unknown error occurred');
      }
      
      return { success: true, data };
    }, 2);
    
    console.log('Email test response:', result);
    return result;
    
  } catch (err) {
    console.error('Error sending test email:', err);
    const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
    
    return {
      success: false,
      error: errorMessage
    };
  }
};

/**
 * Check the status of the Resend API key
 */
export const checkResendKeyStatus = async (): Promise<{
  success: boolean;
  data?: any;
  error?: string;
}> => {
  try {
    console.log('Checking Resend API key status');
    
    // Add a timestamp to prevent caching
    const requestData = {
      timestamp: new Date().getTime()
    };
    
    // Use retry operation for better resilience
    const result = await retryOperation(async () => {
      const { data, error } = await supabase.functions.invoke('check-resend-status', {
        body: requestData
      });
      
      if (error) {
        console.error('Error checking Resend API key status:', error);
        
        // Check if this is a Supabase auth issue
        if (error.message?.includes('No API key found') || 
            error.message?.includes('JWT') || 
            error.status === 401) {
          throw new Error(`Supabase authentication error: ${error.message}. Try refreshing the page to get a new session.`);
        }
        
        throw new Error(`Edge Function Error: ${error.message || 'Unknown error'}`);
      }
      
      if (!data) {
        throw new Error('No response received from edge function (null data).');
      }
      
      return { success: true, data };
    }, 2);
    
    console.log('Resend API key status response:', result);
    return result;
    
  } catch (err) {
    console.error('Error checking Resend API key status:', err);
    const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
    
    return {
      success: false,
      error: errorMessage
    };
  }
};

// Re-export for convenience
export { checkResendKeyStatus as checkResendStatus };
