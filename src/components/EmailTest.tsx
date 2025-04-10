
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { sendEventRegistrationEmail } from '@/lib/emailService';
import { toast } from "sonner";

const EmailTest = () => {
  const [isSending, setIsSending] = useState(false);
  
  const handleTestEmail = async () => {
    setIsSending(true);
    
    try {
      // Create sample registration data with enhanced event details
      const testData = {
        event: "Perspectives on the Apostolic",
        eventDate: "2025-05-10",
        eventTime: "9:00 AM - 1:30 PM",
        eventImage: "https://lojchdvtwypjqupsjynf.supabase.co/storage/v1/object/public/images/leadership/POA_1743681812478.jpg",
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
        submitDate: new Date().toISOString(),
        location: "https://maps.app.goo.gl/mVLNzv5R2T8wQZNt7" // Gate Gaborone location on Google Maps
      };
      
      // Send the test email with enhanced features
      const response = await sendEventRegistrationEmail("Perspectives on the Apostolic", testData);
      
      console.log("Email test response:", response);
      
      if (response.success) {
        toast.success("Test emails sent successfully!", {
          description: "Check your admin email and the test recipient inbox for the enhanced confirmation with QR codes, calendar integration, and WhatsApp sharing.",
          duration: 8000
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
      <h2 className="text-2xl font-bold mb-4">Enhanced Email Testing Tool</h2>
      <p className="mb-4 text-gray-600">
        Click the button below to send a test event registration email with these enhanced features:
      </p>
      <ul className="list-disc ml-5 mt-2 mb-4 text-gray-600">
        <li>QR code for location (Google Maps)</li>
        <li>QR code for personalized check-in</li>
        <li>iCal calendar integration (.ics file)</li>
        <li>WhatsApp sharing with detailed event info</li>
        <li>Personalized check-in ID</li>
      </ul>
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
          "Send Enhanced Test Email"
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
