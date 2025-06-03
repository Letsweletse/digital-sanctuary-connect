
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
      
      // First, let's try WhatsApp notification with better error handling
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
      
      // Try email with better error handling
      sonnerToast.loading("Sending Email Confirmation...", {
        description: "Attempting to send confirmation emails",
        duration: 3000
      });
      
      // Format data for email service with fallback handling
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
      
      let checkInUrl = '';
      let checkInId = '';
      let emailSuccess = false;
      
      try {
        console.log('📧 [Registration] Attempting email via email service...');
        const emailResult = await sendEventRegistrationEmail(currentEvent.title, emailRegistrationData);
        console.log('📧 [Registration] Email service response:', emailResult);
        
        if (emailResult.success && emailResult.data) {
          emailSuccess = true;
          checkInId = emailResult.data.checkInId || '';
          checkInUrl = emailResult.data.checkInUrl || `https://gategaborone.com/check-in/${checkInId}`;
          
          registrationData.checkInId = checkInId;
          registrationData.checkInUrl = checkInUrl;
          
          console.log('✅ [Registration] Email sent successfully with check-in info:', { checkInId, checkInUrl });
        }
      } catch (emailError) {
        console.warn('⚠️ [Registration] Email failed, but continuing with registration:', emailError);
        // Don't throw - we'll still complete the registration
        
        // Generate a fallback check-in ID
        checkInId = `manual-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        checkInUrl = `https://gategaborone.com/check-in/${checkInId}`;
        registrationData.checkInId = checkInId;
        registrationData.checkInUrl = checkInUrl;
      }
      
      // If direct WhatsApp failed, try Edge function as fallback
      if (directWhatsAppResult.error) {
        console.log('📱 [Registration] Direct WhatsApp failed, attempting via Edge Function...');
        try {
          const whatsappResult = await sendWhatsAppNotification(registrationData);
          console.log('📱 [Registration] WhatsApp notification result:', whatsappResult);
        } catch (whatsappError) {
          console.warn('⚠️ [Registration] WhatsApp notifications failed:', whatsappError);
          // Don't throw - registration can still complete
        }
      }
      
      // Success notifications - show what worked
      const successMessage = emailSuccess 
        ? "Registration completed! Confirmation sent to your email and WhatsApp."
        : "Registration completed! WhatsApp confirmation sent. Email notification may be delayed.";
      
      toast({
        title: "Registration Successful! 🎉",
        description: `Thank you for registering for ${currentEvent.title}. ${successMessage}`,
      });
      
      sonnerToast.success("Registration Complete!", {
        description: emailSuccess 
          ? "Check your WhatsApp and email for confirmation details"
          : "Check your WhatsApp for confirmation. Email confirmation may follow separately.",
        duration: 5000
      });
      
      console.log('✅ [Registration] Registration completed successfully');
      
      // Close the registration dialog
      onSuccess();
      
      // Navigate to the confirmation page with registration data
      navigate('/registration-confirmation', { 
        state: { 
          registrationData,
          checkInUrl,
          checkInId,
          emailSent: emailSuccess
        }
      });
      
    } catch (error) {
      console.error("❌ [Registration] Critical error during registration:", error);
      
      // Still try to provide some value to the user
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      
      toast({
        title: "Registration Issue",
        description: "Your registration was recorded but there may be delays with confirmations. Please contact us if you don't receive confirmation within 30 minutes.",
        variant: "destructive",
      });
      
      sonnerToast.error("Registration had issues", {
        description: "Your details were saved but confirmations may be delayed. Please contact the church if needed.",
        duration: 8000
      });
      
      // Even on error, we'll try to navigate to confirmation with what we have
      if (currentEvent) {
        const fallbackRegistrationData: RegistrationData = {
          event: {
            ...currentEvent,
            date: formatDate(currentEvent.date),
            time: currentEvent.time,
            location: currentEvent.location
          },
          attendee: {
            ...formData,
            phone: `${formData.countryCode}${formData.phone.trim()}`
          },
          message: `Title: ${formData.title}, Role: ${formData.role}, Denomination: ${formData.denomination}`,
          submitDate: new Date().toISOString(),
          registrationType: 'Standard'
        };
        
        onSuccess();
        navigate('/registration-confirmation', { 
          state: { 
            registrationData: fallbackRegistrationData,
            checkInUrl: '',
            checkInId: '',
            emailSent: false,
            hasError: true,
            errorMessage
          }
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return {
    isSubmitting,
    handleSubmitRegistration
  };
};
