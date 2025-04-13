
// Re-export all services from this file for backward compatibility
export { checkResendKeyStatus } from './services/resendStatusService';
export { sendTestEmail } from './services/emailTestService';
export { invokeEmailFunction } from './services/edgeFunctionService';
export { validateEmailData, prepareEmailData } from './services/emailValidationService';
