
/**
 * Direct Resend Email Service
 * Handles direct communication with the Resend API
 */

import { getStoredResendApiKey } from './resendKeyStorage';

// Cache API call responses to prevent duplicates
const responseCache = new Map();

// Basic validation for email data
const validateEmailData = (emailData: any): boolean => {
  if (!emailData) return false;
  if (!emailData.to) return false;
  return true;
};

/**
 * Send email directly to Resend API without using Supabase Edge Functions
 */
export const sendDirectResendEmail = async (apiKey: string, emailData: any): Promise<{
  success: boolean;
  id?: string;
  message?: string;
  provider?: string;
  timestamp?: string;
}> => {
  // Validate required parameters
  if (!apiKey) {
    console.error('No Resend API key provided for direct sending');
    return {
      success: false,
      message: 'No Resend API key provided',
      provider: 'direct-resend-error',
      timestamp: new Date().toISOString()
    };
  }
  
  if (!validateEmailData(emailData)) {
    console.error('Invalid email data for direct sending');
    return {
      success: false,
      message: 'Invalid email data: missing required fields',
      provider: 'direct-resend-error',
      timestamp: new Date().toISOString()
    };
  }
  
  // Create a cache key from the email data
  const cacheKey = `${emailData.to}-${emailData.subject}-${Date.now().toString().slice(0, -3)}`;
  
  // Check if we already processed this exact request in the last minute
  if (responseCache.has(cacheKey)) {
    console.log('Duplicate email request detected, returning cached response');
    return responseCache.get(cacheKey);
  }
  
  // Prepare API call
  try {
    console.log('Sending email directly to Resend API:', {
      to: emailData.to,
      subject: emailData.subject,
      from: emailData.from || 'onboarding@resend.dev'
    });
    
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(emailData)
    });
    
    // Parse the response
    const data = await response.json();
    
    if (!response.ok) {
      console.error('Direct Resend API error:', data);
      
      const result = {
        success: false,
        message: data.message || 'Failed to send email via Resend API',
        provider: 'direct-resend',
        timestamp: new Date().toISOString()
      };
      
      // Cache the error response for a short time to prevent duplicate attempts
      responseCache.set(cacheKey, result);
      setTimeout(() => responseCache.delete(cacheKey), 60000); // Clear after 1 minute
      
      return result;
    }
    
    console.log('Direct Resend API success:', data);
    
    const successResult = {
      success: true,
      id: data.id,
      provider: 'direct-resend',
      timestamp: new Date().toISOString()
    };
    
    // Cache the successful response
    responseCache.set(cacheKey, successResult);
    setTimeout(() => responseCache.delete(cacheKey), 300000); // Clear after 5 minutes
    
    return successResult;
  } catch (error) {
    console.error('Exception in direct Resend sending:', error);
    
    const failureResult = {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error in direct Resend sending',
      provider: 'direct-resend-error',
      timestamp: new Date().toISOString()
    };
    
    // Cache the error to prevent immediate retries
    responseCache.set(cacheKey, failureResult);
    setTimeout(() => responseCache.delete(cacheKey), 30000); // Clear after 30 seconds
    
    return failureResult;
  }
};
