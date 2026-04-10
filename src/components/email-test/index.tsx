
import React, { useState } from 'react';
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { sendEventRegistrationEmail } from '@/lib/emailService';
import EmailForm from './EmailForm';
import SocialShareButtons from './SocialShareButtons';
import EmailFeaturesList from './EmailFeaturesList';
import { createShareLinks } from './shareUtils';
import { TestEmailData } from './types';

const EmailTest = () => {
  const [isSending, setIsSending] = useState(false);
  const [testEmail, setTestEmail] = useState('');
  const [lastSentId, setLastSentId] = useState('');
  
  // Constants for event details
  const eventName = "The Apostolic Conference 2025";
  const eventDate = "2025-05-24";
  const eventTime = "9:00 AM - 3:00 PM";
  
  const handleTestEmail = async () => {
    if (!testEmail || !testEmail.includes('@')) {
      toast.error("Please enter a valid email address");
      return;
    }
    
    setIsSending(true);
    
    try {
      console.log("Starting test email process");
      
      // Create comprehensive sample registration data with all enhanced email features
      const testData: TestEmailData = {
        event: eventName,
        eventDate: eventDate,
        eventTime: eventTime,
        eventImage: "https://lojchdvtwypjqupsjynf.supabase.co/storage/v1/object/public/images/leadership/Malawi%20Conference_1744623783611.jpeg",
        location: "https://www.google.com/maps/place/Gate+Gaborone/@-24.6618569,25.9048205,15z/data=!4m6!3m5!1s0x1ebf843b05f7aa07:0x2de14938d5996b9e!8m2!3d-24.6618567!4d25.9048083!16s%2Fg%2F11hbgk5nv2",
        attendee: {
          title: "Mr",
          name: "Test User",
          email: testEmail,
          phone: "+267 123456789",
          role: "Individual",
          denomination: "Test Church",
          numberOfAttendees: 2
        },
        message: "This is a test registration",
        submitDate: new Date().toISOString(),
        registrationType: "Standard",
        churchLogo: "https://lojchdvtwypjqupsjynf.supabase.co/storage/v1/object/public/images/general/gate-logo.png"
      };
      
      console.log("Test data prepared:", testData);
      
      // Send the test email with enhanced features
      const response = await sendEventRegistrationEmail("Perspectives on the Apostolic", testData);
      
      console.log("Email test response:", response);
      
      if (response.success) {
        // Store the check-in ID for WhatsApp sharing
        if (response.data && response.data.checkInId) {
          setLastSentId(response.data.checkInId);
        }
        
        toast.success("Test emails sent successfully!", {
          description: `Check ${testEmail} for the enhanced confirmation with QR codes, calendar integration, and social media sharing options.`,
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
  
  const handleShareToWhatsApp = () => {
    const shareLinks = createShareLinks(eventName, eventDate, eventTime, lastSentId);
    window.open(shareLinks.whatsapp, '_blank');
    
    toast.success("Opening WhatsApp sharing", {
      description: "Share the event details with your contacts via WhatsApp",
      duration: 3000
    });
  };
  
  const handleShareToSocial = (platform: string) => {
    const shareLinks = createShareLinks(eventName, eventDate, eventTime);
    const shareLink = shareLinks[platform as keyof typeof shareLinks] || shareLinks.whatsapp;
    
    window.open(shareLink, '_blank');
    
    toast.success(`Opening ${platform} sharing`, {
      description: `Share the event details with your contacts via ${platform}`,
      duration: 3000
    });
  };
  
  return (
    <Card className="p-6 bg-white rounded-lg shadow-md max-w-md mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Gate Gaborone Email Testing Tool</h2>
      
      <EmailFeaturesList />
      
      <EmailForm 
        testEmail={testEmail}
        setTestEmail={setTestEmail}
        handleTestEmail={handleTestEmail}
        isSending={isSending}
      />
      
      <SocialShareButtons 
        lastSentId={lastSentId}
        handleShareToWhatsApp={handleShareToWhatsApp}
        handleShareToSocial={handleShareToSocial}
      />
      
      <div className="mt-4 text-sm text-gray-500">
        <p>Admin recipients: otenggate@gmail.com, info@gategaborone.co.bw, blimenterprise@zohomail.com</p>
      </div>
    </Card>
  );
};

export default EmailTest;
