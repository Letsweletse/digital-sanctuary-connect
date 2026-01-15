
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
            
            {sortedEvents.length === 0 ? (
              <div className="mt-8 rounded-2xl bg-white/90 shadow-lg border border-church-blue-light/30 p-8 text-center">
                <h2 className="text-2xl md:text-3xl font-semibold text-church-neutral-900 mb-3">
                  No upcoming events at the moment
                </h2>
                <p className="text-church-neutral-700 mb-2">
                  Thank you for being part of the GATE Gaborone family.
                </p>
                <p className="text-church-neutral-700">
                  Check back soon for new and upcoming events, or follow us on social media to stay updated!
                </p>
              </div>
            ) : (
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
            )}
            
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
