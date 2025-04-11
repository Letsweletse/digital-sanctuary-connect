
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
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${
              resendInfo.message.includes('active') ? 'bg-green-500' : 'bg-red-500'
            }`}></div>
            <p className="text-sm font-medium">
              <strong>Resend API Status:</strong> {resendInfo.message}
            </p>
          </div>
          
          <div className="mt-2 text-xs space-y-1">
            <p>
              Free tier limits: ~100 emails per day, 10MB attachments, 5 recipients per email.
            </p>
            <p>
              <span className="font-medium">Note:</span> If you're receiving validation errors, make sure your sender domain is verified.
            </p>
            <div className="mt-2">
              <a 
                href="https://resend.com/dashboard" 
                target="_blank" 
                rel="noopener noreferrer"
                className="underline text-blue-600 hover:text-blue-800 mr-4"
              >
                Resend Dashboard
              </a>
              <a 
                href="https://resend.com/domains" 
                target="_blank" 
                rel="noopener noreferrer"
                className="underline text-blue-600 hover:text-blue-800"
              >
                Verify Domain
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EmailStatusPanel;
