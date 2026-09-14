
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { toast as sonnerToast } from "sonner";
import { EventData, RegistrationFormData, RegistrationData } from '@/types/eventTypes';
import { sendEventRegistrationEmail } from '@/lib/emailService';
import { formatDate } from '@/utils/dateUtils';
import { useWhatsAppNotification } from './useWhatsAppNotification';
import { useNavigate } from 'react-router-dom';
import { sendDirectWhatsAppMessage, generatePremiumWhatsAppConfirmation } from '@/utils/whatsAppUtils';
import { registrationService } from '@/services/registrationService';

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
    
    if (!currentEvent) {
      toast({
        title: "Error",
        description: "No event selected for registration.",
        variant: "destructive",
      });
      return;
    }
    
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
    
    sonnerToast.loading("Processing Registration...", {
      description: "Please wait while we process your registration",
      duration: 2000
    });

    try {
      // Prepare registration data
      const registrationData: RegistrationData = {
        event: {
          ...currentEvent,
          date: formatDate(currentEvent.date),
          time: currentEvent.time,
          location: currentEvent.location,
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

      console.log('🚀 Starting registration process for:', registrationData);
      
      // Generate check-in ID
      const checkInId = `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const checkInUrl = `https://gategaborone.co.bw/check-in/${checkInId}`;
      registrationData.checkInId = checkInId;
      registrationData.checkInUrl = checkInUrl;

      // First, save registration to database
      console.log('💾 Saving registration to database...');
      const saveResult = await registrationService.saveRegistration(registrationData);
      
      if (!saveResult.success) {
        console.warn('⚠️ Failed to save registration to database:', saveResult.error);
        // Continue with notifications even if database save fails
      } else {
        console.log('✅ Registration saved to database successfully');
      }
      
      // Try WhatsApp notification
      sonnerToast.loading("Sending WhatsApp Confirmation...", {
        description: "Sending WhatsApp confirmation message",
        duration: 3000
      });
      
      const premiumWhatsAppMessage = generatePremiumWhatsAppConfirmation(registrationData);
      
      console.log('📱 Sending WhatsApp message to:', registrationData.attendee.phone);
      const directWhatsAppResult = await sendDirectWhatsAppMessage(
        registrationData.attendee.phone, 
        premiumWhatsAppMessage
      );
      
      console.log('📱 WhatsApp result:', directWhatsAppResult);

      // Update WhatsApp status in database
      if (saveResult.success && saveResult.data) {
        await registrationService.updateRegistrationStatus(saveResult.data.id, {
          whatsapp_sent: !directWhatsAppResult.error
        });
      }
      
      // Try email
      sonnerToast.loading("Sending Email Confirmation...", {
        description: "Attempting to send confirmation emails",
        duration: 3000
      });
      
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
      
      let emailSuccess = false;
      
      try {
        console.log('📧 Attempting email via email service...');
        const emailResult = await sendEventRegistrationEmail(currentEvent.title, emailRegistrationData);
        console.log('📧 Email service response:', emailResult);
        
        if (emailResult.success) {
          emailSuccess = true;
          console.log('✅ Email sent successfully');
        }
      } catch (emailError) {
        console.warn('⚠️ Email failed:', emailError);
      }

      // Update email status in database
      if (saveResult.success && saveResult.data) {
        await registrationService.updateRegistrationStatus(saveResult.data.id, {
          email_sent: emailSuccess
        });
      }
      
      // If direct WhatsApp failed, try Edge function as fallback
      if (directWhatsAppResult.error) {
        console.log('📱 Direct WhatsApp failed, attempting via Edge Function...');
        try {
          const whatsappResult = await sendWhatsAppNotification(registrationData);
          console.log('📱 WhatsApp notification result:', whatsappResult);
        } catch (whatsappError) {
          console.warn('⚠️ WhatsApp notifications failed:', whatsappError);
        }
      }
      
      const successMessage = emailSuccess 
        ? "Registration completed! Confirmation sent to your email and WhatsApp."
        : "Registration completed! WhatsApp confirmation sent. Email notification may be delayed.";
      
      toast({
        title: "Registration Successful! 🎉",
        description: `Thank you for registering for ${currentEvent.title}. ${successMessage}`,
      });
      
      sonnerToast.success("Registration Complete!", {
        description: saveResult.success 
          ? "Your registration has been saved and confirmations sent!"
          : "Confirmations sent! Registration data may take a moment to appear in our system.",
        duration: 5000
      });
      
      console.log('✅ Registration completed successfully');
      
      onSuccess();
      
      navigate('/registration-confirmation', { 
        state: { 
          registrationData,
          checkInUrl,
          checkInId,
          emailSent: emailSuccess,
          savedToDatabase: saveResult.success
        }
      });
      
    } catch (error) {
      console.error("❌ Critical error during registration:", error);
      
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
            errorMessage,
            savedToDatabase: false
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
