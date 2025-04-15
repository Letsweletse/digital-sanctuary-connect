
import { useState } from 'react';
import { toast as sonnerToast } from "sonner";
import { EventData } from '@/types/eventTypes';

export const useRegistrationDialog = () => {
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<EventData | null>(null);
  
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
  };

  return {
    isRegistrationOpen,
    currentEvent,
    handleOpenRegistration,
    handleCloseRegistration
  };
};
