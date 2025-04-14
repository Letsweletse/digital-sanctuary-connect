
/**
 * Direct Resend Service
 * This is the main entry point for Resend direct API access
 */

// Export all functionality from the modular files
export { 
  getStoredResendApiKey, 
  storeResendApiKey, 
  clearStoredResendApiKey 
} from './resend/resendKeyStorage';

export { 
  isDirectModeEnabled, 
  enableDirectMode, 
  forceDirectMode 
} from './resend/directModeConfig';

export { 
  sendDirectResendEmail 
} from './resend/resendEmailService';
