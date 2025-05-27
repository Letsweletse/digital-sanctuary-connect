
import React from 'react';
import EventCountdownTimer from '@/components/events/EventCountdownTimer';

interface ConferenceCountdownProps {
  targetDate: Date;
  eventTitle: string;
}

const ConferenceCountdown: React.FC<ConferenceCountdownProps> = ({
  targetDate,
  eventTitle
}) => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto">
        <EventCountdownTimer 
          targetDate={targetDate} 
          eventTitle={eventTitle}
        />
      </div>
    </div>
  );
};

export default ConferenceCountdown;
