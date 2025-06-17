
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { EventData, RegistrationFormData } from '@/types/eventTypes';
import EventDetailCard from './EventDetailCard';
import RegistrationForm from './RegistrationForm';
import BankingDetailsCard from './BankingDetailsCard';

interface EventRegistrationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentEvent: EventData | null;
  formData: RegistrationFormData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  formatDate: (dateString: string) => string;
}

const EventRegistrationDialog: React.FC<EventRegistrationDialogProps> = ({
  isOpen,
  onClose,
  currentEvent,
  formData,
  onInputChange,
  onSubmit,
  isSubmitting,
  formatDate
}) => {
  // Check if this event requires payment (assuming conferences and special events do)
  const requiresPayment = currentEvent?.category === 'conference' || 
                         currentEvent?.title.toLowerCase().includes('conference') ||
                         currentEvent?.title.toLowerCase().includes('retreat') ||
                         currentEvent?.title.toLowerCase().includes('workshop');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl md:max-w-4xl w-[95%] max-h-[90vh] overflow-y-auto p-0 gap-0 dialog-animation">
        <DialogHeader className="p-4 md:p-6 pb-2 bg-gradient-to-r from-[#24324b]/10 to-white">
          <DialogTitle className="text-lg md:text-xl font-montserrat">FREE REGISTRATION for {currentEvent?.title}</DialogTitle>
          <DialogDescription className="text-sm md:text-base font-montserrat">
            Complete the form below to reserve your spot at no cost
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col lg:flex-row">
          {/* Left side - Event details and banking info */}
          <div className="lg:w-2/5 p-3 md:p-4 space-y-4">
            {currentEvent && (
              <EventDetailCard event={currentEvent} formatDate={formatDate} />
            )}
            
            {/* Banking Details - show for events that require payment */}
            {requiresPayment && currentEvent && (
              <BankingDetailsCard 
                eventTitle={currentEvent.title}
                registrationFee="FREE"
              />
            )}
          </div>
          
          {/* Right side - Form */}
          <div className="lg:w-3/5 p-3 md:p-4 pt-1 md:pt-4">
            <RegistrationForm 
              formData={formData}
              onInputChange={onInputChange}
              onSubmit={onSubmit}
              onClose={onClose}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventRegistrationDialog;
