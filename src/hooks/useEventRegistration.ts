import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { toast as sonnerToast } from "sonner";
import { EventData, RegistrationFormData } from '@/types/eventTypes';
import { sendEventRegistrationEmail } from '@/lib/emailService';
import { formatDate } from '@/utils/dateUtils';
import { supabase } from "@/integrations/supabase/client";

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
      console.log("🔍 [WhatsApp] Notification Process Started via Edge Function");
      console.log("📱 [WhatsApp] Registration Data:", JSON.stringify(registrationData, null, 2));

      let rawPhone = registrationData.attendee.phone;
      console.log("🚨 [WhatsApp] Raw Phone Number:", rawPhone);

      if (!rawPhone.startsWith('+')) {
        console.warn("[WhatsApp] Phone missing country code, attempting to add default +267");
        rawPhone = `+267${rawPhone}`;
      }

      const cleanedPhone = rawPhone.replace(/[\s\-()]/g, '');
      console.log("🧼 [WhatsApp] Cleaned Phone Number:", cleanedPhone);

      const phoneRegex = /^\+\d{10,15}$/;
      if (!phoneRegex.test(cleanedPhone)) {
        console.error("❌ [WhatsApp] Invalid Phone Number Format:", cleanedPhone);
        
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

      const message = `Thank you for registering for ${registrationData.event}! 
Event Date: ${registrationData.eventDate}
Event Time: ${registrationData.eventTime}
Location: ${registrationData.location}

Your registration is confirmed. We look forward to seeing you!`;

      console.log("📨 [WhatsApp] Prepared Message:", message);

      console.log("🚀 [WhatsApp] Calling Supabase Edge Function");
      const { data, error } = await supabase.functions.invoke('send-whatsapp', {
        body: {
          phone: cleanedPhone,
          message: message
        }
      });

      console.log("📋 [WhatsApp] Edge Function Response:", data);
      
      if (error) {
        console.error("❌ [WhatsApp] Edge Function Error:", error);
        
        sonnerToast.error("WhatsApp Notification Issue", {
          description: "Could not send WhatsApp message. Please check phone number format.",
          duration: 5000
        });
        
        return { 
          error: true, 
          message: error.message || "Unknown WhatsApp notification error",
          details: error
        };
      }
      
      if (data && !data.error) {
        console.log("✅ [WhatsApp] Notification Sent Successfully via Edge Function");
        
        sonnerToast.success("WhatsApp Notification", {
          description: "Confirmation message sent to your WhatsApp.",
          duration: 5000
        });
        
        return data;
      } else {
        console.error("❌ [WhatsApp] API Error Response:", data);
        
        sonnerToast.error("WhatsApp Notification Issue", {
          description: "Could not send WhatsApp message. Please check phone number format.",
          duration: 5000
        });
        
        return { 
          error: true, 
          message: data?.error || "Unknown WhatsApp notification error",
          details: data
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
      const registrationData = {
        event: currentEvent.title,
        eventDate: formatDate(currentEvent.date),
        eventTime: currentEvent.time,
        eventImage: currentEvent.image,
        location: currentEvent.location.includes('http') 
          ? currentEvent.location 
          : 'https://maps.app.goo.gl/mVLNzv5R2T8wQZNt7',
        attendee: {
          ...formData,
          phone: `${formData.countryCode}${formData.phone.trim()}`
        },
        message: `Title: ${formData.title}, Role: ${formData.role}, Denomination: ${formData.denomination}, Number of Attendees: ${formData.numberOfAttendees}`,
        submitDate: new Date().toISOString(),
        registrationType: 'Standard'
      };

      console.log('Registration submitted with enhanced email data:', registrationData);
      
      const emailResult = await sendEventRegistrationEmail(currentEvent.title, registrationData);
      console.log('Enhanced email service response:', emailResult);
      
      if (!emailResult.success) {
        throw new Error(emailResult.message || "Failed to send registration email");
      }
      
      console.log('[Registration] Attempting WhatsApp notification...');
      const whatsappResult = await sendWhatsAppNotification(registrationData);
      console.log('[Registration] WhatsApp notification result:', whatsappResult);
      
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
