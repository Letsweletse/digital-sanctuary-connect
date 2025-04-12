
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
      updateDebugInfo(result.data ? JSON.stringify(result.data, null, 2) : JSON.stringify(result, null, 2));
      console.log("Email test result:", result);
      
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
          updateDebugInfo(`
Resend API key issue detected!

Error: ${result.error}

Troubleshooting steps:
1. Check that the RESEND_API_KEY is properly set in Supabase Edge Function secrets
2. Make sure the key format is correct (should start with 're_')
3. Verify the key is active in your Resend dashboard
4. Try regenerating a new API key if needed
          `);
        } else if (isSupabaseAuthIssue) {
          console.error('Supabase authentication issue detected:', result.error);
          updateDebugInfo(`
Supabase authentication error detected!

Error: ${result.error}

This typically happens when:
- Your Supabase session has expired
- Your anon key is incorrect or missing
- There's an issue with the JWT token
- Your browser's local storage has been cleared

Try refreshing the page to get a new session token.
          `);
        } else {
          // This might be an issue with the edge function itself
          updateDebugInfo(`
Edge Function Error!

The function returned an error response. This could be due to:
- Internal server error in the edge function
- Issues with the Resend API service
- Network connectivity problems
- Malformed request or validation errors

Error details: ${result.error || 'Unknown error'}

Check the edge function logs in the Supabase dashboard for more details.
          `);
        }
      }
    } catch (error) {
      console.error('Unexpected error in handleTestEmail:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setErrorStatus(errorMessage, emailForm.testEmail, false);
      updateDebugInfo(`
Unexpected client-side error:
${errorMessage}

This indicates a problem in the browser code, not the edge function.
Try refreshing the page and check your browser's console for more information.
      `);
    }
  }, [emailForm.testEmail, emailForm.testPhone, setSendingStatus, setSuccessStatus, setErrorStatus, updateDebugInfo]);

  // Check the status of the Resend API key
  const checkResendStatus = useCallback(async () => {
    setSendingStatus();
    updateDebugInfo("Checking Resend API key status...");

    try {
      const result = await checkResendKeyStatus();
      console.log("Resend key status check result:", result);
      
      updateDebugInfo(result.data ? JSON.stringify(result.data, null, 2) : JSON.stringify(result, null, 2));
      
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
          updateDebugInfo(`
Supabase authentication error detected!

Error: ${result.error}

This typically happens when:
- Your Supabase session has expired
- Your anon key is incorrect or missing
- There's an issue with the JWT token
- Your browser's local storage has been cleared

Try refreshing the page to get a new session token.
          `);
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
      console.error('Unexpected error in checkResendStatus:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      updateResendInfo(false, 'Error: ' + errorMessage);
      updateDebugInfo(`
Unexpected client-side error while checking API key:
${errorMessage}

This indicates a problem in the browser code, not the edge function.
Try refreshing the page and check your browser's console for more information.
      `);
    }
  }, [setSendingStatus, updateResendInfo, updateDebugInfo]);

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
