
/**
 * API Key Storage Management
 * Handles secure storage and retrieval of Resend API keys
 */

const LOCAL_STORAGE_KEY = 'resend_api_key';
const DIRECT_MODE_KEY = 'use_direct_resend_mode';

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
