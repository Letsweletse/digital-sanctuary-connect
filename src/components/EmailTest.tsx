
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { sendEventRegistrationEmail } from '@/lib/emailService';
import { toast } from "sonner";

const EmailTest = () => {
  const [isSending, setIsSending] = useState(false);
  
  const handleTestEmail = async () => {
    setIsSending(true);
    
    try {
      // Create sample registration data
      const testData = {
        event: "Test Event",
        eventDate: "2025-04-10",
        eventTime: "10:00 AM",
        attendee: {
          title: "Mr",
          name: "Test User",
          email: "test@example.com", // Replace with your actual email to receive the test
          phone: "+267 123456789",
          role: "Individual",
          denomination: "Test Church",
          numberOfAttendees: 2
        },
        message: "This is a test registration",
        submitDate: new Date().toISOString()
      };
      
      // Send the test email
      const response = await sendEventRegistrationEmail("Test Event", testData);
      
      console.log("Email test response:", response);
      
      if (response.success) {
        toast.success("Test emails sent successfully!", {
          description: "Check your admin email and the test recipient inbox.",
          duration: 5000
        });
      } else {
        throw new Error(response.message || "Unknown error");
      }
    } catch (error) {
      console.error("Error sending test email:", error);
      toast.error("Failed to send test emails", {
        description: error instanceof Error ? error.message : "Unknown error occurred",
        duration: 5000
      });
    } finally {
      setIsSending(false);
    }
  };
  
  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-md mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Email Testing Tool</h2>
      <p className="mb-4 text-gray-600">
        Click the button below to send a test event registration email to admin accounts
        and a confirmation email to the test recipient.
      </p>
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
      <div className="mt-4 text-sm text-gray-500">
        <p>Admin recipients: otenggate@gmail.com, info@gategaborone.com, iblimenterprise@zohomail.com</p>
        <p className="mt-1">Test recipient: test@example.com (change in code to your email)</p>
      </div>
    </div>
  );
};

export default EmailTest;
