
import { useCallback, useState, useEffect } from 'react';
import { useEmailForm } from './useEmailForm';
import { useEmailOperations } from './useEmailOperations';
import { invokeEmailFunction } from './emailService';

export function useEmailTest() {
  const emailForm = useEmailForm();
  const emailOperations = useEmailOperations(emailForm);
  
  // Listen for test registration events
  useEffect(() => {
    const handleTestRegistration = (event: CustomEvent) => {
      console.log('Test registration event triggered:', event.detail);
      
      // Trigger a test registration email with the form data
      sendTestRegistrationEmail(event.detail.email, event.detail.phone);
    };
    
    // Add event listener (with type assertion)
    document.addEventListener('test-registration', handleTestRegistration as EventListener);
    
    // Clean up the event listener
    return () => {
      document.removeEventListener('test-registration', handleTestRegistration as EventListener);
    };
  }, [emailForm.testEmail, emailForm.testPhone]);
  
  // Function to send a test registration email
  const sendTestRegistrationEmail = useCallback(async (email: string, phone: string) => {
    emailOperations.setSendingStatus();
    emailOperations.updateDebugInfo("Initiating test registration email - preparing request...");
    
    // Prepare the test registration email data
    const testRegistrationData = {
      to: ["info@gategaborone.com", "otenggate@gmail.com"],
      subject: 'New Event Registration (Test)',
      name: 'Test User',
      email: email || emailForm.testEmail,
      phone: phone || emailForm.testPhone || "+26771234567",
      message: 'This is a test registration to verify email delivery.',
      eventName: 'Sunday Service',
      eventDate: '2025-04-14',
      eventTime: '09:00 AM - 11:00 AM',
      location: 'Gate Gaborone Church, Block 10',
      sendConfirmation: true,
      checkInId: `test-${Date.now().toString()}`,
      attendeeEmail: email || emailForm.testEmail,
      isTestEmail: true,
      sendSms: !!phone,
      title: 'Mr',
      role: 'Member',
      denomination: 'Non-denominational',
      registrationType: 'Test'
    };
    
    try {
      emailOperations.updateDebugInfo("Sending registration test to edge function...");
      const result = await invokeEmailFunction(emailForm.edgeFunction, testRegistrationData);
      
      // For debugging
      emailOperations.updateDebugInfo(result.data ? JSON.stringify(result.data, null, 2) : JSON.stringify(result, null, 2));
      console.log("Registration test result:", result);
      
      if (result.success && result.data) {
        emailOperations.setSuccessStatus(result.data, email || emailForm.testEmail);
      } else {
        emailOperations.setErrorStatus(
          result.error || 'Failed to send test registration email', 
          email || emailForm.testEmail, 
          result.data?.resendKeyConfigured
        );
      }
    } catch (error) {
      console.error('Error in test registration:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      emailOperations.setErrorStatus(errorMessage, email || emailForm.testEmail, false);
      emailOperations.updateDebugInfo(`Unexpected client-side error in test registration: ${errorMessage}`);
    }
  }, [emailForm.edgeFunction, emailForm.testEmail, emailForm.testPhone, emailOperations]);
  
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
    sendTestEmail: sendTestEmailWithForm,
    sendTestRegistrationEmail
  };
}
