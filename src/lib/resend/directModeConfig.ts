
/**
 * Direct Mode Configuration
 * Manages the direct bypass mode settings for Resend API
 */

import { storeResendApiKey } from './resendKeyStorage';

const DIRECT_MODE_KEY = 'use_direct_resend_mode';

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
