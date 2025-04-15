
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { toast as sonnerToast } from "sonner";
import { EventData, RegistrationFormData } from '@/types/eventTypes';
import { sendEventRegistrationEmail } from '@/lib/emailService';
import { formatDate } from '@/utils/dateUtils';
import { useWhatsAppNotification } from './useWhatsAppNotification';
import { useNavigate } from 'react-router-dom';
import { sendDirectWhatsAppMessage, generatePremiumWhatsAppConfirmation } from '@/utils/whatsAppUtils';

export const useRegistrationSubmission = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { sendWhatsAppNotification } = useWhatsAppNotification();
  const navigate = useNavigate();
  
  const validateForm = (formData: RegistrationFormData): { isValid: boolean; errorMessage?: string } => {
    if (!formData.name.trim()) {
      return { isValid: false, errorMessage: "Please enter your name." };
    }
    
    if (!formData.email.trim() || !formData.email.includes('@')) {
      return { isValid: false, errorMessage: "Please enter a valid email address." };
    }
    
    if (!formData.phone.trim()) {
      return { isValid: false, errorMessage: "Please enter your phone number." };
    }
    
    return { isValid: true };
  };
  
  const handleSubmitRegistration = async (
    e: React.FormEvent, 
    formData: RegistrationFormData, 
    currentEvent: EventData | null,
    onSuccess: () => void
  ) => {
    e.preventDefault();
    
    // Validate event existence
    if (!currentEvent) {
      toast({
        title: "Error",
        description: "No event selected for registration.",
        variant: "destructive",
      });
      return;
    }
    
    // Validate form data
    const validation = validateForm(formData);
    if (!validation.isValid) {
      toast({
        title: "Error",
        description: validation.errorMessage,
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);

    try {
      // Prepare comprehensive registration data with all needed details
      const registrationData = {
        event: {
          ...currentEvent,
          date: formatDate(currentEvent.date),
          time: currentEvent.time,
          location: currentEvent.location.includes('http') 
            ? currentEvent.location 
            : 'https://maps.app.goo.gl/mVLNzv5R2T8wQZNt7',
          id: currentEvent.id,
          title: currentEvent.title,
          image: currentEvent.image
        },
        attendee: {
          ...formData,
          phone: `${formData.countryCode}${formData.phone.trim()}`
        },
        message: `Title: ${formData.title}, Role: ${formData.role}, Denomination: ${formData.denomination}, Number of Attendees: ${formData.numberOfAttendees}`,
        submitDate: new Date().toISOString(),
        registrationType: 'Standard'
      };

      console.log('Registration submitted with enhanced data:', registrationData);
      
      // Format data for email service
      const emailRegistrationData = {
        event: currentEvent.title,
        eventDate: formatDate(currentEvent.date),
        eventTime: currentEvent.time,
        eventImage: currentEvent.image,
        location: registrationData.event.location,
        attendee: registrationData.attendee,
        message: registrationData.message,
        submitDate: registrationData.submitDate,
        registrationType: registrationData.registrationType
      };
      
      // Send email
      const emailResult = await sendEventRegistrationEmail(currentEvent.title, emailRegistrationData);
      console.log('Enhanced email service response:', emailResult);
      
      if (!emailResult.success) {
        console.error("Failed to send registration email:", emailResult.message);
        // Continue anyway as WhatsApp might still work
      }
      
      // Generate premium formatted WhatsApp message
      const premiumWhatsAppMessage = generatePremiumWhatsAppConfirmation(registrationData);
      
      // Send direct WhatsApp notification with premium formatted message - NOW USING DIRECT ULTRAMSG API
      console.log('[Registration] Sending premium WhatsApp message to:', registrationData.attendee.phone);
      const directWhatsAppResult = await sendDirectWhatsAppMessage(
        registrationData.attendee.phone, 
        premiumWhatsAppMessage
      );
      
      console.log('[Registration] Premium WhatsApp result:', directWhatsAppResult);
      
      // Only attempt Edge function as a fallback if direct method fails
      if (directWhatsAppResult.error) {
        console.log('[Registration] Direct WhatsApp failed, attempting via Edge Function...');
        const whatsappResult = await sendWhatsAppNotification(registrationData);
        console.log('[Registration] WhatsApp notification result:', whatsappResult);
      }
      
      toast({
        title: "Registration Successful!",
        description: `Thank you for registering for ${currentEvent.title}. A confirmation has been sent to your WhatsApp and email (${formData.email}).`,
      });
      
      sonnerToast.success("Registration Complete!", {
        description: "Check your WhatsApp for a confirmation message",
        duration: 5000
      });
      
      // Close the registration dialog
      onSuccess();
      
      // Navigate to the confirmation page with registration data
      navigate('/registration-confirmation', { state: { registrationData }});
      
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
    isSubmitting,
    handleSubmitRegistration
  };
};
