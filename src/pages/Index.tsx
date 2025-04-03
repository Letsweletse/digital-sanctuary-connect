import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import Hero from '@/components/home/Hero';
import Welcome from '@/components/home/Welcome';
import { useToast } from "@/hooks/use-toast";
import { toast as sonnerToast } from "sonner";
import EventRegistrationDialog from '@/components/events/EventRegistrationDialog';
import { formatDate } from '@/utils/dateUtils';
import { EventData, RegistrationFormData } from '@/types/eventTypes';
import { sendEventRegistrationEmail } from '@/lib/emailService';
import FeaturedEvent from '@/components/home/FeaturedEvent';
import FeaturedSections from '@/components/home/FeaturedSections';

const Index = () => {
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  // Featured event data
  const featuredEvent: EventData = {
    id: "featured-event-1",
    title: "Perspectives on the Apostolic",
    date: "2025-05-10",
    time: "9:00 AM - 1:30 PM",
    location: "Gate Gaborone Auditorium",
    description: "A special conference exploring apostolic ministry in the modern church. Join us for powerful teachings, workshops, and fellowship.",
    category: "conference",
    image: "https://lojchdvtwypjqupsjynf.supabase.co/storage/v1/object/public/images/leadership/Pastor%20Kobus%20Bezuidenhout_1743680599419.jpeg",
    registration: true
  };
  
  const [formData, setFormData] = useState<RegistrationFormData>({
    name: '',
    email: '',
    phone: '',
    numberOfAttendees: 1
  });
  
  const handleOpenRegistration = () => {
    setIsRegistrationOpen(true);
    // Show a toast notification for better UX
    sonnerToast("Registration Form Opened", {
      description: `You're registering for ${featuredEvent.title}`,
      duration: 3000
    });
  };

  const handleCloseRegistration = () => {
    setIsRegistrationOpen(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      numberOfAttendees: 1
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'numberOfAttendees' ? parseInt(value) || 1 : value
    }));
  };

  const handleSubmitRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const registrationData = {
        event: featuredEvent.title,
        eventDate: formatDate(featuredEvent.date),
        eventTime: featuredEvent.time,
        attendee: formData,
        submitDate: new Date().toISOString()
      };

      console.log('Registration submitted:', registrationData);
      
      // Send the email notification
      const emailResult = await sendEventRegistrationEmail(featuredEvent.title, registrationData);
      console.log('Email service response:', emailResult);
      
      // Simulate API delay for better UX - feels more "real"
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success message using both toasts for better visibility
      toast({
        title: "Registration Successful!",
        description: `Thank you for registering for ${featuredEvent.title}. In a production environment, confirmation emails would be sent.`,
      });
      
      sonnerToast.success("Registration Complete!", {
        description: "Thank you for your registration. Check your email for confirmation details.",
        duration: 5000
      });
      
      handleCloseRegistration();
    } catch (error) {
      console.error("Error submitting registration:", error);
      toast({
        title: "Registration Failed",
        description: "There was an error submitting your registration. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="page-transition">
        {/* Hero Section */}
        <Hero />
        
        {/* Welcome Section */}
        <Welcome />
        
        {/* Featured Event Section */}
        <FeaturedEvent 
          featuredEvent={featuredEvent} 
          onRegisterClick={handleOpenRegistration} 
        />
        
        {/* Featured Sections Links */}
        <FeaturedSections />
        
        {/* Add EventRegistrationDialog component */}
        <EventRegistrationDialog
          isOpen={isRegistrationOpen}
          onClose={handleCloseRegistration}
          currentEvent={featuredEvent}
          formData={formData}
          onInputChange={handleInputChange}
          onSubmit={handleSubmitRegistration}
          isSubmitting={isSubmitting}
          formatDate={formatDate}
        />
      </div>
    </Layout>
  );
};

export default Index;
