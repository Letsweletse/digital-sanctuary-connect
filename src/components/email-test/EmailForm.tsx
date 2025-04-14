
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface EmailFormProps {
  testEmail: string;
  setTestEmail: (email: string) => void;
  handleTestEmail: () => void;
  isSending: boolean;
}

const EmailForm: React.FC<EmailFormProps> = ({ 
  testEmail, 
  setTestEmail, 
  handleTestEmail, 
  isSending 
}) => {
  return (
    <>
      <div className="mb-4">
        <Label htmlFor="testEmail">Your Email</Label>
        <Input 
          id="testEmail" 
          type="email" 
          value={testEmail} 
          onChange={(e) => setTestEmail(e.target.value)} 
          placeholder="Enter your email"
          className="mt-1"
        />
      </div>
      
      <Button 
        onClick={handleTestEmail} 
        disabled={isSending}
        className="w-full bg-church-blue hover:bg-church-blue-dark"
      >
        {isSending ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Sending Test Email...
          </span>
        ) : (
          "Send Test Email"
        )}
      </Button>
    </>
  );
};

export default EmailForm;
