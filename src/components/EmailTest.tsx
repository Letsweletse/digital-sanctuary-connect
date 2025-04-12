
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { sendEventRegistrationEmail } from '@/lib/emailService';
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

const EmailTest = () => {
  const [isSending, setIsSending] = useState(false);
  const [testEmail, setTestEmail] = useState('');
  
  const handleTestEmail = async () => {
    if (!testEmail || !testEmail.includes('@')) {
      toast.error("Please enter a valid email address");
      return;
    }
    
    setIsSending(true);
    toast.info("Sending test email via Mailgun...", { id: "email-sending" });
    
    try {
      // Create comprehensive sample registration data with all enhanced email features
      const testData = {
        event: "Perspectives on the Apostolic",
        eventDate: "2025-05-10",
        eventTime: "9:00 AM - 1:30 PM",
        eventImage: "https://lojchdvtwypjqupsjynf.supabase.co/storage/v1/object/public/images/leadership/POA_1743681812478.jpg",
        location: "https://maps.app.goo.gl/mVLNzv5R2T8wQZNt7", // Gate Gaborone location on Google Maps
        attendee: {
          title: "Mr",
          name: "Test User",
          email: testEmail, // Use the email entered by the user
          phone: "+267 123456789",
          role: "Individual",
          denomination: "Test Church",
          numberOfAttendees: 2
        },
        message: "This is a test registration for email verification",
        submitDate: new Date().toISOString(),
        registrationType: "Standard"
      };
      
      console.log("Sending test email with data:", JSON.stringify(testData, null, 2));
      
      // Send the test email with enhanced features
      const response = await sendEventRegistrationEmail("Perspectives on the Apostolic", testData);
      
      console.log("Email test response:", response);
      
      toast.dismiss("email-sending");
      
      if (response.success) {
        toast.success("Test emails sent successfully via Mailgun!", {
          description: `Check ${testEmail} and your spam folder for the confirmation email.`,
          duration: 8000
        });
      } else {
        throw new Error(response.message || "Unknown error");
      }
    } catch (error) {
      console.error("Error sending test email:", error);
      toast.dismiss("email-sending");
      toast.error("Failed to send test emails", {
        description: error instanceof Error ? error.message : "Unknown error occurred. Check Supabase logs for details.",
        duration: 5000
      });
    } finally {
      setIsSending(false);
    }
  };
  
  return (
    <Card className="p-6 bg-white rounded-lg shadow-md max-w-md mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Email Testing Tool (Mailgun)</h2>
      <p className="mb-4 text-gray-600">
        Enter your email below to receive a test event registration confirmation:
      </p>
      <ul className="list-disc ml-5 mt-2 mb-4 text-gray-600">
        <li>Using Mailgun email service with domain: gategaborone.com</li>
        <li>Higher resolution QR codes for location and check-in</li>
        <li>iCal calendar integration (.ics file)</li>
        <li>WhatsApp sharing option</li>
        <li>Personalized check-in ID</li>
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
          "Send Test Email via Mailgun"
        )}
      </Button>
      <p className="mt-4 text-sm text-gray-500">Domain: gategaborone.com</p>
      <div className="mt-2 text-sm text-gray-500">
        <p>Admin recipients: otenggate@gmail.com, info@gategaborone.com, iblimenterprise@zohomail.com</p>
        <p className="mt-1 text-xs text-amber-600">Note: Check spam folder if emails don't arrive in inbox.</p>
      </div>
    </Card>
  );
};

export default EmailTest;
