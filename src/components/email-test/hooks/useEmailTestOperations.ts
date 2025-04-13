
import { useCallback } from 'react';
import { checkResendKeyStatus, sendTestEmail } from '../services/emailTestService';
import { useEmailStatusUpdates } from './useEmailStatusUpdates';
import { EmailResponse } from '../types';

/**
 * Hook for email test operations
 */
export function useEmailTestOperations(
  emailForm: { testEmail: string; testPhone: string },
  statusMethods: {
    setSendingStatus: () => void;
    setSuccessStatus: (data: any, email: string) => void;
    setErrorStatus: (error: string, email: string, resendKeyConfigured: boolean | null) => void;
    updateDebugInfo: (info: any) => void;
    updateResendInfo: (isConfigured: boolean, message: string) => void;
  }
) {
  const {
    setSendingStatus,
    updateDebugInfo,
    updateResendInfo
  } = statusMethods;

  const {
    handleSuccessResponse,
    handleErrorResponse,
    handleApiKeyIssue,
    handleSupabaseAuthIssue,
    handleEdgeFunctionError,
    handleClientError
  } = useEmailStatusUpdates(statusMethods);

  // Function to handle test email sending
  const handleTestEmail = useCallback(async () => {
    if (!emailForm.testEmail) return;
    
    setSendingStatus();
    updateDebugInfo("Initiating email test - preparing request...");
    
    // Prepare the test email data
    const testEmailData = {
      to: [emailForm.testEmail],
      subject: 'Event Registration Confirmation - Gate Gaborone',
      name: 'Test User',
      email: emailForm.testEmail,
      phone: emailForm.testPhone,
      message: 'This is a test event registration.',
      eventName: 'Sunday Service',
      eventDate: '2025-04-14',
      eventTime: '09:00 AM - 11:00 AM',
      location: 'Gate Gaborone Church, Block 10',
      sendConfirmation: true,
      checkInId: Date.now().toString(),
      isTestEmail: true,
      sendSms: true, // Enable SMS notifications for testing
      title: 'Mr',
      role: 'Member',
      denomination: 'Non-denominational'
    };
    
    try {
      updateDebugInfo("Sending request to edge function...");
      const result = await sendTestEmail(testEmailData);
      
      // For debugging
      updateDebugInfo(result.success && result.data 
        ? JSON.stringify(result.data, null, 2) 
        : JSON.stringify(result, null, 2));
      console.log("Email test result:", result);
      
      if (result.success && result.data) {
        handleSuccessResponse(result, emailForm.testEmail);
      } else {
        // Check for specific types of errors
        const isApiKeyIssue = handleApiKeyIssue(result);
        const isSupabaseAuthIssue = handleSupabaseAuthIssue(result);
        
        if (!isApiKeyIssue && !isSupabaseAuthIssue) {
          handleEdgeFunctionError(result);
        }
        
        handleErrorResponse(
          result.error || 'Failed to send test email', 
          emailForm.testEmail, 
          result.success && result.data ? result.data.resendKeyConfigured : null
        );
      }
    } catch (error) {
      handleClientError(error, emailForm.testEmail);
    }
  }, [
    emailForm.testEmail, 
    emailForm.testPhone, 
    setSendingStatus, 
    updateDebugInfo, 
    handleSuccessResponse, 
    handleErrorResponse, 
    handleApiKeyIssue, 
    handleSupabaseAuthIssue, 
    handleEdgeFunctionError,
    handleClientError
  ]);

  // Check the status of the Resend API key
  const checkResendStatus = useCallback(async () => {
    setSendingStatus();
    updateDebugInfo("Checking Resend API key status...");

    try {
      const result = await checkResendKeyStatus();
      console.log("Resend key status check result:", result);
      
      updateDebugInfo(result.success && result.data 
        ? JSON.stringify(result.data, null, 2) 
        : JSON.stringify(result, null, 2));
      
      if (result.success && result.data) {
        const data = result.data;
        updateResendInfo(
          data.keyConfigured || data.success, 
          data.keyConfigured || data.success 
            ? 'API key is active and properly configured' 
            : (data.message || 'API key is missing or invalid')
        );
      } else {
        // Check if this is a Supabase authentication issue
        const isSupabaseAuthIssue = handleSupabaseAuthIssue(result);
          
        if (isSupabaseAuthIssue) {
          updateResendInfo(false, 'Supabase authentication error: Your session may have expired. Try refreshing the page.');
        } else {
          updateResendInfo(false, 'Failed to check API key status: ' + (result.error || 'Unknown error'));
          updateDebugInfo(`
Failed to check Resend API key status!

Error: ${result.error || 'Unknown error'}

Possible causes:
- Edge function execution error
- Network connectivity issues
- Misconfigured Edge Function 
- Missing or invalid RESEND_API_KEY in Supabase secrets

Check the edge function logs in the Supabase dashboard for more details.
          `);
        }
      }
    } catch (error) {
      handleClientError(error, "");
      updateResendInfo(false, 'Error: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  }, [
    setSendingStatus, 
    updateDebugInfo, 
    updateResendInfo, 
    handleSupabaseAuthIssue,
    handleClientError
  ]);

  return {
    handleTestEmail,
    checkResendStatus
  };
}
