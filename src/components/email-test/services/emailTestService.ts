
import { supabase } from '@/integrations/supabase/client';
import { validateEmailData } from './emailValidationService';
import { EmailResponse } from '../types';
import { checkResendKeyStatus } from './resendStatusService';

/**
 * Send a test email using the edge function
 */
export const sendTestEmail = async (testEmailData: any) => {
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
        return {
          success: false,
          error: `Supabase authentication error: ${error.message}. Try refreshing the page to get a new session.`
        };
      }
      
      return {
        success: false,
        error: `Edge Function Error: ${error.message || 'Unknown error'}. Check Edge Function logs in Supabase dashboard for details.`
      };
    }
    
    console.log('Email test response:', data);
    
    if (!data) {
      return {
        success: false,
        error: 'No response received from edge function (null data).'
      };
    }
    
    // Check if we got an error response even though the HTTP status was 200
    if (data.success === false) {
      return {
        success: false,
        error: data.message || data.error || 'Unknown error occurred',
        data: data
      };
    }
    
    return {
      success: true,
      data
    };
  } catch (err) {
    console.error('Error sending test email:', err);
    const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
    
    return {
      success: false,
      error: errorMessage
    };
  }
};

// Re-export for convenience
export { checkResendKeyStatus };
