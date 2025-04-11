
import { supabase } from '@/integrations/supabase/client';
import { EmailResponse, EmailTestFormData } from './types';

/**
 * Check the status of the Resend API key
 */
export const checkResendKeyStatus = async () => {
  try {
    const { data, error } = await supabase.functions.invoke('check-resend-status');
    
    if (error) {
      throw new Error(`Failed to check Resend API key status: ${error.message}`);
    }
    
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

/**
 * Send a test email using the edge function
 */
export const sendTestEmail = async (testEmailData: any) => {
  try {
    console.log('Sending test email with data:', testEmailData);
    
    const { data, error } = await supabase.functions.invoke<EmailResponse>('send-email', {
      body: testEmailData
    });
    
    if (error) {
      throw new Error(`Failed to invoke function: ${error.message}`);
    }
    
    console.log('Email test response:', data);
    
    if (!data) {
      throw new Error('No response received');
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

/**
 * Invoke the edge function with form data
 */
export const invokeEmailFunction = async (edgeFunction: string, formData: EmailTestFormData) => {
  try {
    console.log(`Invoking ${edgeFunction} function with form data:`, formData);
    
    // Prepare the email recipients array
    const toEmails = formData.to.split(',').map(email => email.trim());
    
    // Validate recipient emails
    const invalidEmails = toEmails.filter(email => !email.includes('@'));
    if (invalidEmails.length > 0) {
      throw new Error(`Invalid email address(es): ${invalidEmails.join(', ')}`);
    }

    // Invoke the Supabase edge function
    const { data, error } = await supabase.functions.invoke<EmailResponse>(edgeFunction, {
      body: {
        ...formData,
        to: toEmails
      }
    });

    if (error) {
      console.error('Error invoking edge function:', error);
      return {
        success: false,
        error: `Failed to invoke the ${edgeFunction} function: ${error.message}`
      };
    }

    console.log('Edge function response:', data);

    if (!data) {
      throw new Error('No response data received from edge function');
    }

    return {
      success: true,
      data
    };
  } catch (err) {
    console.error('Error in invokeEmailFunction:', err);
    const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
    
    return {
      success: false,
      error: errorMessage
    };
  }
};
