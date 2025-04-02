
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { useToast } from "@/hooks/use-toast";
import { toast as sonnerToast } from "sonner";
import { sendEventRegistrationEmail } from '@/lib/emailService';
import EventCard from '@/components/events/EventCard';
import EventRegistrationDialog from '@/components/events/EventRegistrationDialog';
import EventCategoryFilter from '@/components/events/EventCategoryFilter';
import ChurchCalendarEmbed from '@/components/events/ChurchCalendarEmbed';
import { events, categories } from '@/data/eventsData';
import { formatDate } from '@/utils/dateUtils';
import { EventData, RegistrationFormData } from '@/types/eventTypes';

const Events = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<EventData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState<RegistrationFormData>({
    name: '',
    email: '',
    phone: '',
    numberOfAttendees: 1
  });
  
  useEffect(() => {
    // Preload the pastor image for faster rendering
    const pastorImage = "https://lojchdvtwypjqupsjynf.supabase.co/storage/v1/object/public/images/leadership/Senior%20Pastor_1743598781352.jpeg";
    const img = new Image();
    img.onload = () => {
      console.log("Senior Pastor image loaded successfully:", pastorImage);
    };
    img.onerror = () => {
      console.error("Failed to load Senior Pastor image:", pastorImage);
    };
    img.src = pastorImage;
  }, []);
  
  const filteredEvents = activeCategory === 'all' 
    ? events 
    : events.filter(event => event.category === activeCategory);
  
  const sortedEvents = [...filteredEvents].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
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
        event: currentEvent?.title,
        eventDate: currentEvent?.date ? formatDate(currentEvent.date) : '',
        eventTime: currentEvent?.time,
        attendee: formData,
        submitDate: new Date().toISOString()
      };

      console.log('Registration submitted:', registrationData);
      
      // Send the email notification
      const emailResult = await sendEventRegistrationEmail(currentEvent?.title || 'Event', registrationData);
      console.log('Email service response:', emailResult);
      
      // Simulate API delay for better UX - feels more "real"
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success message using both toasts for better visibility
      toast({
        title: "Registration Successful!",
        description: `Thank you for registering for ${currentEvent?.title}. In a production environment, confirmation emails would be sent.`,
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
      <main className="flex-grow pt-24 page-transition">
        <section className="bg-gradient-to-b from-church-blue-light to-white py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <span className="inline-block bg-white px-3 py-1 rounded-full text-sm font-medium text-church-neutral-700 mb-4 shadow-sm">
                Events Calendar
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-church-neutral-900 mb-6">
                Upcoming Events
              </h1>
              <p className="text-lg text-church-neutral-700">
                Stay connected with our church community through worship services, 
                Bible studies, fellowship gatherings, and special events.
              </p>
            </div>
          </div>
        </section>
        
        <section className="py-16">
          <div className="container mx-auto px-4">
            <EventCategoryFilter 
              categories={categories}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sortedEvents.map((event) => (
                <EventCard 
                  key={event.id}
                  event={event}
                  categories={categories}
                  formatDate={formatDate}
                  onRegister={handleOpenRegistration}
                />
              ))}
            </div>
            
            <ChurchCalendarEmbed />
          </div>
        </section>

        <EventRegistrationDialog
          isOpen={isRegistrationOpen}
          onClose={handleCloseRegistration}
          currentEvent={currentEvent}
          formData={formData}
          onInputChange={handleInputChange}
          onSubmit={handleSubmitRegistration}
          isSubmitting={isSubmitting}
          formatDate={formatDate}
        />
      </main>
    </Layout>
  );
};

export default Events;
