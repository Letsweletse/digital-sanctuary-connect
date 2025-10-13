
import React from 'react';
import Layout from '@/components/layout/Layout';
import { useEventRegistration } from '@/hooks/useEventRegistration';
import ConferenceHero from '@/components/conference/ConferenceHero';
import ConferenceCountdown from '@/components/conference/ConferenceCountdown';
import ConferenceTabs from '@/components/conference/ConferenceTabs';
import { conferenceData, conferenceEvent } from '@/components/conference/ConferenceData';

const Conference = () => {
  const { handleOpenRegistration } = useEventRegistration();
  
  const openRegistration = () => {
    handleOpenRegistration(conferenceEvent);
  };
  
  return (
    <Layout>
      <main className="flex-grow bg-church-neutral-50">
        <ConferenceHero
          title={conferenceData.title}
          dates={conferenceData.dates}
          venue={conferenceData.venue}
          description={conferenceData.description}
          image={conferenceData.image}
          time="08:30 - 13:10"
          onRegister={openRegistration}
        />
        
        <ConferenceCountdown
          targetDate={conferenceData.targetDate}
          eventTitle={conferenceData.title}
        />
        
        <ConferenceTabs
          sessions={conferenceData.sessions}
          speakers={conferenceData.speakers}
        />
      </main>
    </Layout>
  );
};

export default Conference;
