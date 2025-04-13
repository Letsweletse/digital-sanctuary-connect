import { useCallback, useState, useEffect } from 'react';
import { useEmailForm } from './useEmailForm';
import { useEmailOperations } from './useEmailOperations';
import { invokeEmailFunction } from './services/edgeFunctionService';
import { sendEmailWithRedundancy, checkEmailProvidersHealth } from './services/emailRedundancyManager';
import { ProviderHealth } from './types';
import { toast } from 'sonner';
import { getStoredResendApiKey } from '@/lib/directResendService';
import { sendDirectToResend } from './services/directResendService';

export function useEmailTest() {
  const emailForm = useEmailForm();
  const emailOperations = useEmailOperations(emailForm);
  const [useRedundancySystem, setUseRedundancySystem] = useState<boolean>(true);
  const [directBypassMode, setDirectBypassMode] = useState<boolean>(false);
  const [providerHealth, setProviderHealth] = useState<ProviderHealth>({
    checking: false,
    primary: {
      available: false,
      message: 'Not checked'
    },
    fallback: {
      available: false,
      message: 'Not checked'
    }
  });
  
  const [hasDirectApiKey, setHasDirectApiKey] = useState<boolean>(false);
  
  useEffect(() => {
    const apiKey = getStoredResendApiKey();
    setHasDirectApiKey(!!apiKey);
  }, []);
  
  const checkProviderHealth = useCallback(async () => {
    setProviderHealth(prev => ({
      ...prev,
      checking: true
    }));
    
    try {
      const healthStatus = await checkEmailProvidersHealth();
      
      setProviderHealth({
        checking: false,
        primary: healthStatus.primary,
        fallback: healthStatus.fallback,
        lastChecked: new Date()
      });

      if (healthStatus.primary.available) {
        toast.success('Primary Email Provider is Healthy', {
          description: healthStatus.primary.message
        });
      } else {
        toast.warning('Primary Email Provider has Issues', {
          description: healthStatus.primary.message
        });
        
        const apiKey = getStoredResendApiKey();
        if (apiKey && !directBypassMode) {
          setDirectBypassMode(true);
          toast.info('Direct Resend API Mode Activated', {
            description: 'Due to issues with Edge Functions, direct Resend API access has been activated automatically.'
          });
        }
      }
    } catch (error) {
      console.error('Error checking provider health:', error);
      
      setProviderHealth(prev => ({
        ...prev,
        checking: false,
        lastChecked: new Date()
      }));

      toast.error('Failed to Check Provider Health', {
        description: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    }
  }, [directBypassMode]);
  
  useEffect(() => {
    const handleTestRegistration = (event: CustomEvent) => {
      console.log('Test registration event triggered:', event.detail);
      
      sendTestRegistrationEmail(event.detail.email, event.detail.phone);
    };
    
    document.addEventListener('test-registration', handleTestRegistration as EventListener);
    
    return () => {
      document.removeEventListener('test-registration', handleTestRegistration as EventListener);
    };
  }, [emailForm.testEmail, emailForm.testPhone]);
  
  const sendTestRegistrationEmail = useCallback(async (email: string, phone: string) => {
    emailOperations.setSendingStatus();
    emailOperations.updateDebugInfo("Initiating test registration email - preparing request...");
    
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
      emailOperations.updateDebugInfo("Sending registration test...");
      
      let result;
      
      if (directBypassMode && hasDirectApiKey) {
        emailOperations.updateDebugInfo("Using direct Resend API access (bypassing Supabase)...");
        result = await sendDirectToResend(testRegistrationData);
      } else if (useRedundancySystem) {
        emailOperations.updateDebugInfo("Using redundancy system with automatic failover...");
        result = await sendEmailWithRedundancy(testRegistrationData);
      } else {
        emailOperations.updateDebugInfo("Using primary provider only...");
        result = await invokeEmailFunction(emailForm.edgeFunction, testRegistrationData);
      }
      
      emailOperations.updateDebugInfo(result.data ? JSON.stringify(result.data, null, 2) : JSON.stringify(result, null, 2));
      console.log("Registration test result:", result);
      
      if (result.success && result.data) {
        const successData = {
          ...result.data,
          fallbackUsed: result.fallbackUsed,
          provider: result.provider,
          bypassMode: result.bypassMode
        };
        
        emailOperations.setSuccessStatus(successData, email || emailForm.testEmail);
        
        if (result.bypassMode) {
          emailOperations.updateDebugInfo(`Email sent via direct Resend API access, bypassing Supabase Edge Functions.`);
          toast.success('Email Sent via Direct API', {
            description: 'Successfully sent email using direct Resend API access.'
          });
        } else if (result.fallbackUsed) {
          emailOperations.updateDebugInfo(`Primary provider failed, email was sent via fallback (${result.provider}). Primary error: ${result.primaryError}`);
        }
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
  }, [emailForm.edgeFunction, emailForm.testEmail, emailForm.testPhone, emailOperations, useRedundancySystem, directBypassMode, hasDirectApiKey]);
  
  const sendTestEmailWithForm = useCallback(async () => {
    emailOperations.setSendingStatus();
    
    let result;
    
    if (directBypassMode && hasDirectApiKey) {
      emailOperations.updateDebugInfo("Using direct Resend API access (bypassing Supabase)...");
      result = await sendDirectToResend(emailForm.formData);
    } else if (useRedundancySystem) {
      emailOperations.updateDebugInfo("Using redundancy system with automatic failover...");
      result = await sendEmailWithRedundancy(emailForm.formData);
    } else {
      emailOperations.updateDebugInfo("Using primary provider only...");
      result = await invokeEmailFunction(emailForm.edgeFunction, emailForm.formData);
    }

    if (result.success && result.data) {
      const data = result.data;
      
      if (data.success) {
        emailOperations.setSuccessStatus(data, emailForm.formData.to);
        
        if (result.bypassMode) {
          emailOperations.updateDebugInfo(`Email sent via direct Resend API access, bypassing Supabase Edge Functions.`);
          toast.success('Email Sent via Direct API', {
            description: 'Successfully sent email using direct Resend API access.'
          });
        } else if (result.fallbackUsed) {
          emailOperations.updateDebugInfo(`Primary provider failed, email was sent via fallback (${result.provider}). Primary error: ${result.primaryError}`);
        }
      } else {
        emailOperations.setErrorStatus(data.message || 'Failed to send email', emailForm.formData.to, data.resendKeyConfigured);
      }
    } else {
      emailOperations.setErrorStatus(result.error || 'Unknown error occurred', emailForm.formData.to, null);
    }
  }, [emailForm.edgeFunction, emailForm.formData, emailOperations, useRedundancySystem, directBypassMode, hasDirectApiKey]);

  return {
    ...emailForm,
    ...emailOperations,
    sendTestEmail: sendTestEmailWithForm,
    sendTestRegistrationEmail,
    providerHealth,
    checkProviderHealth,
    useRedundancySystem,
    setUseRedundancySystem,
    directBypassMode,
    setDirectBypassMode,
    hasDirectApiKey
  };
}
