
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

  // Direct WhatsApp notification without edge function
  const sendWhatsAppNotification = async (registrationData: any) => {
    try {
      const phone = registrationData.attendee.phone.replace(/\s+/g, ''); // Remove spaces from phone number
      const message = `Thank you for registering for ${registrationData.event}! 
Event Date: ${registrationData.eventDate}
Event Time: ${registrationData.eventTime}
Location: ${registrationData.location}

Your registration is confirmed. We look forward to seeing you!`;

      // Direct API call to UltraMsg
      const response = await fetch(`https://api.ultramsg.com/${ULTRAMSG_INSTANCE_ID}/messages/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: ULTRAMSG_API_KEY,
          to: phone,
          body: message
        })
      });

      const result = await response.json();
      console.log('WhatsApp notification sent directly:', result);
      return result;
    } catch (error) {
      console.error('Failed to send WhatsApp notification:', error);
      return { error: true, message: error instanceof Error ? error.message : 'Unknown error' };
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
          phone: `${formData.countryCode}${formData.phone}` // Format phone with country code, removing spaces
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
      console.log('WhatsApp notification result:', whatsappResult);
      
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
