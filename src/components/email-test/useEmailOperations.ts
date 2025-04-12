
import { useCallback } from 'react';
import { checkResendKeyStatus, sendTestEmail } from './emailService';
import { useEmailStatus } from './useEmailStatus';

export function useEmailOperations(emailForm: any) {
  const {
    status,
    debugInfo,
    emailsSent,
    resendInfo,
    resetCounter,
    setSendingStatus,
    setSuccessStatus,
    setErrorStatus,
    updateDebugInfo,
    updateResendInfo
  } = useEmailStatus();

  // Function to handle test email sending
  const handleTestEmail = useCallback(async () => {
    if (!emailForm.testEmail) return;
    
    setSendingStatus();
    
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
      const result = await sendTestEmail(testEmailData);
      
      // For debugging
      updateDebugInfo(result.data);
      
      if (result.success && result.data) {
        setSuccessStatus(result.data, emailForm.testEmail);
      } else {
        // Determine if the issue is with the Resend API key
        const isApiKeyIssue = 
          result.error?.includes('API key') || 
          result.error?.includes('authentication') || 
          (result.data?.resendKeyConfigured === false);
        
        // Check for Supabase API key issues
        const isSupabaseAuthIssue = 
          result.error?.includes('No API key found') ||
          result.error?.includes('apikey request header') ||
          result.error?.includes('JWT') ||
          result.error?.includes('401');
        
        setErrorStatus(
          result.error || 'Failed to send test email', 
          emailForm.testEmail, 
          !isApiKeyIssue && result.data?.resendKeyConfigured
        );
        
        // Show more helpful error for API key issues
        if (isApiKeyIssue) {
          console.error('Resend API key issue detected:', result.error);
        }
        
        if (isSupabaseAuthIssue) {
          console.error('Supabase authentication issue detected:', result.error);
          updateDebugInfo({
            error: "Supabase authentication error",
            message: "No API key found in request. This typically happens when your Supabase session has expired or is missing.",
            hint: "Try refreshing the page to get a new session token, or check your browser's local storage for valid Supabase credentials.",
            timestamp: new Date().toISOString()
          });
        }
      }
    } catch (error) {
      console.error('Unexpected error in handleTestEmail:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setErrorStatus(errorMessage, emailForm.testEmail, false);
      updateDebugInfo({
        error: "Unexpected error",
        message: errorMessage,
        timestamp: new Date().toISOString()
      });
    }
  }, [emailForm.testEmail, emailForm.testPhone, setSendingStatus, setSuccessStatus, setErrorStatus, updateDebugInfo]);

  // Check the status of the Resend API key
  const checkResendStatus = useCallback(async () => {
    setSendingStatus();

    try {
      const result = await checkResendKeyStatus();
      
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
        const isSupabaseAuthIssue = 
          result.error?.includes('No API key found') ||
          result.error?.includes('apikey request header') ||
          result.error?.includes('JWT') ||
          result.error?.includes('401');
          
        if (isSupabaseAuthIssue) {
          console.error('Supabase authentication issue detected:', result.error);
          updateResendInfo(false, 'Supabase authentication error: Your session may have expired. Try refreshing the page.');
        } else {
          updateResendInfo(false, 'Failed to check API key status: ' + (result.error || 'Unknown error'));
        }
      }
    } catch (error) {
      console.error('Unexpected error in checkResendStatus:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      updateResendInfo(false, 'Error: ' + errorMessage);
    }
  }, [setSendingStatus, updateResendInfo]);

  return {
    status,
    isSending: status.isSending,
    debugInfo,
    emailsSent,
    resendInfo,
    handleTestEmail,
    resetCounter,
    checkResendKeyStatus: checkResendStatus,
    // Export these methods so they can be used in useEmailTest
    setSendingStatus,
    setSuccessStatus,
    setErrorStatus,
    updateDebugInfo
  };
}
