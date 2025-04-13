
import { supabase } from '@/integrations/supabase/client';
import { EmailResponse } from '../types';
import { validateEmailData, prepareEmailData } from './emailValidationService';

/**
 * Invoke the edge function with form data
 */
export const invokeEmailFunction = async (edgeFunction: string, formData: any) => {
  try {
    console.log(`Invoking ${edgeFunction} function with form data:`, formData);
    
    try {
      // Prepare and validate the request data
      const requestBody = prepareEmailData(formData);
      
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
    } catch (validationError) {
      console.error('Validation error:', validationError);
      return {
        success: false,
        error: validationError instanceof Error ? validationError.message : 'Data validation error'
      };
    }
  } catch (err) {
    console.error('Error in invokeEmailFunction:', err);
    const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
    
    return {
      success: false,
      error: errorMessage
    };
  }
};
