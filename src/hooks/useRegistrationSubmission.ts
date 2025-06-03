
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { toast as sonnerToast } from "sonner";
import { EventData, RegistrationFormData, RegistrationData } from '@/types/eventTypes';
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
    
    // Show initial loading toast
    sonnerToast.loading("Processing Registration...", {
      description: "Please wait while we process your registration",
      duration: 2000
    });

    try {
      // Prepare comprehensive registration data with all needed details
      const registrationData: RegistrationData = {
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

      console.log('🚀 [Registration] Starting registration process for:', registrationData);
      
      // Show email sending progress
      sonnerToast.loading("Sending Email Confirmation...", {
        description: "Sending confirmation emails to admin and attendee",
        duration: 3000
      });
      
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
      console.log('📧 [Registration] Sending email via email service...');
      const emailResult = await sendEventRegistrationEmail(currentEvent.title, emailRegistrationData);
      console.log('📧 [Registration] Email service response:', emailResult);
      
      if (!emailResult.success) {
        throw new Error(`Email failed: ${emailResult.message}`);
      }
      
      // Save the check-in URL and ID from the email response
      let checkInUrl = '';
      let checkInId = '';
      
      if (emailResult.success && emailResult.data) {
        checkInId = emailResult.data.checkInId || '';
        checkInUrl = emailResult.data.checkInUrl || `https://gategaborone.com/check-in/${checkInId}`;
        
        // Store this information in the registration data for confirmation page
        registrationData.checkInId = checkInId;
        registrationData.checkInUrl = checkInUrl;
        
        console.log('✅ [Registration] Check-in information received:', { checkInId, checkInUrl });
      }
      
      // Show WhatsApp sending progress
      sonnerToast.loading("Sending WhatsApp Confirmation...", {
        description: "Sending WhatsApp confirmation message",
        duration: 3000
      });
      
      // Generate premium formatted WhatsApp message
      const premiumWhatsAppMessage = generatePremiumWhatsAppConfirmation(registrationData);
      
      // Send direct WhatsApp notification with premium formatted message
      console.log('📱 [Registration] Sending premium WhatsApp message to:', registrationData.attendee.phone);
      const directWhatsAppResult = await sendDirectWhatsAppMessage(
        registrationData.attendee.phone, 
        premiumWhatsAppMessage
      );
      
      console.log('📱 [Registration] Premium WhatsApp result:', directWhatsAppResult);
      
      // Only attempt Edge function as a fallback if direct method fails
      if (directWhatsAppResult.error) {
        console.log('📱 [Registration] Direct WhatsApp failed, attempting via Edge Function...');
        const whatsappResult = await sendWhatsAppNotification(registrationData);
        console.log('📱 [Registration] WhatsApp notification result:', whatsappResult);
      }
      
      // Success notifications
      toast({
        title: "Registration Successful! 🎉",
        description: `Thank you for registering for ${currentEvent.title}. Confirmation sent to your WhatsApp and email.`,
      });
      
      sonnerToast.success("Registration Complete!", {
        description: "Check your WhatsApp and email for confirmation details",
        duration: 5000
      });
      
      console.log('✅ [Registration] Registration completed successfully');
      
      // Close the registration dialog
      onSuccess();
      
      // Navigate to the confirmation page with registration data, including check-in information
      navigate('/registration-confirmation', { 
        state: { 
          registrationData,
          checkInUrl,
          checkInId 
        }
      });
      
    } catch (error) {
      console.error("❌ [Registration] Error submitting registration:", error);
      
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
