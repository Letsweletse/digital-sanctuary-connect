import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { useToast } from "@/hooks/use-toast";
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
    const pastorImage = "https://lojchdvtwypjqupsjynf.supabase.co/storage/v1/object/public/images/Senior%20Pastor_1743597241096.jpeg";
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
      
      await sendEventRegistrationEmail(currentEvent?.title || 'Event', registrationData);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Registration Successful!",
        description: "You will receive a confirmation email shortly.",
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
        <section className="bg-church-blue-light py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <span className="inline-block bg-white px-3 py-1 rounded-full text-sm font-medium text-church-neutral-700 mb-4">
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
