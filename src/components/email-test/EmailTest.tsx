
import React, { useEffect } from 'react';
import { Card } from "@/components/ui/card";
import EmailStatusPanel from './EmailStatusPanel';
import EmailTestForm from './EmailTestForm';
import DebugInfo from './DebugInfo';
import EmailDeliveryLogs from './EmailDeliveryLogs';
import { useEmailTest } from './useEmailTest';
import { Button } from '@/components/ui/button';
import { Bug } from 'lucide-react';

const EmailTest = () => {
  const {
    isSending,
    testEmail,
    setTestEmail,
    testPhone,
    setTestPhone,
    edgeFunction,
    setEdgeFunction,
    debugInfo,
    emailsSent,
    resendInfo,
    handleTestEmail,
    resetCounter,
    checkResendKeyStatus
  } = useEmailTest();
  
  // Check Resend API key status on component mount
  useEffect(() => {
    checkResendKeyStatus();
  }, [checkResendKeyStatus]);
  
  // Handle test registration
  const handleTestRegistration = () => {
    // Simulate a registration by opening the registration dialog
    const registerEvent = new CustomEvent('test-registration', {
      detail: {
        email: testEmail,
        phone: testPhone
      }
    });
    document.dispatchEvent(registerEvent);
  };
  
  return (
    <Card className="p-6 bg-white rounded-lg shadow-md max-w-md mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Enhanced Email Testing Tool</h2>
      
      <EmailStatusPanel 
        emailsSent={emailsSent} 
        resetCounter={resetCounter} 
        resendInfo={resendInfo} 
      />
      
      <EmailTestForm 
        testEmail={testEmail}
        setTestEmail={setTestEmail}
        testPhone={testPhone}
        setTestPhone={setTestPhone}
        handleTestEmail={handleTestEmail}
        isSending={isSending}
        edgeFunction={edgeFunction}
        setEdgeFunction={setEdgeFunction}
      />

      <div className="mt-4 mb-4">
        <Button 
          variant="outline" 
          onClick={handleTestRegistration}
          className="w-full flex items-center justify-center gap-2 border-green-300 hover:bg-green-50 text-green-700"
          disabled={isSending || !testEmail}
        >
          <Bug size={16} />
          Test Registration Flow
        </Button>
        <p className="text-xs text-gray-500 mt-1">
          This will simulate a full registration flow to test end-to-end email delivery
        </p>
      </div>

      <DebugInfo debugInfo={debugInfo} />
      
      <EmailDeliveryLogs />
      
      <div className="mt-4 text-sm text-gray-500 border-t pt-4">
        <p className="font-medium mb-1">Communication methods implemented:</p>
        <ul className="list-disc ml-5 text-xs space-y-1">
          <li>Email notifications via Resend API</li>
          <li>SMS notifications via Twilio (when configured)</li>
          <li>Comprehensive delivery tracking and logging</li>
        </ul>
        <p className="mt-2 text-xs">To enable SMS, add Twilio credentials in Supabase Edge Function secrets:</p>
        <ul className="list-disc ml-5 text-xs">
          <li>TWILIO_ACCOUNT_SID</li>
          <li>TWILIO_AUTH_TOKEN</li>
          <li>TWILIO_PHONE_NUMBER</li>
        </ul>
      </div>
    </Card>
  );
};

export default EmailTest;
