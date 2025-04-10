
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { sendEventRegistrationEmail } from '@/lib/emailService';
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

const EmailTest = () => {
  const [isSending, setIsSending] = useState(false);
  const [testEmail, setTestEmail] = useState('');
  const [testPhone, setTestPhone] = useState('+267');
  const [debugInfo, setDebugInfo] = useState<string | null>(null);
  const [emailsSent, setEmailsSent] = useState(0);
  
  // Load email count from localStorage on component mount
  useEffect(() => {
    const savedCount = localStorage.getItem('emailTestCount');
    if (savedCount) {
      setEmailsSent(parseInt(savedCount, 10));
    }
  }, []);
  
  // Save email count to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('emailTestCount', emailsSent.toString());
  }, [emailsSent]);
  
  const handleTestEmail = async () => {
    if (!testEmail || !testEmail.includes('@')) {
      toast.error("Please enter a valid email address");
      return;
    }
    
    setIsSending(true);
    setDebugInfo(null);
    
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
          phone: testPhone, // Use the phone entered by the user
          role: "Individual",
          denomination: "Test Church",
          numberOfAttendees: 2
        },
        message: "This is a test registration",
        submitDate: new Date().toISOString(),
        registrationType: "Standard"
      };
      
      console.log("Sending test email to:", testEmail);
      console.log("Sending test WhatsApp to:", testPhone);
      
      // Send the test email with enhanced features
      const response = await sendEventRegistrationEmail("Perspectives on the Apostolic", testData);
      
      console.log("Email test response:", response);
      setDebugInfo(JSON.stringify(response, null, 2));
      
      if (response.success) {
        // Increment email count on successful send
        setEmailsSent(prev => prev + 1);
        
        toast.success("Test emails sent successfully!", {
          description: `Check ${testEmail} for the enhanced confirmation with QR codes, calendar integration, and social media sharing options.`,
          duration: 8000
        });
        
        // Show additional notification if WhatsApp was sent
        if (response.data?.whatsappNotificationSent) {
          toast.success("WhatsApp notification prepared!", {
            description: "A WhatsApp message link has been generated for the admin to send.",
            duration: 5000
          });
        }
      } else {
        throw new Error(response.message || "Unknown error");
      }
    } catch (error) {
      console.error("Error sending test email:", error);
      setDebugInfo(error instanceof Error ? error.message : "Unknown error");
      toast.error("Failed to send test emails", {
        description: error instanceof Error ? error.message : "Unknown error occurred",
        duration: 5000
      });
    } finally {
      setIsSending(false);
    }
  };
  
  const resetCounter = () => {
    setEmailsSent(0);
    localStorage.removeItem('emailTestCount');
    toast.info("Email counter has been reset");
  };
  
  return (
    <Card className="p-6 bg-white rounded-lg shadow-md max-w-md mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Enhanced Email Testing Tool</h2>
      
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
          Note: Resend API has rate limits (100-120 emails per day for free tier). 
          If emails are not sending, you may have reached your limit.
        </p>
      </div>
      
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

      {debugInfo && (
        <div className="mt-4 p-3 bg-gray-100 rounded-md">
          <h3 className="font-bold text-sm mb-1">Debug Information:</h3>
          <pre className="text-xs overflow-x-auto whitespace-pre-wrap">{debugInfo}</pre>
        </div>
      )}
      
      <div className="mt-4 text-sm text-gray-500">
        <p>Admin recipients: otenggate@gmail.com, info@gategaborone.com, iblimenterprise@zohomail.com</p>
      </div>
    </Card>
  );
};

export default EmailTest;
