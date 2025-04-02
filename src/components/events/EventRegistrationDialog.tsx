
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CalendarCheck, User, Mail, Phone } from "lucide-react";
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { EventData, RegistrationFormData } from '@/types/eventTypes';

interface EventRegistrationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentEvent: EventData | null;
  formData: RegistrationFormData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
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
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Register for {currentEvent?.title}</DialogTitle>
          <DialogDescription>
            Complete the form below to reserve your spot for {formatDate(currentEvent?.date || '')} at {currentEvent?.time}.
          </DialogDescription>
        </DialogHeader>
        
        {currentEvent && (
          <div className="mb-4 rounded-md overflow-hidden">
            <AspectRatio ratio={16 / 9}>
              <img 
                src={currentEvent.image} 
                alt={currentEvent.title} 
                className="w-full h-full object-cover"
              />
            </AspectRatio>
            <div className="p-3 bg-church-blue-light">
              <h3 className="font-bold">{currentEvent?.title}</h3>
              <p className="text-sm">{formatDate(currentEvent?.date || '')} | {currentEvent?.time}</p>
              <p className="text-sm font-medium">{currentEvent?.location}</p>
            </div>
          </div>
        )}
        
        <form onSubmit={onSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Full Name
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={onInputChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={onInputChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Phone Number
              </Label>
              <Input
                id="phone"
                name="phone"
                placeholder="Your contact number"
                value={formData.phone}
                onChange={onInputChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="numberOfAttendees" className="flex items-center gap-2">
                <CalendarCheck className="h-4 w-4" />
                Number of Attendees
              </Label>
              <Input
                id="numberOfAttendees"
                name="numberOfAttendees"
                type="number"
                min="1"
                value={formData.numberOfAttendees}
                onChange={onInputChange}
                required
              />
            </div>
            <div className="mt-2 p-3 bg-blue-50 border border-blue-100 rounded-md">
              <p className="text-sm text-blue-700">
                Registration details will be sent to church staff at otenggate@gmail.com
              </p>
            </div>
          </div>
          <DialogFooter className="sm:justify-between">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Registration"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EventRegistrationDialog;
