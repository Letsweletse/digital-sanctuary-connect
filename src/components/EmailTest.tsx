
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { sendEventRegistrationEmail } from '@/lib/emailService';
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Share2, Facebook, Twitter, Linkedin, Mail, Instagram } from "lucide-react";

const EmailTest = () => {
  const [isSending, setIsSending] = useState(false);
  const [testEmail, setTestEmail] = useState('');
  const [lastSentId, setLastSentId] = useState('');
  
  const handleTestEmail = async () => {
    if (!testEmail || !testEmail.includes('@')) {
      toast.error("Please enter a valid email address");
      return;
    }
    
    setIsSending(true);
    
    try {
      console.log("Starting test email process");
      
      // Create comprehensive sample registration data with all enhanced email features
      const testData = {
        event: "The Apostolic Conference 2025",
        eventDate: "2025-05-24",
        eventTime: "9:00 AM - 3:00 PM",
        eventImage: "https://lojchdvtwypjqupsjynf.supabase.co/storage/v1/object/public/images/leadership/Malawi%20Conference_1744623783611.jpeg",
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
        message: "This is a test registration",
        submitDate: new Date().toISOString(),
        registrationType: "Standard"
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
    const eventName = "The Apostolic Conference 2025";
    const eventDate = "2025-05-24 to 2025-05-26";
    const eventTime = "9:00 AM - 3:00 PM";
    
    // Create WhatsApp sharing text with event details and check-in ID if available
    const shareText = lastSentId 
      ? `I just registered for ${eventName} at Capital City Baptist Hall on ${eventDate} at ${eventTime}. Join me! My check-in ID is: ${lastSentId}. To register call: 0993181830 or 0993749297`
      : `Join me at ${eventName} at Capital City Baptist Hall on ${eventDate} at ${eventTime}. To register call: 0993181830 or 0993749297`;
    
    // Create WhatsApp sharing URL
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    
    // Open WhatsApp in a new tab
    window.open(whatsappUrl, '_blank');
    
    toast.success("Opening WhatsApp sharing", {
      description: "Share the event details with your contacts via WhatsApp",
      duration: 3000
    });
  };
  
  const handleShareToSocial = (platform: string) => {
    const eventName = "The Apostolic Conference 2025";
    const eventDate = "2025-05-24 to 2025-05-26";
    const eventTime = "9:00 AM - 3:00 PM";
    const shareText = `Join me at ${eventName} at Capital City Baptist Hall on ${eventDate} at ${eventTime}. Theme: "The Times of Refreshing" (Acts 3:19).`;
    const shareUrl = "https://gategaborone.com/events";
    
    let shareLink = "";
    
    switch(platform) {
      case 'facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
        break;
      case 'twitter':
        shareLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText + " " + shareUrl)}`;
        break;
      case 'linkedin':
        shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&summary=${encodeURIComponent(shareText)}`;
        break;
      case 'email':
        shareLink = `mailto:?subject=${encodeURIComponent(eventName)}&body=${encodeURIComponent(shareText + "\n\nRegister by calling: 0993181830 or 0993749297")}`;
        break;
      default:
        shareLink = `https://wa.me/?text=${encodeURIComponent(shareText + " To register call: 0993181830 or 0993749297")}`;
    }
    
    window.open(shareLink, '_blank');
    
    toast.success(`Opening ${platform} sharing`, {
      description: `Share the event details with your contacts via ${platform}`,
      duration: 3000
    });
  };
  
  return (
    <Card className="p-6 bg-white rounded-lg shadow-md max-w-md mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Enhanced Email Testing Tool</h2>
      <p className="mb-4 text-gray-600">
        Enter your email below to receive a test event registration confirmation with enhanced features:
      </p>
      <ul className="list-disc ml-5 mt-2 mb-4 text-gray-600">
        <li>Gate Gaborone logo in the header</li>
        <li>Higher resolution QR codes for location and check-in</li>
        <li>iCal calendar integration (.ics file)</li>
        <li>Multiple social media sharing options (WhatsApp, Facebook, Twitter, LinkedIn, Email)</li>
        <li>Gate Gaborone social media follow links</li>
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
            Sending Enhanced Test Email...
          </span>
        ) : (
          "Send Enhanced Test Email"
        )}
      </Button>
      
      {lastSentId && (
        <div className="mt-4">
          <h3 className="font-bold text-lg mb-2">Share Event:</h3>
          <div className="grid grid-cols-3 gap-2 mb-4">
            <Button 
              onClick={handleShareToWhatsApp}
              className="bg-green-600 hover:bg-green-700 flex items-center justify-center gap-1"
            >
              <Share2 size={16} />
              WhatsApp
            </Button>
            <Button 
              onClick={() => handleShareToSocial('facebook')}
              className="bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-1"
            >
              <Facebook size={16} />
              Facebook
            </Button>
            <Button 
              onClick={() => handleShareToSocial('twitter')}
              className="bg-black hover:bg-gray-800 flex items-center justify-center gap-1"
            >
              <Twitter size={16} />
              Twitter
            </Button>
            <Button 
              onClick={() => handleShareToSocial('linkedin')}
              className="bg-blue-800 hover:bg-blue-900 flex items-center justify-center gap-1"
            >
              <Linkedin size={16} />
              LinkedIn
            </Button>
            <Button 
              onClick={() => handleShareToSocial('instagram')}
              className="bg-pink-600 hover:bg-pink-700 flex items-center justify-center gap-1"
            >
              <Instagram size={16} />
              Instagram
            </Button>
            <Button 
              onClick={() => handleShareToSocial('email')}
              className="bg-gray-600 hover:bg-gray-700 flex items-center justify-center gap-1"
            >
              <Mail size={16} />
              Email
            </Button>
          </div>
        </div>
      )}
      
      <div className="mt-4 text-sm text-gray-500">
        <p>Admin recipients: otenggate@gmail.com, info@gategaborone.com, iblimenterprise@zohomail.com</p>
      </div>
    </Card>
  );
};

export default EmailTest;
