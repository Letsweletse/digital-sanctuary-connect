
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
  } catch (e) {
    console.error('Failed to store Resend API key:', e);
  }
};

// Clear stored API key
export const clearStoredResendApiKey = (): void => {
  try {
    localStorage.removeItem('resend_api_key');
  } catch (e) {
    console.error('Failed to clear Resend API key:', e);
  }
};
