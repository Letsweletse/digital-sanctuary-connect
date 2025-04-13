
import { supabase } from '@/integrations/supabase/client';

/**
 * Check the status of the Resend API key
 */
export const checkResendKeyStatus = async () => {
  try {
    console.log("Checking Resend API key status...");
    
    // Add a timestamp to prevent caching
    const timestamp = new Date().getTime();
    
    const { data, error } = await supabase.functions.invoke('check-resend-status', {
      body: { 
        timestamp,
        checkType: 'connection-test' 
      }
    });
    
    if (error) {
      console.error('Error invoking check-resend-status function:', error);
      
      // Check if this is a Supabase auth issue
      if (error.message?.includes('No API key found') || 
          error.message?.includes('JWT') || 
          error.status === 401) {
        return {
          success: false,
          error: `Supabase authentication error: ${error.message}. Try refreshing the page to get a new session.`
        };
      }
      
      throw new Error(`Failed to check Resend API key status: ${error.message}`);
    }
    
    console.log("Resend API key status response:", data);
    
    return {
      success: true,
      data
    };
  } catch (err) {
    console.error('Error checking Resend key status:', err);
    const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
    
    return {
      success: false,
      error: errorMessage
    };
  }
};
