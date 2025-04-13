
import { useCallback } from 'react';

/**
 * Hook for email status update operations
 */
export function useEmailStatusUpdates(statusMethods: {
  setSendingStatus: () => void;
  setSuccessStatus: (data: any, email: string) => void;
  setErrorStatus: (error: string, email: string, resendKeyConfigured: boolean | null) => void;
  updateDebugInfo: (info: any) => void;
  updateResendInfo: (isConfigured: boolean, message: string) => void;
}) {
  const {
    setSendingStatus,
    setSuccessStatus,
    setErrorStatus,
    updateDebugInfo,
    updateResendInfo
  } = statusMethods;

  // Handle successful email responses
  const handleSuccessResponse = useCallback((result: any, testEmail: string) => {
    if (result.success && result.data) {
      setSuccessStatus(result.data, testEmail);
    } else {
      handleErrorResponse(
        result.error || 'Failed to send test email', 
        testEmail, 
        result.data?.resendKeyConfigured
      );
    }
  }, [setSuccessStatus]);

  // Handle API key issue detection and debugging
  const handleApiKeyIssue = useCallback((result: any) => {
    const isApiKeyIssue = 
      result.error?.includes('API key') || 
      result.error?.includes('authentication') || 
      (result.data?.resendKeyConfigured === false);
      
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
    }
    
    return isApiKeyIssue;
  }, [updateDebugInfo]);

  // Handle Supabase auth issues
  const handleSupabaseAuthIssue = useCallback((result: any) => {
    const isSupabaseAuthIssue = 
      result.error?.includes('No API key found') ||
      result.error?.includes('apikey request header') ||
      result.error?.includes('JWT') ||
      result.error?.includes('401');
      
    if (isSupabaseAuthIssue) {
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
    }
    
    return isSupabaseAuthIssue;
  }, [updateDebugInfo]);

  // Handle edge function errors
  const handleEdgeFunctionError = useCallback((result: any) => {
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
  }, [updateDebugInfo]);

  // Handle error responses
  const handleErrorResponse = useCallback((error: string, email: string, resendKeyConfigured: boolean | null = false) => {
    setErrorStatus(error, email, resendKeyConfigured);
  }, [setErrorStatus]);

  // Handle unexpected client-side errors
  const handleClientError = useCallback((error: unknown, email: string) => {
    console.error('Unexpected error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    setErrorStatus(errorMessage, email, false);
    updateDebugInfo(`
Unexpected client-side error:
${errorMessage}

This indicates a problem in the browser code, not the edge function.
Try refreshing the page and check your browser's console for more information.
    `);
  }, [setErrorStatus, updateDebugInfo]);

  return {
    handleSuccessResponse,
    handleErrorResponse,
    handleApiKeyIssue,
    handleSupabaseAuthIssue,
    handleEdgeFunctionError,
    handleClientError
  };
}
