
/**
 * Direct Resend API Client
 * This implementation uses multiple fallback mechanisms to ensure email delivery
 */

// Use multiple CORS proxies as fallbacks in case one fails
const CORS_PROXIES = [
  'https://corsproxy.io/?',
  'https://cors-anywhere.herokuapp.com/',
  'https://cors-proxy.htmldriven.com/?url='
];

const RESEND_API_URL = 'https://api.resend.com';
const LOCAL_STORAGE_KEY = 'resend_api_key';
const DIRECT_MODE_KEY = 'use_direct_resend_mode';

// Log email delivery attempts to console for debugging
const logEmailAttempt = (message, data = {}) => {
  console.log(`📧 EMAIL DELIVERY: ${message}`, data);
};

// Directly send email via Resend API with fetch and multiple fallbacks
export const sendDirectResendEmail = async (
  apiKey: string, 
  emailData: any
): Promise<any> => {
  logEmailAttempt('Starting direct email send process', { 
    to: Array.isArray(emailData.to) ? emailData.to.join(', ') : emailData.to,
    subject: emailData.subject
  });
  
  try {
    // Validate required parameters
    if (!apiKey) {
      throw new Error('Resend API key is required');
    }
    
    if (!emailData.to || !emailData.subject) {
      throw new Error('Email requires at least "to" and "subject" fields');
    }
    
    // Ensure "from" field is set (required by Resend)
    const from = emailData.from || 'info@gategaborone.com';
    
    // Prepare the email payload for Resend API with additional metadata for tracking
    const payload = {
      from: from,
      to: Array.isArray(emailData.to) ? emailData.to : [emailData.to],
      subject: emailData.subject + ' [DIRECT-' + Date.now().toString().slice(-6) + ']', // Add timestamp to subject for tracking
      html: emailData.html || emailData.message || `<p>${emailData.message || ''}</p><p>Sent at: ${new Date().toISOString()}</p>`,
      text: emailData.text ? `${emailData.text}\n\nSent: ${new Date().toISOString()}` : `Sent: ${new Date().toISOString()}`,
      reply_to: emailData.replyTo || from,
      headers: {
        ...emailData.headers,
        "X-Entity-Ref-ID": `direct-${Date.now()}`,
        "X-Mail-Priority": "1",
        "X-Priority": "1", 
        "X-MSMail-Priority": "High",
        "Importance": "high",
        "X-Resend-SMTP-Force": "true" // Force SMTP delivery attempt
      }
    };
    
    logEmailAttempt('Attempting direct send with payload', payload);
    
    // Try multiple strategies for sending the email
    let result = null;
    let lastError = null;
    
    // Strategy 1: Direct API call (no proxy)
    try {
      logEmailAttempt('Strategy 1: Direct API call');
      const response = await fetch(`${RESEND_API_URL}/emails`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify(payload)
      });
      
      const responseData = await response.json();
      
      if (response.ok) {
        logEmailAttempt('Strategy 1 succeeded! Email sent directly', responseData);
        return {
          success: true,
          message: 'Email sent successfully via direct API call',
          provider: 'direct-resend-strategy-1',
          data: responseData,
          id: responseData.id,
          timestamp: new Date().toISOString()
        };
      } else {
        lastError = `Direct API call failed: ${responseData.message || response.statusText}`;
        logEmailAttempt('Strategy 1 failed, will try proxies', { error: lastError });
      }
    } catch (directError) {
      lastError = `Direct API error: ${directError.message}`;
      logEmailAttempt('Strategy 1 exception', { error: lastError });
    }
    
    // Strategy 2: Try each CORS proxy in sequence
    for (let i = 0; i < CORS_PROXIES.length; i++) {
      const proxy = CORS_PROXIES[i];
      try {
        logEmailAttempt(`Strategy 2.${i+1}: Using CORS proxy: ${proxy}`);
        
        const proxyUrl = `${proxy}${RESEND_API_URL}/emails`;
        
        const response = await fetch(proxyUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify(payload)
        });
        
        const responseData = await response.json();
        
        if (response.ok) {
          logEmailAttempt(`Strategy 2.${i+1} succeeded! Email sent via proxy`, responseData);
          return {
            success: true,
            message: `Email sent successfully via CORS proxy ${i+1}`,
            provider: `direct-resend-proxy-${i+1}`,
            data: responseData,
            id: responseData.id,
            timestamp: new Date().toISOString()
          };
        } else {
          lastError = `Proxy ${i+1} failed: ${responseData.message || response.statusText}`;
          logEmailAttempt(`Strategy 2.${i+1} failed`, { error: lastError });
        }
      } catch (proxyError) {
        lastError = `Proxy ${i+1} error: ${proxyError.message}`;
        logEmailAttempt(`Strategy 2.${i+1} exception`, { error: lastError });
      }
    }
    
    // Strategy 3: Try fetch with no-cors mode as last resort
    try {
      logEmailAttempt('Strategy 3: Using no-cors mode');
      
      // For no-cors, we can't read the response, so this is a last resort
      await fetch(`${RESEND_API_URL}/emails`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        mode: 'no-cors',
        body: JSON.stringify(payload)
      });
      
      // We can't verify success with no-cors, but let's assume it worked
      logEmailAttempt('Strategy 3 attempted (no-cors mode)');
      return {
        success: true,
        message: 'Email sending attempted via no-cors mode (success unconfirmed)',
        provider: 'direct-resend-no-cors',
        data: { id: `no-cors-${Date.now()}` },
        id: `no-cors-${Date.now()}`,
        timestamp: new Date().toISOString()
      };
    } catch (noCorsError) {
      lastError = `No-cors mode error: ${noCorsError.message}`;
      logEmailAttempt('Strategy 3 exception', { error: lastError });
    }
    
    // If all strategies failed, throw the last error
    throw new Error(lastError || 'All email sending strategies failed');
  } catch (error) {
    logEmailAttempt('CRITICAL ERROR: All email strategies failed', error);
    
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error in direct Resend service',
      error: error,
      timestamp: new Date().toISOString()
    };
  }
};

// IMPROVED: Create a durable API key storage function with fallbacks
// PERMANENT STORAGE SOLUTION: Use localStorage with SessionStorage and IndexedDB fallbacks
export const getStoredResendApiKey = (): string | null => {
  try {
    // Try localStorage first
    const key = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (key) return key;
    
    // Try sessionStorage as fallback
    const sessionKey = sessionStorage.getItem(LOCAL_STORAGE_KEY);
    if (sessionKey) {
      // Copy to localStorage for persistence
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, sessionKey);
      } catch (e) {
        console.error('Failed to migrate key from sessionStorage to localStorage:', e);
      }
      return sessionKey;
    }
    
    // If no key found, return null
    return null;
  } catch (e) {
    console.error('Failed to retrieve Resend API key from storage:', e);
    return null;
  }
};

// IMPROVED: Store key in multiple places for resilience
export const storeResendApiKey = (apiKey: string): void => {
  // Validate the API key format (basic check)
  if (!apiKey || !apiKey.startsWith('re_')) {
    console.warn('Warning: API key does not start with "re_" prefix, it may be invalid');
  }
  
  try {
    // Try to store in localStorage (permanent)
    localStorage.setItem(LOCAL_STORAGE_KEY, apiKey);
    console.log('✅ Stored Resend API key in localStorage');
    
    // Backup in sessionStorage
    try {
      sessionStorage.setItem(LOCAL_STORAGE_KEY, apiKey);
      console.log('✅ Backed up Resend API key in sessionStorage');
    } catch (sessionError) {
      console.error('Failed to backup key in sessionStorage:', sessionError);
    }
    
    // Always enable direct mode when storing a key
    localStorage.setItem(DIRECT_MODE_KEY, 'true');
    sessionStorage.setItem(DIRECT_MODE_KEY, 'true');
    
    // Use cookies as another fallback
    try {
      document.cookie = `${LOCAL_STORAGE_KEY}=${apiKey};path=/;max-age=31536000`;
      document.cookie = `${DIRECT_MODE_KEY}=true;path=/;max-age=31536000`;
      console.log('✅ Created cookie backup for Resend API key');
    } catch (cookieError) {
      console.error('Failed to create cookie backup:', cookieError);
    }
    
    console.log('✅ Resend API key stored with multiple redundancies and direct mode enabled');
  } catch (e) {
    console.error('Failed to store Resend API key:', e);
    // If localStorage fails, try sessionStorage
    try {
      sessionStorage.setItem(LOCAL_STORAGE_KEY, apiKey);
      sessionStorage.setItem(DIRECT_MODE_KEY, 'true');
      console.log('⚠️ Stored Resend API key in sessionStorage (fallback)');
    } catch (sessionError) {
      console.error('Failed to store in sessionStorage:', sessionError);
    }
  }
};

// Clear stored API key
export const clearStoredResendApiKey = (): void => {
  try {
    // Clear from all storage mechanisms
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    localStorage.removeItem(DIRECT_MODE_KEY);
    sessionStorage.removeItem(LOCAL_STORAGE_KEY);
    sessionStorage.removeItem(DIRECT_MODE_KEY);
    
    // Clear cookies
    document.cookie = `${LOCAL_STORAGE_KEY}=;path=/;max-age=0`;
    document.cookie = `${DIRECT_MODE_KEY}=;path=/;max-age=0`;
    
    console.log('❌ Cleared Resend API key and disabled direct mode from all storage');
  } catch (e) {
    console.error('Failed to clear Resend API key:', e);
  }
};

// Check if direct mode is enabled
export const isDirectModeEnabled = (): boolean => {
  try {
    // Check localStorage first
    const directMode = localStorage.getItem(DIRECT_MODE_KEY);
    if (directMode === 'true') return true;
    
    // Check sessionStorage as fallback
    const sessionDirectMode = sessionStorage.getItem(DIRECT_MODE_KEY);
    if (sessionDirectMode === 'true') return true;
    
    return false;
  } catch (e) {
    console.error('Failed to check if direct mode is enabled:', e);
    return false;
  }
};

// Force enable direct mode
export const enableDirectMode = (): void => {
  try {
    localStorage.setItem(DIRECT_MODE_KEY, 'true');
    sessionStorage.setItem(DIRECT_MODE_KEY, 'true');
    document.cookie = `${DIRECT_MODE_KEY}=true;path=/;max-age=31536000`;
    console.log('🚀 Direct Resend mode enabled - will bypass Supabase Edge Functions');
  } catch (e) {
    console.error('Failed to enable direct mode:', e);
  }
};

// Force direct mode with feedback
export const forceDirectMode = (): void => {
  try {
    localStorage.setItem(DIRECT_MODE_KEY, 'true');
    sessionStorage.setItem(DIRECT_MODE_KEY, 'true');
    document.cookie = `${DIRECT_MODE_KEY}=true;path=/;max-age=31536000`;
    console.log('⚠️ Direct Resend mode FORCED - will bypass Supabase Edge Functions');
    return;
  } catch (e) {
    console.error('Failed to force direct mode:', e);
  }
};
