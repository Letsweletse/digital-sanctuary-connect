
import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';

interface EmailStatusPanelProps {
  emailsSent: number;
  resetCounter: () => void;
  resendInfo: {
    checked: boolean;
    message: string;
  };
}

const EmailStatusPanel = ({ 
  emailsSent, 
  resetCounter, 
  resendInfo
}: EmailStatusPanelProps) => {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-medium">Email Status</h3>
        
        {emailsSent > 0 && (
          <button 
            onClick={resetCounter} 
            className="text-xs text-gray-500 hover:text-gray-700"
          >
            Reset counter
          </button>
        )}
      </div>
      
      <div className="bg-gray-100 rounded-md p-3 mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-700 font-medium">Resend API:</span>
          {resendInfo.checked ? (
            <span className={`text-sm ${resendInfo.message.includes('active') ? 'text-green-600' : 'text-red-600'}`}>
              {resendInfo.message.includes('active') ? '✓ Active' : '✗ Issue detected'}
            </span>
          ) : (
            <span className="text-sm text-gray-500">Not checked</span>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-gray-700 font-medium">Emails sent:</span>
          <span className={`text-sm font-medium ${emailsSent > 0 ? 'text-green-600' : 'text-gray-500'}`}>
            {emailsSent}
          </span>
        </div>
      </div>
    </div>
  );
};

export default EmailStatusPanel;
