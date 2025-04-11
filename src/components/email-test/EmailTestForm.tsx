
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
}

const EmailTestForm = ({ 
  testEmail, 
  setTestEmail, 
  testPhone, 
  setTestPhone, 
  handleTestEmail, 
  isSending 
}: EmailTestFormProps) => {
  return (
    <>
      <p className="mb-4 text-gray-600">
        Enter your email and phone below to receive a test event registration confirmation with enhanced features:
      </p>
      <ul className="list-disc ml-5 mt-2 mb-4 text-gray-600">
        <li>Gate Gaborone logo in the header</li>
        <li>Higher resolution QR codes for location and check-in</li>
        <li>iCal calendar integration (.ics file)</li>
        <li>Multiple social media sharing options (WhatsApp, Facebook, Twitter, LinkedIn, Email)</li>
        <li>Gate Gaborone social media follow links</li>
        <li>Personalized check-in ID</li>
        <li>WhatsApp notification (if phone number provided)</li>
      </ul>
      
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
      
      <div className="mb-4">
        <Label htmlFor="testPhone">Your WhatsApp Number</Label>
        <Input 
          id="testPhone" 
          type="tel" 
          value={testPhone} 
          onChange={(e) => setTestPhone(e.target.value)} 
          placeholder="e.g. +267 71234567"
          className="mt-1"
        />
        <p className="text-xs text-gray-500 mt-1">
          Include country code (e.g. +267 for Botswana)
        </p>
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
            Sending Enhanced Test Email...
          </span>
        ) : (
          "Send Enhanced Test Email & WhatsApp"
        )}
      </Button>
    </>
  );
};

export default EmailTestForm;
