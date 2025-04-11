
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
      isTestEmail: true
    };
    
    const result = await sendTestEmail(testEmailData);
    
    // For debugging
    updateDebugInfo(result.data);
    
    if (result.success && result.data) {
      setSuccessStatus(result.data, emailForm.testEmail);
    } else {
      setErrorStatus(
        result.error || 'Failed to send test email', 
        emailForm.testEmail, 
        result.data?.resendKeyConfigured
      );
    }
  }, [emailForm.testEmail, emailForm.testPhone, setSendingStatus, setSuccessStatus, setErrorStatus, updateDebugInfo]);

  // Check the status of the Resend API key
  const checkResendStatus = useCallback(async () => {
    setSendingStatus();

    const result = await checkResendKeyStatus();
    
    if (result.success && result.data) {
      const data = result.data;
      updateResendInfo(
        data.keyConfigured, 
        data.keyConfigured ? 'API key is active and properly configured' : 'API key is missing or invalid'
      );
    } else {
      updateResendInfo(false, 'Failed to check API key status');
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
