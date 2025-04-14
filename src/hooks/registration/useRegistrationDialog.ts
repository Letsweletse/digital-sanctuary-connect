
import { useState } from 'react';
import { EventData } from '@/types/eventTypes';

export const useRegistrationDialog = () => {
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<EventData | null>(null);
  const [whatsappLink, setWhatsappLink] = useState<string | null>(null);
  
  const handleOpenRegistration = (event: EventData) => {
    setCurrentEvent(event);
    setIsRegistrationOpen(true);
  };

  const handleCloseRegistration = () => {
    setIsRegistrationOpen(false);
    setCurrentEvent(null);
    setWhatsappLink(null);
  };
  
  return {
    isRegistrationOpen,
    currentEvent,
    whatsappLink,
    setWhatsappLink,
    handleOpenRegistration,
    handleCloseRegistration
  };
};
