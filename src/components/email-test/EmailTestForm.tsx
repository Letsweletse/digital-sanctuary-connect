
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EmailTestFormProps {
  testEmail: string;
  setTestEmail: (email: string) => void;
  testPhone: string;
  setTestPhone: (phone: string) => void;
  handleTestEmail: () => void;
  isSending: boolean;
  edgeFunction?: string;
  setEdgeFunction?: (fn: string) => void;
}

const EmailTestForm = ({ 
  testEmail, 
  setTestEmail, 
  testPhone,
  setTestPhone,
  handleTestEmail, 
  isSending,
  edgeFunction = 'send-email',
  setEdgeFunction
}: EmailTestFormProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium mb-3">Test Email Delivery</h3>
      
      <div className="space-y-3">
        <div>
          <Label htmlFor="testEmail" className="text-sm font-medium">
            Test Email Address
          </Label>
          <Input
            id="testEmail"
            type="email"
            placeholder="your-email@example.com"
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
            className="mt-1 w-full"
          />
          <p className="text-xs text-gray-500 mt-1">
            Enter an email address where you can verify receipt
          </p>
        </div>
        
        <div>
          <Label htmlFor="testPhone" className="text-sm font-medium">
            Test Phone Number (Optional)
          </Label>
          <Input
            id="testPhone"
            type="tel"
            placeholder="+26777123456"
            value={testPhone}
            onChange={(e) => setTestPhone(e.target.value)}
            className="mt-1 w-full"
          />
          <p className="text-xs text-gray-500 mt-1">
            Enter a phone number to test SMS notifications
          </p>
        </div>
        
        {setEdgeFunction && (
          <div>
            <Label htmlFor="edgeFunction" className="text-sm font-medium">
              Edge Function
            </Label>
            <div className="flex gap-2 mt-1">
              <select
                id="edgeFunction"
                value={edgeFunction}
                onChange={(e) => setEdgeFunction(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md"
              >
                <option value="send-email">send-email</option>
                <option value="check-resend-status">check-resend-status</option>
              </select>
            </div>
          </div>
        )}
      </div>
      
      <div className="flex justify-end">
        <Button 
          type="button" 
          onClick={handleTestEmail} 
          disabled={isSending || !testEmail}
        >
          {isSending ? "Sending..." : "Send Test Email"}
        </Button>
      </div>
      
      <div className="text-xs text-gray-500 mt-1 border-t pt-2">
        <p>This will test the full email delivery pipeline:</p>
        <ol className="list-decimal ml-5 space-y-1">
          <li>Frontend to Supabase Edge Function</li>
          <li>Edge Function to Resend API</li>
          <li>Resend API to your inbox</li>
          <li>Email tracking and delivery logs</li>
        </ol>
      </div>
    </div>
  );
};

export default EmailTestForm;
