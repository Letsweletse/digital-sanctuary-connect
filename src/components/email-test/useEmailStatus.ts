
import { useState, useCallback } from 'react';
import { EmailStatus, initialStatus, ResendInfo } from './types';

export function useEmailStatus() {
  const [status, setStatus] = useState<EmailStatus>(initialStatus);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);
  const [emailsSent, setEmailsSent] = useState<number>(0);
  const [resendInfo, setResendInfo] = useState<ResendInfo>({
    checked: false,
    message: 'Not checked yet'
  });

  // Reset email counter
  const resetCounter = useCallback(() => {
    setEmailsSent(0);
  }, []);

  // Set status for sending process
  const setSendingStatus = useCallback(() => {
    setStatus(prev => ({
      ...prev,
      isSending: true,
      isSuccess: null,
      error: null,
      message: null
    }));
    setDebugInfo(null);
  }, []);

  // Update status for success response
  const setSuccessStatus = useCallback((data: any, recipient: string) => {
    setStatus({
      isSending: false,
      isSuccess: true,
      adminEmailSent: data.data?.adminEmailSent || false,
      confirmationEmailSent: data.data?.confirmationEmailSent || true,
      whatsappSent: data.data?.whatsappNotificationSent || false,
      whatsappLink: data.data?.whatsappNotificationLink || null,
      resendKeyConfigured: data.resendKeyConfigured || true,
      message: 'Test email sent successfully!',
      error: null,
      lastSentTo: recipient
    });
    
    // Increment sent counter
    setEmailsSent(prev => prev + 1);
  }, []);

  // Update status for error response
  const setErrorStatus = useCallback((error: string, recipient: string, resendKeyConfigured: boolean | null = false) => {
    setStatus({
      isSending: false,
      isSuccess: false,
      adminEmailSent: false,
      confirmationEmailSent: false,
      whatsappSent: false,
      whatsappLink: null,
      resendKeyConfigured,
      message: null,
      error: error || 'Failed to send test email',
      lastSentTo: recipient
    });
  }, []);

  // Set debug info
  const updateDebugInfo = useCallback((data: any) => {
    if (data) {
      setDebugInfo(JSON.stringify(data, null, 2));
    }
  }, []);

  // Update resend API key status
  const updateResendInfo = useCallback((isConfigured: boolean, message: string) => {
    setResendInfo({
      checked: true,
      message: isConfigured ? 'API key is active and properly configured' : message
    });
    
    setStatus(prev => ({
      ...prev,
      isSending: false,
      resendKeyConfigured: isConfigured,
    }));
  }, []);

  return {
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
  };
}
