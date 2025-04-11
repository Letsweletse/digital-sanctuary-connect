
import { useState, useCallback, useEffect } from 'react';
import { useEmailForm } from './useEmailForm';
import { checkResendKeyStatus, sendTestEmail, invokeEmailFunction } from './emailService';
import { EmailStatus, initialStatus, ResendInfo } from './types';

export function useEmailTest() {
  const emailForm = useEmailForm();
  const [status, setStatus] = useState<EmailStatus>(initialStatus);
  const [emailsSent, setEmailsSent] = useState<number>(0);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);
  const [resendInfo, setResendInfo] = useState<ResendInfo>({
    checked: false,
    message: 'Not checked yet'
  });

  // Reset email counter
  const resetCounter = useCallback(() => {
    setEmailsSent(0);
  }, []);

  // Function to handle test email sending
  const handleTestEmail = useCallback(async () => {
    if (!emailForm.testEmail) return;
    
    setStatus(prev => ({
      ...prev,
      isSending: true,
      isSuccess: null,
      error: null,
      message: null
    }));
    
    setDebugInfo(null);
    
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
    if (result.data) {
      setDebugInfo(JSON.stringify(result.data, null, 2));
    }
    
    if (result.success && result.data) {
      const data = result.data;
      setStatus({
        isSending: false,
        isSuccess: true,
        adminEmailSent: data.data?.adminEmailSent || false,
        confirmationEmailSent: data.data?.confirmationEmailSent || true,
        whatsappSent: data.data?.whatsappNotificationSent || false,
        whatsappLink: data.data?.whatsappNotificationLink || null,
        resendKeyConfigured: true,
        message: 'Test email sent successfully!',
        error: null,
        lastSentTo: emailForm.testEmail
      });
      // Increment sent counter
      setEmailsSent(prev => prev + 1);
    } else {
      setStatus({
        isSending: false,
        isSuccess: false,
        adminEmailSent: false,
        confirmationEmailSent: false,
        whatsappSent: false,
        whatsappLink: null,
        resendKeyConfigured: result.data?.resendKeyConfigured || false,
        message: null,
        error: result.error || 'Failed to send test email',
        lastSentTo: emailForm.testEmail
      });
    }
  }, [emailForm.testEmail, emailForm.testPhone]);

  // Function to send a test email with the form data
  const sendTestEmailWithForm = useCallback(async () => {
    setStatus(prev => ({
      ...prev,
      isSending: true,
      isSuccess: null,
      message: null,
      error: null
    }));

    const result = await invokeEmailFunction(emailForm.edgeFunction, emailForm.formData);

    if (result.success && result.data) {
      const data = result.data;
      
      // Handle successful response
      if (data.success) {
        setStatus({
          isSending: false,
          isSuccess: true,
          adminEmailSent: data.data?.adminEmailSent || true,
          confirmationEmailSent: data.data?.confirmationEmailSent || false,
          whatsappSent: data.data?.whatsappNotificationSent || false,
          whatsappLink: data.data?.whatsappNotificationLink || null,
          resendKeyConfigured: data.data?.resendKeyConfigured || true,
          message: data.message || 'Email sent successfully',
          error: null,
          lastSentTo: emailForm.formData.to
        });
      } else {
        // Handle error response
        setStatus({
          isSending: false,
          isSuccess: false,
          adminEmailSent: false,
          confirmationEmailSent: false,
          whatsappSent: false,
          whatsappLink: null,
          resendKeyConfigured: data.data?.resendKeyConfigured || false,
          message: null,
          error: data.message || 'Failed to send email',
          lastSentTo: emailForm.formData.to
        });
      }
    } else {
      setStatus({
        isSending: false,
        isSuccess: false,
        adminEmailSent: false,
        confirmationEmailSent: false,
        whatsappSent: false,
        whatsappLink: null,
        resendKeyConfigured: null,
        message: null,
        error: result.error || 'Unknown error occurred',
        lastSentTo: emailForm.formData.to
      });
    }
  }, [emailForm.edgeFunction, emailForm.formData]);

  // Check the status of the Resend API key
  const checkResendStatus = useCallback(async () => {
    setStatus(prev => ({
      ...prev,
      isSending: true
    }));

    const result = await checkResendKeyStatus();
    
    if (result.success && result.data) {
      const data = result.data;
      setResendInfo({
        checked: true,
        message: data.keyConfigured ? 'API key is active and properly configured' : 'API key is missing or invalid'
      });
      
      setStatus(prev => ({
        ...prev,
        isSending: false,
        resendKeyConfigured: data.keyConfigured,
        message: data.message,
        error: data.error || null
      }));
    } else {
      setResendInfo({
        checked: true,
        message: 'Failed to check API key status'
      });
      
      setStatus(prev => ({
        ...prev,
        isSending: false,
        error: result.error || 'Unknown error occurred'
      }));
    }
  }, []);

  // Combine all the hooks and functions
  return {
    ...emailForm,
    status,
    isSending: status.isSending,
    debugInfo,
    emailsSent,
    resendInfo,
    handleTestEmail,
    resetCounter,
    sendTestEmail: sendTestEmailWithForm,
    checkResendKeyStatus: checkResendStatus
  };
}
