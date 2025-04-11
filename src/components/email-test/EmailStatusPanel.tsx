
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

interface EmailStatusPanelProps {
  emailsSent: number;
  resetCounter: () => void;
  resendInfo: {
    checked: boolean;
    message: string;
  };
}

const EmailStatusPanel = ({ emailsSent, resetCounter, resendInfo }: EmailStatusPanelProps) => {
  return (
    <>
      <div className="mb-4 p-3 bg-yellow-50 rounded-md border border-yellow-200">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-md">Emails Sent This Session: {emailsSent}</h3>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs"
            onClick={resetCounter}
          >
            Reset Counter
          </Button>
        </div>
        <p className="text-xs text-gray-600 mt-2">
          <strong>Important:</strong> This counter only tracks emails sent from this browser session.
          To check your actual Resend API usage, visit your Resend dashboard.
        </p>
      </div>
      
      {resendInfo.checked && (
        <div className={`mb-4 p-3 rounded-md border ${
          resendInfo.message.includes('active') 
            ? 'bg-green-50 border-green-200' 
            : 'bg-red-50 border-red-200'
        }`}>
          <p className="text-sm">
            <strong>Resend API Status:</strong> {resendInfo.message}
          </p>
          <p className="text-xs mt-1">
            <a 
              href="https://resend.com/dashboard" 
              target="_blank" 
              rel="noopener noreferrer"
              className="underline text-blue-600 hover:text-blue-800"
            >
              Visit Resend Dashboard
            </a> to check your actual usage and limits.
          </p>
        </div>
      )}
    </>
  );
};

export default EmailStatusPanel;
