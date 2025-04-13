
import { supabase } from '@/integrations/supabase/client';

/**
 * Invoke a Supabase Edge Function with better error handling
 */
export async function invokeEmailFunction(functionName: string, data: any) {
  try {
    console.log(`Invoking ${functionName} function with data:`, data);
    
    // Add timestamp to prevent caching
    const requestData = {
      ...data,
      _timestamp: Date.now()
    };
    
    const { data: responseData, error } = await supabase.functions.invoke(functionName, {
      body: requestData
    });
    
    if (error) {
      console.error(`Error invoking ${functionName}:`, error);
      return {
        success: false,
        error: error.message || `Function ${functionName} failed`,
        statusCode: error.status,
        timestamp: new Date().toISOString()
      };
    }
    
    if (!responseData) {
      console.error(`Function ${functionName} returned no data`);
      return {
        success: false,
        error: `Function ${functionName} returned no data`,
        timestamp: new Date().toISOString()
      };
    }
    
    // Process the function result
    console.log(`Function ${functionName} response:`, responseData);
    
    return {
      success: true,
      data: responseData,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error(`Unexpected error invoking ${functionName}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : `Unknown error in ${functionName}`,
      timestamp: new Date().toISOString()
    };
  }
}
