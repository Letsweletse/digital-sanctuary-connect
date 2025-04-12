
import React, { useEffect } from 'react';
import { Card } from "@/components/ui/card";
import EmailStatusPanel from './EmailStatusPanel';
import EmailTestForm from './EmailTestForm';
import DebugInfo from './DebugInfo';
import EmailDeliveryLogs from './EmailDeliveryLogs';
import { useEmailTest } from './useEmailTest';

const EmailTest = () => {
  const {
    isSending,
    testEmail,
    setTestEmail,
    testPhone,
    setTestPhone,
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
      />

      <DebugInfo debugInfo={debugInfo} />
      
      <EmailDeliveryLogs />
      
      <div className="mt-4 text-sm text-gray-500 border-t pt-4">
        <p className="font-medium mb-1">Communication methods implemented:</p>
        <ul className="list-disc ml-5 text-xs space-y-1">
          <li>Email notifications via Resend API</li>
          <li>SMS notifications via Twilio (when configured)</li>
          <li>WhatsApp link generation as fallback</li>
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
