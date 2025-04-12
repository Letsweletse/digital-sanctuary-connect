
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
  whatsappLink?: string;
  requiresAdminAction?: boolean;
}

const EmailStatusPanel = ({ 
  emailsSent, 
  resetCounter, 
  resendInfo, 
  whatsappLink,
  requiresAdminAction = true // Default to true since that's our current implementation
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
        
        {whatsappLink && (
          <div className="mt-2 pt-2 border-t border-gray-200">
            <div className="flex items-center justify-between mb-1">
              <span className="text-gray-700 font-medium">WhatsApp:</span>
              <span className="text-sm text-amber-600">
                {requiresAdminAction ? '⚠️ Admin action required' : '✓ Sent directly'}
              </span>
            </div>
            
            {requiresAdminAction && (
              <div className="mt-1 p-2 bg-amber-50 rounded text-xs text-amber-800">
                <p className="font-semibold mb-1">Admin action required:</p>
                <p>WhatsApp messages require manual sending. To enable automatic sending, configure the WhatsApp Business API in Supabase secrets.</p>
                <p className="mt-1 mb-1">For now, click the link below to open WhatsApp and send the prepared message:</p>
                <a 
                  href={whatsappLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="mt-1 inline-flex items-center text-blue-600 hover:text-blue-800"
                >
                  Send WhatsApp message <ExternalLink className="ml-1" size={12} />
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailStatusPanel;
