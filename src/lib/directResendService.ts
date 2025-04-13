
/**
 * Direct Resend API Client
 * Bypasses Supabase Edge Functions to directly connect to Resend API
 */

// The Resend API endpoint
const RESEND_API_URL = 'https://api.resend.com';

// Directly send email via Resend API with fetch
export const sendDirectResendEmail = async (
  apiKey: string, 
  emailData: any
): Promise<any> => {
  try {
    console.log('Bypassing Supabase Edge Functions, sending directly to Resend API');
    
    // Validate required parameters
    if (!apiKey) {
      throw new Error('Resend API key is required');
    }
    
    if (!emailData.to || !emailData.subject) {
      throw new Error('Email requires at least "to" and "subject" fields');
    }
    
    // Ensure "from" field is set (required by Resend)
    const from = emailData.from || 'info@gategaborone.com';
    
    // Prepare the email payload for Resend API
    const payload = {
      from: from,
      to: Array.isArray(emailData.to) ? emailData.to : [emailData.to],
      subject: emailData.subject,
      html: emailData.html || emailData.message || `<p>${emailData.message || ''}</p>`,
      text: emailData.text,
      // Add any other Resend-specific parameters here
      reply_to: emailData.replyTo || from
    };
    
    console.log('Sending direct email with data:', JSON.stringify(payload).substring(0, 300));
    
    // Make the API request with retries
    let retryCount = 0;
    const maxRetries = 3;
    let lastError = null;
    
    while (retryCount < maxRetries) {
      try {
        // Make the API request
        const response = await fetch(`${RESEND_API_URL}/emails`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify(payload)
        });
        
        // Parse the response
        const result = await response.json();
        
        if (!response.ok) {
          console.error('Direct Resend API error:', result);
          
          // If this is a validation error or domain verification issue, stop retrying
          if (response.status === 400 || 
              (result.message && (
                result.message.includes('domain') || 
                result.message.includes('verification')
              ))) {
            throw new Error(result.message || 'Failed to send email via Resend API');
          }
          
          // For other errors, retry
          throw new Error(result.message || 'Failed to send email via Resend API');
        }
        
        console.log('Email sent directly via Resend API:', result);
        
        return {
          success: true,
          message: 'Email sent directly via Resend API',
          provider: 'direct-resend',
          data: result,
          id: result.id,
          timestamp: new Date().toISOString()
        };
      } catch (retryError) {
        retryCount++;
        lastError = retryError;
        
        if (retryCount < maxRetries) {
          // Add delay before retry with exponential backoff
          const delay = Math.min(100 * Math.pow(2, retryCount), 2000);
          console.log(`Retrying direct email send after ${delay}ms (attempt ${retryCount+1} of ${maxRetries})`);
          await new Promise(resolve => setTimeout(resolve, delay));
        } else {
          break;
        }
      }
    }
    
    throw lastError || new Error('Failed after multiple retry attempts');
  } catch (error) {
    console.error('Error in direct Resend service:', error);
    
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error in direct Resend service',
      error: error,
      timestamp: new Date().toISOString()
    };
  }
};

// Fetch Resend API key from local storage if the user has stored it
export const getStoredResendApiKey = (): string | null => {
  try {
    return localStorage.getItem('resend_api_key');
  } catch (e) {
    return null;
  }
};

// Store Resend API key in local storage for direct API access
export const storeResendApiKey = (apiKey: string): void => {
  try {
    localStorage.setItem('resend_api_key', apiKey);
    // Also enable direct mode when storing a key
    localStorage.setItem('use_direct_resend_mode', 'true');
    console.log('Stored Resend API key and enabled direct mode');
  } catch (e) {
    console.error('Failed to store Resend API key:', e);
  }
};

// Clear stored API key
export const clearStoredResendApiKey = (): void => {
  try {
    localStorage.removeItem('resend_api_key');
    localStorage.removeItem('use_direct_resend_mode');
  } catch (e) {
    console.error('Failed to clear Resend API key:', e);
  }
};

// Check if direct mode is enabled
export const isDirectModeEnabled = (): boolean => {
  try {
    return localStorage.getItem('use_direct_resend_mode') === 'true';
  } catch (e) {
    return false;
  }
};

// Force enable direct mode
export const enableDirectMode = (): void => {
  try {
    localStorage.setItem('use_direct_resend_mode', 'true');
    console.log('Direct Resend mode enabled');
  } catch (e) {
    console.error('Failed to enable direct mode:', e);
  }
};
