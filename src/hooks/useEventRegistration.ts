import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { toast as sonnerToast } from "sonner";
import { EventData, RegistrationFormData } from '@/types/eventTypes';
import { sendEventRegistrationEmail } from '@/lib/emailService';
import { formatDate } from '@/utils/dateUtils';

// UltraMsg API credentials
const ULTRAMSG_API_KEY = "m9uo38p34k0e2jc1";
const ULTRAMSG_INSTANCE_ID = "instance53888";

export const useEventRegistration = () => {
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<EventData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<RegistrationFormData>({
    title: 'Mr',
    name: '',
    email: '',
    countryCode: '+267', // Default to Botswana code
    phone: '',
    role: 'Individual',
    denomination: '',
    numberOfAttendees: 1
  });
  
  const handleOpenRegistration = (event: EventData) => {
    setCurrentEvent(event);
    setIsRegistrationOpen(true);
    // Show a toast notification for better UX
    sonnerToast("Registration Form Opened", {
      description: `You're registering for ${event.title}`,
      duration: 3000
    });
  };

  const handleCloseRegistration = () => {
    setIsRegistrationOpen(false);
    setCurrentEvent(null);
    resetFormData();
  };
  
  const resetFormData = () => {
    setFormData({
      title: 'Mr',
      name: '',
      email: '',
      countryCode: '+267', // Reset to default Botswana code
      phone: '',
      role: 'Individual',
      denomination: '',
      numberOfAttendees: 1
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'numberOfAttendees' ? parseInt(value) || 1 : value
    }));
  };

  // Enhanced WhatsApp notification function with more detailed error logging and debugging
  const sendWhatsAppNotification = async (registrationData: any) => {
    try {
      console.log("🔍 [WhatsApp] Notification Process Started");
      console.log("📱 [WhatsApp] Registration Data:", JSON.stringify(registrationData, null, 2));

      // Phone number validation and formatting with more detailed logging
      let rawPhone = registrationData.attendee.phone;
      console.log("🚨 [WhatsApp] Raw Phone Number:", rawPhone);

      // Ensure phone has country code
      if (!rawPhone.startsWith('+')) {
        console.warn("[WhatsApp] Phone missing country code, attempting to add default +267");
        rawPhone = `+267${rawPhone}`;
      }

      // Remove any spaces, dashes, or parentheses
      const cleanedPhone = rawPhone.replace(/[\s\-()]/g, '');
      console.log("🧼 [WhatsApp] Cleaned Phone Number:", cleanedPhone);

      // Validate phone number format (must start with + and have at least 10 digits after)
      const phoneRegex = /^\+\d{10,15}$/;
      if (!phoneRegex.test(cleanedPhone)) {
        console.error("❌ [WhatsApp] Invalid Phone Number Format:", cleanedPhone);
        
        // Detailed phone validation logging
        console.warn("[WhatsApp] Phone Validation Details:", {
          length: cleanedPhone.length,
          startsWithPlus: cleanedPhone.startsWith('+'),
          containsOnlyDigitsAfterPlus: /^\+\d+$/.test(cleanedPhone),
          originalInput: rawPhone
        });

        sonnerToast.error("WhatsApp Notification Failed", {
          description: "Invalid phone number format. Please check your number.",
          duration: 5000
        });

        return { 
          error: true, 
          message: "Invalid phone number format",
          details: { rawPhone, cleanedPhone }
        };
      }

      // Construct a message with all event details
      const message = `Thank you for registering for ${registrationData.event}! 
Event Date: ${registrationData.eventDate}
Event Time: ${registrationData.eventTime}
Location: ${registrationData.location}

Your registration is confirmed. We look forward to seeing you!`;

      console.log("📨 [WhatsApp] Prepared Message:", message);

      // Set up specific request data for UltraMsg API call
      const requestBody = {
        token: ULTRAMSG_API_KEY,
        to: cleanedPhone,
        body: message
      };

      console.log("🚀 [WhatsApp] API Request Details:", {
        url: `https://api.ultramsg.com/${ULTRAMSG_INSTANCE_ID}/messages/chat`,
        method: 'POST',
        token: ULTRAMSG_API_KEY.substring(0, 4) + "..." + ULTRAMSG_API_KEY.substring(ULTRAMSG_API_KEY.length - 4),
        instanceId: ULTRAMSG_INSTANCE_ID,
        phone: cleanedPhone
      });

      // Make the API call with proper error handling
      const response = await fetch(`https://api.ultramsg.com/${ULTRAMSG_INSTANCE_ID}/messages/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      console.log("📋 [WhatsApp] API Response Status:", {
        status: response.status,
        statusText: response.statusText
      });

      // Get the complete API response for debugging
      const result = await response.json();
      console.log("🔬 [WhatsApp] Complete API Response:", JSON.stringify(result, null, 2));

      // Process the result and show appropriate notifications
      if (response.ok && !result.error) {
        console.log("✅ [WhatsApp] Notification Sent Successfully");
        console.log("[WhatsApp] Message ID:", result.message_id || "Not provided");
        
        sonnerToast.success("WhatsApp Notification", {
          description: "Confirmation message sent to your WhatsApp.",
          duration: 5000
        });
        return result;
      } else {
        console.error("❌ [WhatsApp] API Error Response:", result);
        console.error("[WhatsApp] Error Details:", result.error || "Unknown API error");
        
        sonnerToast.error("WhatsApp Notification Issue", {
          description: "Could not send WhatsApp message. Please check phone number format.",
          duration: 5000
        });
        return { 
          error: true, 
          message: result.error || "Unknown WhatsApp notification error",
          details: result
        };
      }
    } catch (error) {
      console.error("🚨 [WhatsApp] Exception Occurred:", error);
      console.error("[WhatsApp] Stack Trace:", error instanceof Error ? error.stack : "No stack trace");
      
      sonnerToast.error("WhatsApp Notification Error", {
        description: "Technical error sending message. Please contact support.",
        duration: 5000
      });

      return { 
        error: true, 
        message: error instanceof Error ? error.message : "Unknown error",
        details: error
      };
    }
  };

  const handleSubmitRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Form validation
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Please enter your name.",
        variant: "destructive",
      });
      return;
    }
    
    if (!formData.email.trim() || !formData.email.includes('@')) {
      toast({
        title: "Error",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }
    
    if (!formData.phone.trim()) {
      toast({
        title: "Error",
        description: "Please enter your phone number.",
        variant: "destructive",
      });
      return;
    }
    
    if (!currentEvent) {
      toast({
        title: "Error",
        description: "No event selected for registration.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);

    try {
      // Prepare comprehensive registration data with all required fields for enhanced email
      const registrationData = {
        event: currentEvent.title,
        eventDate: formatDate(currentEvent.date),
        eventTime: currentEvent.time,
        eventImage: currentEvent.image, // Include event image for the confirmation email
        location: currentEvent.location.includes('http') 
          ? currentEvent.location 
          : 'https://maps.app.goo.gl/mVLNzv5R2T8wQZNt7', // Use location URL or default to Gate Gaborone location
        attendee: {
          ...formData,
          phone: `${formData.countryCode}${formData.phone.trim()}` // Ensure country code is applied and remove spaces
        },
        message: `Title: ${formData.title}, Role: ${formData.role}, Denomination: ${formData.denomination}, Number of Attendees: ${formData.numberOfAttendees}`,
        submitDate: new Date().toISOString(),
        registrationType: 'Standard' // Can be customized if needed
      };

      console.log('Registration submitted with enhanced email data:', registrationData);
      
      // Send the email notification with enhanced features
      const emailResult = await sendEventRegistrationEmail(currentEvent.title, registrationData);
      console.log('Enhanced email service response:', emailResult);
      
      if (!emailResult.success) {
        throw new Error(emailResult.message || "Failed to send registration email");
      }
      
      // Send WhatsApp notification directly after successful registration
      console.log('[Registration] Attempting WhatsApp notification...');
      const whatsappResult = await sendWhatsAppNotification(registrationData);
      console.log('[Registration] WhatsApp notification result:', whatsappResult);
      
      // More detailed success/error handling for WhatsApp
      if (whatsappResult && !whatsappResult.error) {
        console.log("[Registration] WhatsApp notification sent successfully");
        console.log("[Registration] WhatsApp message ID:", whatsappResult.message_id || "Not provided");
        
        sonnerToast.success("WhatsApp Notification Sent", {
          description: "A confirmation message has been sent to your WhatsApp number.",
          duration: 5000
        });
      } else {
        console.warn("[Registration] WhatsApp notification failed:", whatsappResult?.message || "Unknown error");
        console.warn("[Registration] WhatsApp error details:", whatsappResult?.details || {});
        
        sonnerToast.error("WhatsApp Notification Issue", {
          description: "There was a problem sending the WhatsApp confirmation. Please verify your phone number format.",
          duration: 5000
        });
      }
      
      // Show detailed success or error message
      if (whatsappResult && !whatsappResult.error) {
        console.log("WhatsApp notification sent successfully");
        sonnerToast.success("WhatsApp Notification Sent", {
          description: "A confirmation message has been sent to your WhatsApp number.",
          duration: 5000
        });
      } else {
        console.warn("WhatsApp notification failed or returned an error");
        sonnerToast.error("WhatsApp Notification Issue", {
          description: "There was a problem sending the WhatsApp confirmation. Please check your phone number.",
          duration: 5000
        });
      }
      
      // Show success message using both toasts for better visibility
      toast({
        title: "Registration Successful!",
        description: `Thank you for registering for ${currentEvent.title}. A confirmation email with calendar integration, QR codes, and sharing options has been sent to ${formData.email}.`,
      });
      
      sonnerToast.success("Registration Complete!", {
        description: "Check your email for confirmation with QR codes and calendar link.",
        duration: 5000
      });
      
      handleCloseRegistration();
    } catch (error) {
      console.error("Error submitting registration:", error);
      toast({
        title: "Registration Failed",
        description: error instanceof Error ? error.message : "There was an error submitting your registration. Please try again.",
        variant: "destructive",
      });
      
      sonnerToast.error("Registration Failed", {
        description: "There was a problem processing your registration. Please try again or contact support.",
        duration: 5000
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return {
    isRegistrationOpen,
    currentEvent,
    formData,
    isSubmitting,
    handleOpenRegistration,
    handleCloseRegistration,
    handleInputChange,
    handleSubmitRegistration
  };
};
