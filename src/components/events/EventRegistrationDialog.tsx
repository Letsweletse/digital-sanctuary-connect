
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { EventData, RegistrationFormData } from '@/types/eventTypes';
import EventDetailCard from './EventDetailCard';
import RegistrationForm from './RegistrationForm';

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
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl md:max-w-2xl lg:max-w-3xl w-[95%] max-h-[90vh] overflow-y-auto p-0 gap-0 dialog-animation">
        <DialogHeader className="p-6 pb-2 bg-gradient-to-r from-church-blue-light/30 to-white">
          <DialogTitle className="text-xl md:text-2xl font-montserrat">Register for {currentEvent?.title}</DialogTitle>
          <DialogDescription className="text-base">
            Complete the form below to reserve your spot.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col md:flex-row">
          {/* Left side - Event details */}
          <div className="md:w-2/5 p-4 md:p-6">
            {currentEvent && (
              <EventDetailCard event={currentEvent} formatDate={formatDate} />
            )}
          </div>
          
          {/* Right side - Form */}
          <div className="md:w-3/5 p-4 md:p-6 pt-2 md:pt-6">
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
