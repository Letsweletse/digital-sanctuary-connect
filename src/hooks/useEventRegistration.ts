
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { toast as sonnerToast } from "sonner";
import { EventData, RegistrationFormData } from '@/types/eventTypes';
import { sendEventRegistrationEmail } from '@/lib/emailService';
import { formatDate } from '@/utils/dateUtils';
import { enableDirectMode, forceDirectMode, storeResendApiKey } from '@/lib/directResendService';

export const useEventRegistration = () => {
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<EventData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [whatsappLink, setWhatsappLink] = useState<string | null>(null);
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
    setWhatsappLink(null);
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
    setWhatsappLink(null);

    try {
      // CRITICAL: Force direct mode for all registrations
      forceDirectMode();
      
      // Check if API key is stored, if not, show a warning
      const apiKey = localStorage.getItem('resend_api_key');
      if (!apiKey) {
        sonnerToast.warning("Email Configuration Required", {
          description: "Please configure your Resend API key in Admin > Email Test section for email delivery",
          duration: 10000
        });
      }
      
      // Prepare comprehensive registration data with all required fields for enhanced email
      const registrationData = {
        subject: `New Registration for ${currentEvent.title}`,
        name: formData.name,
        email: formData.email,
        phone: `${formData.countryCode} ${formData.phone}`,
        title: formData.title,
        role: formData.role,
        denomination: formData.denomination,
        eventName: currentEvent.title,
        eventDate: formatDate(currentEvent.date),
        eventTime: currentEvent.time,
        eventImage: currentEvent.image,
        location: currentEvent.location.includes('http') 
          ? currentEvent.location 
          : 'https://maps.app.goo.gl/mVLNzv5R2T8wQZNt7',
        message: `Number of Attendees: ${formData.numberOfAttendees}`,
        sendConfirmation: true,
        registrationType: 'Standard',
        checkInId: crypto.randomUUID(),
        directBypass: true, // Force direct bypass
        timestamp: Date.now(),
        forceDirect: true
      };

      console.log('Registration submitted with enhanced email data:', registrationData);
      
      // First show a toast to provide feedback that we're processing
      sonnerToast.info("Processing registration...", {
        description: "Please wait while we register you for the event",
        duration: 3000
      });
      
      // Send the email notification with enhanced features and direct bypass
      const emailResult = await sendEventRegistrationEmail(registrationData);
      console.log('Enhanced email service response:', emailResult);
      
      if (!emailResult.success) {
        throw new Error(emailResult.message || "Failed to send registration email");
      }
      
      // Check for WhatsApp notification link (which requires admin action)
      const whatsappNotificationLink = emailResult.data?.whatsappNotificationLink;
      const whatsappRequiresAction = emailResult.data?.whatsappLinkRequiresAction !== false; // Default to true
      
      if (whatsappNotificationLink) {
        setWhatsappLink(whatsappNotificationLink);
      }
      
      // Show success message using both toasts for better visibility
      toast({
        title: "Registration Successful!",
        description: `Thank you for registering for ${currentEvent.title}. A confirmation has been sent to your email.`,
      });
      
      const whatsappNotificationSent = emailResult.data?.whatsappNotificationSent;
      
      sonnerToast.success("Registration Complete!", {
        description: `Check your email (${formData.email}) for confirmation with event details. ${whatsappNotificationSent ? (whatsappRequiresAction ? "WhatsApp notification link has been generated for admin use." : "WhatsApp notification has been sent.") : ""}`,
        duration: 8000
      });
      
      // If we have a WhatsApp link and we're an admin, show a special toast with the link
      if (whatsappNotificationLink && whatsappRequiresAction) {
        sonnerToast("WhatsApp Notification Ready", {
          description: "As an admin, you can click the button below to send the WhatsApp message manually.",
          action: {
            label: "Send WhatsApp",
            onClick: () => window.open(whatsappNotificationLink, '_blank')
          },
          duration: 0, // Keep it visible until dismissed
          style: { backgroundColor: "#f0fbf8", borderColor: "#34d399" }
        });
      }
      
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
    whatsappLink,
    handleOpenRegistration,
    handleCloseRegistration,
    handleInputChange,
    handleSubmitRegistration
  };
};
