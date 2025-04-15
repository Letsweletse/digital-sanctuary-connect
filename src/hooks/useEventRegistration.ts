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

  // Enhanced WhatsApp notification function with detailed error logging
  const sendWhatsAppNotification = async (registrationData: any) => {
    try {
      console.log("🔍 WhatsApp Notification Process Started");
      console.log("📱 Full Registration Data:", JSON.stringify(registrationData, null, 2));

      // Comprehensive phone number validation and formatting
      const rawPhone = registrationData.attendee.phone;
      console.log("🚨 Raw Phone Number:", rawPhone);

      // Remove all non-digit characters except '+'
      const cleanedPhone = rawPhone.replace(/[^\d+]/g, '');
      console.log("🧼 Cleaned Phone Number:", cleanedPhone);

      // Validate phone number format
      const phoneRegex = /^\+\d{10,14}$/; // Adjust regex as needed for your country's format
      if (!phoneRegex.test(cleanedPhone)) {
        console.error("❌ Invalid Phone Number Format:", cleanedPhone);
        
        // Log detailed phone number issues
        console.warn("Phone Number Validation Details:", {
          length: cleanedPhone.length,
          startsWithPlus: cleanedPhone.startsWith('+'),
          containsOnlyDigitsAfterPlus: /^\+\d+$/.test(cleanedPhone)
        });

        sonnerToast.error("WhatsApp Notification Failed", {
          description: "Invalid phone number format. Please check the number.",
          duration: 5000
        });

        return { 
          error: true, 
          message: "Invalid phone number format",
          details: {
            rawPhone,
            cleanedPhone
          }
        };
      }

      const message = `Thank you for registering for ${registrationData.event}! 
Event Date: ${registrationData.eventDate}
Event Time: ${registrationData.eventTime}
Location: ${registrationData.location}

Your registration is confirmed. We look forward to seeing you!`;

      console.log("📨 Prepared WhatsApp Message:", message);

      const requestBody = {
        token: ULTRAMSG_API_KEY,
        to: cleanedPhone,
        body: message
      };

      console.log("🚀 UltraMsg API Request:", {
        url: `https://api.ultramsg.com/${ULTRAMSG_INSTANCE_ID}/messages/chat`,
        method: 'POST',
        body: requestBody
      });

      const response = await fetch(`https://api.ultramsg.com/${ULTRAMSG_INSTANCE_ID}/messages/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      console.log("📋 API Response Status:", {
        status: response.status,
        statusText: response.statusText
      });

      const result = await response.json();
      console.log("🔬 Complete API Response:", JSON.stringify(result, null, 2));

      // Detailed result logging and toast notifications
      if (response.ok) {
        console.log("✅ WhatsApp Notification Sent Successfully");
        sonnerToast.success("WhatsApp Notification", {
          description: "Confirmation message sent to your WhatsApp.",
          duration: 5000
        });
        return result;
      } else {
        console.error("❌ WhatsApp Notification Failed", result);
        sonnerToast.error("WhatsApp Notification Issue", {
          description: "Could not send WhatsApp message. Please try again.",
          duration: 5000
        });
        return { 
          error: true, 
          message: result.error || "Unknown WhatsApp notification error",
          details: result
        };
      }
    } catch (error) {
      console.error("🚨 WhatsApp Notification Exception:", error);
      
      sonnerToast.error("WhatsApp Notification Error", {
        description: "An unexpected error occurred. Please contact support.",
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
      const whatsappResult = await sendWhatsAppNotification(registrationData);
      console.log('WhatsApp notification complete result:', whatsappResult);
      
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
