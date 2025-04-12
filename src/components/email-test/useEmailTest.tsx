
import { useCallback } from 'react';
import { useEmailForm } from './useEmailForm';
import { useEmailOperations } from './useEmailOperations';
import { invokeEmailFunction } from './emailService';

export function useEmailTest() {
  const emailForm = useEmailForm();
  const emailOperations = useEmailOperations(emailForm);
  
  // Function to send a test email with the form data
  const sendTestEmailWithForm = useCallback(async () => {
    emailOperations.setSendingStatus();

    const result = await invokeEmailFunction(emailForm.edgeFunction, emailForm.formData);

    if (result.success && result.data) {
      const data = result.data;
      
      // Handle successful response
      if (data.success) {
        emailOperations.setSuccessStatus(data, emailForm.formData.to);
      } else {
        // Handle error response
        emailOperations.setErrorStatus(data.message || 'Failed to send email', emailForm.formData.to, data.resendKeyConfigured);
      }
    } else {
      // Handle error
      emailOperations.setErrorStatus(result.error || 'Unknown error occurred', emailForm.formData.to, null);
    }
  }, [emailForm.edgeFunction, emailForm.formData, emailOperations]);

  // Combine all the hooks and functions
  return {
    ...emailForm,
    ...emailOperations,
    sendTestEmail: sendTestEmailWithForm
  };
}
