
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ADMIN_EMAIL, ADMIN_EMAILS } from '@/lib/emailService';

// Define the email test form data type
interface EmailTestFormData {
  to: string;
  subject: string;
  name: string;
  email: string;
  message: string;
  eventName: string;
  eventDate: string;
  eventTime: string;
  location: string;
  sendConfirmation: boolean;
  title: string;
  role: string;
  denomination: string;
  phone: string;
}

// Define API response types
interface EmailSuccessResponse {
  success: true;
  message: string;
  recipients: string[];
  timestamp: string;
  data: any;
  error?: never;
}

interface EmailErrorResponse {
  success: false;
  message: string;
  error?: string;
  recipients?: undefined;
  timestamp?: undefined;
  data?: undefined;
}

type EmailResponse = EmailSuccessResponse | EmailErrorResponse;

export interface EmailStatus {
  isSending: boolean;
  isSuccess: boolean | null;
  adminEmailSent: boolean | null;
  confirmationEmailSent: boolean | null;
  whatsappSent: boolean | null;
  whatsappLink: string | null;
  resendKeyConfigured: boolean | null;
  message: string | null;
  error: string | null;
  lastSentTo: string | null;
}

// Default form data
const defaultFormData: EmailTestFormData = {
  to: ADMIN_EMAILS.join(','),
  subject: 'Test Email from Gate Gaborone',
  name: 'Test User',
  email: 'test@example.com',
  message: 'This is a test message from the email test form.',
  eventName: 'Testing Event',
  eventDate: '2025-04-15',
  eventTime: '10:00 AM - 12:00 PM',
  location: 'Gate Gaborone Church, Block 10, Gaborone, Botswana',
  sendConfirmation: true,
  title: 'Mr',
  role: 'Member',
  denomination: 'Non-denominational',
  phone: '+267 71000000'
};

// Initial status
const initialStatus: EmailStatus = {
  isSending: false,
  isSuccess: null,
  adminEmailSent: null,
  confirmationEmailSent: null,
  whatsappSent: null,
  whatsappLink: null,
  resendKeyConfigured: null,
  message: null,
  error: null,
  lastSentTo: null
};

export function useEmailTest() {
  const [formData, setFormData] = useState<EmailTestFormData>(defaultFormData);
  const [status, setStatus] = useState<EmailStatus>(initialStatus);
  const [edgeFunction, setEdgeFunction] = useState<string>('send-email');
  
  // Add these properties needed by EmailTest component
  const [testEmail, setTestEmail] = useState<string>('');
  const [testPhone, setTestPhone] = useState<string>('+267');
  const [emailsSent, setEmailsSent] = useState<number>(0);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);
  const [resendInfo, setResendInfo] = useState<{ checked: boolean; message: string }>({
    checked: false,
    message: 'Not checked yet'
  });

  // Handle form input changes
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      setFormData(prev => ({
        ...prev,
        [name]: target.checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  }, []);

  // Reset the form to default values
  const resetForm = useCallback(() => {
    setFormData(defaultFormData);
    setStatus(initialStatus);
  }, []);

  // Reset email counter
  const resetCounter = useCallback(() => {
    setEmailsSent(0);
  }, []);

  // Function to handle test email sending
  const handleTestEmail = useCallback(async () => {
    if (!testEmail) return;
    
    setStatus(prev => ({
      ...prev,
      isSending: true,
      isSuccess: null,
      error: null,
      message: null
    }));
    
    setDebugInfo(null);
    
    try {
      // Prepare the test email data
      const testEmailData = {
        to: [testEmail],
        subject: 'Event Registration Confirmation - Gate Gaborone',
        name: 'Test User',
        email: testEmail,
        phone: testPhone,
        message: 'This is a test event registration.',
        eventName: 'Sunday Service',
        eventDate: '2025-04-14',
        eventTime: '09:00 AM - 11:00 AM',
        location: 'Gate Gaborone Church, Block 10',
        sendConfirmation: true,
        checkInId: Date.now().toString(),
        isTestEmail: true
      };
      
      console.log('Sending test email with data:', testEmailData);
      
      const { data, error } = await supabase.functions.invoke<EmailResponse>('send-email', {
        body: testEmailData
      });
      
      if (error) {
        throw new Error(`Failed to invoke function: ${error.message}`);
      }
      
      console.log('Email test response:', data);
      
      if (!data) {
        throw new Error('No response received');
      }
      
      // For debugging
      setDebugInfo(JSON.stringify(data, null, 2));
      
      if (data.success) {
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
          lastSentTo: testEmail
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
          resendKeyConfigured: data.data?.resendKeyConfigured || false,
          message: null,
          error: data.error || data.message || 'Failed to send test email',
          lastSentTo: testEmail
        });
      }
    } catch (err) {
      console.error('Error sending test email:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      
      setStatus({
        isSending: false,
        isSuccess: false,
        adminEmailSent: false,
        confirmationEmailSent: false,
        whatsappSent: false,
        whatsappLink: null,
        resendKeyConfigured: null,
        message: null,
        error: errorMessage,
        lastSentTo: testEmail
      });
      
      setDebugInfo(errorMessage);
    }
  }, [testEmail, testPhone]);

  // Function to send a test email
  const sendTestEmail = useCallback(async () => {
    setStatus(prev => ({
      ...prev,
      isSending: true,
      isSuccess: null,
      message: null,
      error: null
    }));

    try {
      console.log(`Invoking ${edgeFunction} function with form data:`, formData);
      
      // Prepare the email recipients array
      const toEmails = formData.to.split(',').map(email => email.trim());
      
      // Validate recipient emails
      const invalidEmails = toEmails.filter(email => !email.includes('@'));
      if (invalidEmails.length > 0) {
        throw new Error(`Invalid email address(es): ${invalidEmails.join(', ')}`);
      }

      // Invoke the Supabase edge function
      const { data, error } = await supabase.functions.invoke<EmailResponse>(edgeFunction, {
        body: {
          ...formData,
          to: toEmails
        }
      });

      if (error) {
        // This handles errors from the Supabase invoke function itself
        console.error('Error invoking edge function:', error);
        
        setStatus({
          isSending: false,
          isSuccess: false,
          adminEmailSent: false,
          confirmationEmailSent: false,
          whatsappSent: false,
          whatsappLink: null,
          resendKeyConfigured: false,
          message: null,
          error: `Failed to invoke the ${edgeFunction} function: ${error.message}`,
          lastSentTo: formData.to
        });
        return;
      }

      console.log('Edge function response:', data);

      if (!data) {
        throw new Error('No response data received from edge function');
      }

      // Handle API key validation errors from the function
      if (!data.success && data.message && data.message.includes('API key')) {
        setStatus({
          isSending: false,
          isSuccess: false,
          adminEmailSent: false,
          confirmationEmailSent: false,
          whatsappSent: false,
          whatsappLink: null,
          resendKeyConfigured: false,
          message: null,
          error: data.message,
          lastSentTo: formData.to
        });
        return;
      }

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
          lastSentTo: formData.to
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
          lastSentTo: formData.to
        });
      }
    } catch (err) {
      console.error('Error in sendTestEmail:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      
      setStatus({
        isSending: false,
        isSuccess: false,
        adminEmailSent: false,
        confirmationEmailSent: false,
        whatsappSent: false,
        whatsappLink: null,
        resendKeyConfigured: null,
        message: null,
        error: errorMessage,
        lastSentTo: formData.to
      });
    }
  }, [formData, edgeFunction]);

  // Check the status of the Resend API key
  const checkResendKeyStatus = useCallback(async () => {
    setStatus(prev => ({
      ...prev,
      isSending: true
    }));

    try {
      const { data, error } = await supabase.functions.invoke('check-resend-status');
      
      if (error) {
        throw new Error(`Failed to check Resend API key status: ${error.message}`);
      }
      
      if (data) {
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
        throw new Error('No response data received');
      }
    } catch (err) {
      console.error('Error checking Resend key status:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      
      setResendInfo({
        checked: true,
        message: 'Failed to check API key status'
      });
      
      setStatus(prev => ({
        ...prev,
        isSending: false,
        error: errorMessage
      }));
    }
  }, []);

  return {
    formData,
    status,
    edgeFunction,
    setEdgeFunction,
    handleInputChange,
    sendTestEmail,
    resetForm,
    checkResendKeyStatus,
    // Add these to fix the TypeScript errors
    isSending: status.isSending,
    testEmail,
    setTestEmail,
    testPhone,
    setTestPhone,
    debugInfo,
    emailsSent,
    resendInfo,
    handleTestEmail,
    resetCounter
  };
}
