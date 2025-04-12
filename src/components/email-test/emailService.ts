
import { supabase } from '@/integrations/supabase/client';
import { EmailResponse, EmailTestFormData } from './types';

/**
 * Check the status of the Resend API key
 */
export const checkResendKeyStatus = async () => {
  try {
    console.log("Checking Resend API key status...");
    
    const { data, error } = await supabase.functions.invoke('check-resend-status');
    
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

/**
 * Validate email data before sending
 * This helps identify issues that might cause 400 errors from Resend
 */
const validateEmailData = (data: any) => {
  // Check if recipients are valid emails
  if (data.to) {
    if (Array.isArray(data.to)) {
      const invalidEmails = data.to.filter((email: string) => 
        !email.includes('@') || email.trim() === '' || email.length > 254
      );
      if (invalidEmails.length > 0) {
        return {
          valid: false,
          error: `Invalid email format in recipients: ${invalidEmails.join(', ')}`
        };
      }
    } else if (typeof data.to === 'string') {
      if (!data.to.includes('@') || data.to.trim() === '' || data.to.length > 254) {
        return {
          valid: false,
          error: `Invalid email format in recipient: ${data.to}`
        };
      }
    }
  } else {
    return {
      valid: false,
      error: 'Missing recipient email addresses'
    };
  }

  // Validate required fields
  if (!data.name || data.name.trim() === '') {
    return {
      valid: false,
      error: 'Name is required and cannot be empty'
    };
  }

  if (!data.email || !data.email.includes('@') || data.email.trim() === '') {
    return {
      valid: false,
      error: 'Valid email is required for the sender'
    };
  }

  // Validate email subject
  if (!data.subject || data.subject.trim() === '') {
    return {
      valid: false,
      error: 'Email subject is required'
    };
  }

  return { valid: true };
};

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
    
    const { data, error } = await supabase.functions.invoke<EmailResponse>('send-email', {
      body: testEmailData
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

/**
 * Invoke the edge function with form data
 */
export const invokeEmailFunction = async (edgeFunction: string, formData: EmailTestFormData) => {
  try {
    console.log(`Invoking ${edgeFunction} function with form data:`, formData);
    
    // Prepare the email recipients array
    const toEmails = formData.to.split(',').map(email => email.trim());
    
    // Validate recipient emails
    const invalidEmails = toEmails.filter(email => !email.includes('@') || email.trim() === '');
    if (invalidEmails.length > 0) {
      throw new Error(`Invalid email address(es): ${invalidEmails.join(', ')}`);
    }

    // Create request body with validated data
    const requestBody = {
      ...formData,
      to: toEmails
    };

    // Final validation check
    const validation = validateEmailData(requestBody);
    if (!validation.valid) {
      throw new Error(`Validation error: ${validation.error}`);
    }

    // Invoke the Supabase edge function
    console.log(`Sending request to ${edgeFunction} edge function...`);
    const { data, error } = await supabase.functions.invoke<EmailResponse>(edgeFunction, {
      body: requestBody
    });

    if (error) {
      console.error('Error invoking edge function:', error);
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
        error: `Failed to invoke the ${edgeFunction} function: ${error.message || 'Unknown error'}`,
        details: error
      };
    }

    console.log('Edge function response:', data);

    if (!data) {
      return {
        success: false,
        error: 'No response data received from edge function (null data)'
      };
    }

    // Check if the response indicates an error despite a successful HTTP request
    if (data.success === false) {
      return {
        success: false,
        error: data.message || data.error || 'Unknown error in edge function response',
        data: data
      };
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
