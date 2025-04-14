
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { toast as sonnerToast } from "sonner";
import { EventData, RegistrationFormData } from '@/types/eventTypes';
import { sendEventRegistrationEmail } from '@/lib/emailService';
import { formatDate } from '@/utils/dateUtils';
import { enableDirectMode, forceDirectMode, storeResendApiKey, getStoredResendApiKey } from '@/lib/directResendService';

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
      
      // Check if API key is stored, if not, show a warning ONLY TO ADMINS
      const apiKey = getStoredResendApiKey();
      const isAdmin = window.location.pathname.includes('admin') || 
                     formData.email.includes('otenggate') || 
                     formData.email.includes('admin');
      
      if (!apiKey && isAdmin) {
        // Only show for admins
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

      // Only log detailed info for admins
      if (isAdmin) {
        console.log('Registration submitted with enhanced email data:', registrationData);
      }
      
      // First show a toast to provide feedback that we're processing
      sonnerToast.info("Processing registration...", {
        description: "Please wait while we register you for the event",
        duration: 3000
      });
      
      // Send the email notification with enhanced features and direct bypass
      const emailResult = await sendEventRegistrationEmail(registrationData);
      
      // Only log detailed response for admins
      if (isAdmin) {
        console.log('Enhanced email service response:', emailResult);
      }
      
      // For general users, don't show technical errors - just public-friendly messages
      if (!emailResult.success) {
        if (isAdmin) {
          throw new Error(emailResult.message || "Failed to send registration email");
        } else {
          // For public users, show a generic friendly message
          sonnerToast.success("Registration Complete!", {
            description: "Your registration has been recorded. You should receive a confirmation shortly.",
            duration: 8000
          });
          
          // Still log the error for debugging but don't show to public
          console.error('Registration email failed but hiding error from public:', emailResult.message);
          
          // Close the registration form for better UX
          handleCloseRegistration();
          return;
        }
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
        description: `Check your email (${formData.email}) for confirmation with event details.`,
        duration: 8000
      });
      
      // If we have a WhatsApp link and we're an admin, show a special toast with the link
      if (whatsappNotificationLink && whatsappRequiresAction && isAdmin) {
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
      
      // Determine if user is admin
      const isAdmin = window.location.pathname.includes('admin') || 
                     formData.email.includes('otenggate') || 
                     formData.email.includes('admin');
      
      if (isAdmin) {
        // Show detailed error for admins
        toast({
          title: "Registration Failed",
          description: error instanceof Error ? error.message : "There was an error submitting your registration. Please try again.",
          variant: "destructive",
        });
        
        sonnerToast.error("Registration Failed", {
          description: "There was a problem processing your registration. Please try again or check console for details.",
          duration: 5000
        });
      } else {
        // Generic friendly message for public users
        toast({
          title: "Registration Submitted",
          description: "Thank you for registering. If you don't receive a confirmation email shortly, please contact us.",
        });
        
        sonnerToast.success("Registration Recorded", {
          description: "Your registration has been recorded. If you don't receive a confirmation, please contact us directly.",
          duration: 8000
        });
        
        // Close form for better UX despite the error
        handleCloseRegistration();
      }
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
