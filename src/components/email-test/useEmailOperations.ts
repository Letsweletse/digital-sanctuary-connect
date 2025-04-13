
import { useCallback } from 'react';
import { useEmailStatus } from './useEmailStatus';
import { useEmailTestOperations } from './hooks/useEmailTestOperations';

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

  const statusMethods = {
    setSendingStatus,
    setSuccessStatus,
    setErrorStatus,
    updateDebugInfo,
    updateResendInfo
  };

  const {
    handleTestEmail,
    checkResendStatus
  } = useEmailTestOperations(emailForm, statusMethods);

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
