
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { toast as sonnerToast } from "sonner";
import { EventData, RegistrationFormData } from '@/types/eventTypes';
import { sendEventRegistrationEmail } from '@/lib/emailService';
import { formatDate } from '@/utils/dateUtils';
import { supabase } from '@/integrations/supabase/client';

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

  const sendWhatsAppNotification = async (registrationData: any) => {
    try {
      const phone = registrationData.attendee.phone;
      const message = `Thank you for registering for ${registrationData.event}! 
Event Date: ${registrationData.eventDate}
Event Time: ${registrationData.eventTime}
Location: ${registrationData.location}

Your registration is confirmed. We look forward to seeing you!`;

      const response = await supabase.functions.invoke('send-whatsapp', {
        body: JSON.stringify({ phone, message })
      });

      console.log('WhatsApp notification result:', response);
    } catch (error) {
      console.error('Failed to send WhatsApp notification:', error);
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
          phone: `${formData.countryCode} ${formData.phone}` // Format phone with country code
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
      
      // Send WhatsApp notification after successful registration
      await sendWhatsAppNotification(registrationData);
      
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
