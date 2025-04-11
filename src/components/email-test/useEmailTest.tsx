
import { useState, useEffect } from 'react';
import { toast } from "sonner";
import { sendEventRegistrationEmail } from '@/lib/emailService';

export const useEmailTest = () => {
  const [isSending, setIsSending] = useState(false);
  const [testEmail, setTestEmail] = useState('');
  const [testPhone, setTestPhone] = useState('+267');
  const [debugInfo, setDebugInfo] = useState<string | null>(null);
  const [emailsSent, setEmailsSent] = useState(0);
  const [resendInfo, setResendInfo] = useState<{checked: boolean, message: string}>({
    checked: false,
    message: "Checking Resend API status..."
  });
  
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
  
  // Check Resend API status on component mount
  useEffect(() => {
    const checkResendStatus = async () => {
      try {
        // Send a test notification to check Resend API status
        const response = await fetch('/api/check-resend-status', {
          method: 'POST'
        }).then(res => res.json());
        
        if (response.success) {
          setResendInfo({
            checked: true,
            message: `Resend API is active. ${response.message || ''}`
          });
        } else {
          setResendInfo({
            checked: true,
            message: `Resend API issue: ${response.message || 'Unknown error'}`
          });
        }
      } catch (error) {
        setResendInfo({
          checked: true,
          message: "Could not check Resend API status. View browser console for details."
        });
        console.error("Error checking Resend API status:", error);
      }
    };
    
    checkResendStatus();
  }, []);
  
  const validateInputs = () => {
    if (!testEmail || !testEmail.includes('@')) {
      toast.error("Please enter a valid email address");
      return false;
    }
    
    if (testPhone && testPhone !== '+267' && !testPhone.startsWith('+')) {
      toast.warning("Phone number should include country code (e.g. +267)");
      // Don't return false, as phone is optional
    }
    
    return true;
  };
  
  const handleTestEmail = async () => {
    if (!validateInputs()) {
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
        // Extract specific error details if available
        let errorMessage = response.message || "Unknown error";
        let errorDetails = "";
        
        // Check for Resend validation errors
        if (response.error && response.error.includes("validation_error")) {
          errorMessage = "Validation error from email provider";
          errorDetails = "The email service reported invalid data. Please check your inputs and try again.";
        }
        
        // Check for Resend API key issues
        if (response.error && response.error.includes("API key")) {
          errorMessage = "API key error";
          errorDetails = "There may be an issue with the Resend API key configuration.";
        }
        
        throw new Error(`${errorMessage}${errorDetails ? ': ' + errorDetails : ''}`);
      }
    } catch (error) {
      console.error("Error sending test email:", error);
      setDebugInfo(error instanceof Error ? error.message : "Unknown error");
      
      // Parse errors from Resend API format
      let errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      
      // Check if error contains Resend API validation error
      if (errorMessage.includes("validation_error")) {
        errorMessage = "Email validation error: The email service reported invalid data. This may be due to format issues with name, email or phone number.";
      }
      
      toast.error("Failed to send test emails", {
        description: errorMessage,
        duration: 6000
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

  return {
    isSending,
    testEmail,
    setTestEmail,
    testPhone,
    setTestPhone,
    debugInfo,
    emailsSent,
    resendInfo,
    handleTestEmail,
    resetCounter
  };
};
