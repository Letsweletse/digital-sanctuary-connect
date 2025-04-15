
import React, { useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import Hero from '@/components/home/Hero';
import Welcome from '@/components/home/Welcome';
import EventRegistrationDialog from '@/components/events/EventRegistrationDialog';
import { formatDate } from '@/utils/dateUtils';
import { EventData } from '@/types/eventTypes';
import FeaturedEvent from '@/components/home/FeaturedEvent';
import FeaturedSections from '@/components/home/FeaturedSections';
import { useEventRegistration } from '@/hooks/useEventRegistration';
import { Link } from 'react-router-dom';

const Index = () => {
  // Featured event data
  const featuredEvent: EventData = {
    id: '4',
    title: 'Perspectives on the Apostolic with Thamo Naidoo',
    date: '2025-05-10',
    time: '9:00 AM - 13:30 PM',
    location: 'Gate Gaborone Auditorium',
    description: 'A special conference exploring apostolic ministry in the modern church with guest speaker Thamo Naidoo. Join us for powerful teachings, workshops, and fellowship.',
    category: 'conference',
    image: 'https://lojchdvtwypjqupsjynf.supabase.co/storage/v1/object/public/images/leadership/POA_1743681812478.jpg',
    registration: true,
    registrationLink: '#register-event'
  };
  
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
  
  const openFeaturedEventRegistration = () => {
    handleOpenRegistration(featuredEvent);
  };

  // Check for registration URLs and event page loads
  useEffect(() => {
    // Parse the URL path and hash
    const path = window.location.pathname;
    const hash = window.location.hash;
    
    // Listen for hash changes to detect registration links
    const handleHashChange = () => {
      if (window.location.hash === '#register-event') {
        openFeaturedEventRegistration();
      }
    };

    // Add event listener for hash changes
    window.addEventListener('hashchange', handleHashChange);
    
    // Check if we're on the registration page or if there's a hash for registration
    if (path.includes('/event/registernow') || hash === '#register-event') {
      // Use a small timeout to ensure the page is fully loaded
      setTimeout(() => {
        openFeaturedEventRegistration();
      }, 300);
    }

    // Cleanup event listener
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  return (
    <Layout>
      <div className="page-transition" id="home-content">
        {/* Hero Section */}
        <Hero />
        
        {/* Welcome Section */}
        <Welcome />
        
        {/* Featured Event Section */}
        <div id="register-event">
          <FeaturedEvent 
            featuredEvent={featuredEvent} 
            onRegisterClick={openFeaturedEventRegistration} 
          />
        </div>
        
        {/* Featured Sections Links */}
        <FeaturedSections />
        
        {/* WhatsApp Tester Link - For Development */}
        <div className="bg-yellow-50 border border-yellow-200 p-4 my-8 mx-auto max-w-3xl rounded-lg shadow-sm">
          <h3 className="text-yellow-800 font-medium mb-2">🔧 Development Tools</h3>
          <p className="text-yellow-700 mb-2">Testing tools for developers - not visible in production:</p>
          <div className="flex flex-wrap gap-3">
            <Link 
              to="/whatsapp-test" 
              className="bg-church-blue text-white px-4 py-2 rounded hover:bg-church-blue-dark transition-colors text-sm"
            >
              Test WhatsApp Messages
            </Link>
            <Link 
              to="/email-test" 
              className="bg-church-blue text-white px-4 py-2 rounded hover:bg-church-blue-dark transition-colors text-sm"
            >
              Test Email Sending
            </Link>
          </div>
        </div>
        
        {/* Add EventRegistrationDialog component with event image shown prominently */}
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
      </div>
    </Layout>
  );
};

export default Index;
