
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { sendEventRegistrationEmail, ADMIN_EMAILS } from '@/lib/emailService';
import EventCard from '@/components/events/EventCard';
import EventRegistrationDialog from '@/components/events/EventRegistrationDialog';
import EventCategoryFilter from '@/components/events/EventCategoryFilter';
import ChurchCalendarEmbed from '@/components/events/ChurchCalendarEmbed';
import { events, categories } from '@/data/eventsData';
import { formatDate } from '@/utils/dateUtils';
import { useEventRegistration } from '@/hooks/useEventRegistration';

const Events = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  
  const {
    isRegistrationOpen,
    currentEvent,
    formData,
    isSubmitting,
    handleOpenRegistration,
    handleCloseRegistration,
    handleInputChange,
    handleSubmitRegistration
  } = useEventRegistration();
  
  useEffect(() => {
    // Preload important images to ensure they're available for emails
    const preloadImages = [
      "https://lojchdvtwypjqupsjynf.supabase.co/storage/v1/object/public/images/general/gate-logo.png",
      "https://lojchdvtwypjqupsjynf.supabase.co/storage/v1/object/public/images/leadership/POA_1743681812478.jpg"
    ];
    
    preloadImages.forEach(imgSrc => {
      const img = new Image();
      img.onload = () => console.log(`Preloaded image: ${imgSrc}`);
      img.onerror = () => console.error(`Failed to preload image: ${imgSrc}`);
      img.src = imgSrc;
    });
    
    // Add event listener for test registration events from the admin panel
    const handleTestRegistration = (event: any) => {
      if (event.detail && events.length > 0) {
        console.log("Test registration event triggered:", event.detail);
        
        // Use the first event for testing
        const testEvent = events[0];
        
        // Create a fake form submission with the test data
        const testFormData = {
          name: "Test User",
          email: event.detail.email || "test@example.com",
          phone: event.detail.phone || "",
          message: "This is a test registration to verify email delivery.",
          title: "Mr",
          role: "Member",
          denomination: "Non-denominational"
        };
        
        // Assemble registration data object
        const registrationData = {
          ...testFormData,
          subject: "New Event Registration (Test)",
          eventName: testEvent.title,
          eventDate: testEvent.date,
          eventTime: testEvent.time,
          location: testEvent.location,
          sendConfirmation: true,
          checkInId: `test-${Date.now()}`,
          attendeeEmail: event.detail.email,
          isTestEmail: true,
          sendSms: true,
          registrationType: "Test"
        };
        
        // Simulate registration submission with the properly structured parameters
        sendEventRegistrationEmail(registrationData, event.detail.email || "test@example.com");
      }
    };
    
    document.addEventListener('test-registration', handleTestRegistration);
    
    return () => {
      document.removeEventListener('test-registration', handleTestRegistration);
    };
  }, []);
  
  const filteredEvents = activeCategory === 'all' 
    ? events 
    : events.filter(event => event.category === activeCategory);
  
  const sortedEvents = [...filteredEvents].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
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
