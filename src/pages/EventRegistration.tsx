
import React, { useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { events } from '@/data/eventsData';
import { useEventRegistration } from '@/hooks/useEventRegistration';
import EventRegistrationDialog from '@/components/events/EventRegistrationDialog';
import { formatDate } from '@/utils/dateUtils';

const EventRegistration: React.FC = () => {
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

  // Auto-open registration dialog for the first upcoming event
  useEffect(() => {
    const upcomingEvent = events[0]; // Get the first/featured event
    if (upcomingEvent && !isRegistrationOpen) {
      handleOpenRegistration(upcomingEvent);
    }
  }, []);

  const featuredEvent = events[0];

  return (
    <Layout>
      <section className="py-12 md:py-20 bg-gradient-to-b from-church-blue/10 to-white min-h-[60vh]">
        <div className="container-custom text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-church-blue mb-4">
            Event Registration
          </h1>
          {featuredEvent && (
            <div className="max-w-2xl mx-auto">
              <h2 className="text-xl md:text-2xl font-semibold text-church-blue-dark mb-2">
                {featuredEvent.title}
              </h2>
              <p className="text-muted-foreground mb-4">
                {new Date(featuredEvent.date).toLocaleDateString('en-GB', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })} | {featuredEvent.time}
              </p>
              <p className="text-muted-foreground mb-6">
                {featuredEvent.location}
              </p>
              {!isRegistrationOpen && (
                <button
                  onClick={() => handleOpenRegistration(featuredEvent)}
                  className="bg-church-blue hover:bg-church-blue-dark text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 hover:shadow-lg"
                >
                  Register Now - FREE
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Registration Dialog */}
      <EventRegistrationDialog
        isOpen={isRegistrationOpen}
        currentEvent={currentEvent}
        formData={formData}
        isSubmitting={isSubmitting}
        onInputChange={handleInputChange}
        onSubmit={handleSubmitRegistration}
        onClose={handleCloseRegistration}
        formatDate={formatDate}
      />
    </Layout>
  );
};

export default EventRegistration;
