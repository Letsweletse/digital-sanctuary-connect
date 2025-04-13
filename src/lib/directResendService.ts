
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
    console.log('💌 DIRECT EMAIL: Bypassing Supabase Edge Functions, sending directly to Resend API');
    
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
      reply_to: emailData.replyTo || from
    };
    
    console.log('💌 DIRECT EMAIL: Sending to:', payload.to.join(', '));
    console.log('💌 DIRECT EMAIL: Subject:', payload.subject);
    console.log('💌 DIRECT EMAIL: From:', payload.from);
    
    // Make the API request with retries
    let retryCount = 0;
    const maxRetries = 3;
    let lastError = null;
    
    while (retryCount < maxRetries) {
      try {
        console.log(`💌 DIRECT EMAIL: Attempt ${retryCount + 1} of ${maxRetries}`);
        
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
        
        // Log full response for debugging
        console.log('💌 DIRECT EMAIL: Full Resend API response:', JSON.stringify(result, null, 2));
        
        if (!response.ok) {
          console.error('💌 DIRECT EMAIL: Resend API error:', result);
          
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
        
        console.log('💌 DIRECT EMAIL: Success! Email sent with ID:', result.id);
        
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
        
        console.error(`💌 DIRECT EMAIL: Attempt ${retryCount} failed:`, retryError);
        
        if (retryCount < maxRetries) {
          // Add delay before retry with exponential backoff
          const delay = Math.min(100 * Math.pow(2, retryCount), 2000);
          console.log(`💌 DIRECT EMAIL: Retrying direct email send after ${delay}ms (attempt ${retryCount+1} of ${maxRetries})`);
          await new Promise(resolve => setTimeout(resolve, delay));
        } else {
          break;
        }
      }
    }
    
    throw lastError || new Error('Failed after multiple retry attempts');
  } catch (error) {
    console.error('💌 DIRECT EMAIL: Error in direct Resend service:', error);
    
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
    console.error('Failed to retrieve Resend API key from localStorage:', e);
    return null;
  }
};

// Store Resend API key in local storage for direct API access
export const storeResendApiKey = (apiKey: string): void => {
  try {
    localStorage.setItem('resend_api_key', apiKey);
    // Also enable direct mode when storing a key
    localStorage.setItem('use_direct_resend_mode', 'true');
    console.log('✅ Stored Resend API key and enabled direct mode');
  } catch (e) {
    console.error('Failed to store Resend API key:', e);
  }
};

// Clear stored API key
export const clearStoredResendApiKey = (): void => {
  try {
    localStorage.removeItem('resend_api_key');
    localStorage.removeItem('use_direct_resend_mode');
    console.log('❌ Cleared Resend API key and disabled direct mode');
  } catch (e) {
    console.error('Failed to clear Resend API key:', e);
  }
};

// Check if direct mode is enabled
export const isDirectModeEnabled = (): boolean => {
  try {
    return localStorage.getItem('use_direct_resend_mode') === 'true';
  } catch (e) {
    console.error('Failed to check if direct mode is enabled:', e);
    return false;
  }
};

// Force enable direct mode
export const enableDirectMode = (): void => {
  try {
    localStorage.setItem('use_direct_resend_mode', 'true');
    console.log('🚀 Direct Resend mode enabled - will bypass Supabase Edge Functions');
  } catch (e) {
    console.error('Failed to enable direct mode:', e);
  }
};

// Force direct mode with feedback
export const forceDirectMode = (): void => {
  try {
    localStorage.setItem('use_direct_resend_mode', 'true');
    console.log('⚠️ Direct Resend mode FORCED - will bypass Supabase Edge Functions');
    return;
  } catch (e) {
    console.error('Failed to force direct mode:', e);
  }
};
