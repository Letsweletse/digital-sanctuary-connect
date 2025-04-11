
import React from 'react';
import { Card } from "@/components/ui/card";
import EmailStatusPanel from './EmailStatusPanel';
import EmailTestForm from './EmailTestForm';
import DebugInfo from './DebugInfo';
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
    resetCounter
  } = useEmailTest();
  
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
      
      <div className="mt-4 text-sm text-gray-500">
        <p>Admin recipients: otenggate@gmail.com, info@gategaborone.com, iblimenterprise@zohomail.com</p>
      </div>
    </Card>
  );
};

export default EmailTest;
