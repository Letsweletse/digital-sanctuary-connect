
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CalendarCheck, User, Mail, Phone } from "lucide-react";
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
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
          <DialogTitle className="text-xl">Register for {currentEvent?.title}</DialogTitle>
          <DialogDescription>
            Complete the form below to reserve your spot.
          </DialogDescription>
        </DialogHeader>
        
        {currentEvent && (
          <Card className="border-none shadow-none">
            <AspectRatio ratio={16 / 9} className="overflow-hidden rounded-md">
              <img 
                src={currentEvent.image} 
                alt={currentEvent.title} 
                className="w-full h-full object-cover"
              />
            </AspectRatio>
            <CardContent className="p-3 bg-blue-50 rounded-b-md space-y-1">
              <h3 className="font-bold text-church-blue-dark">{currentEvent?.title}</h3>
              <div className="flex items-center gap-2 text-sm">
                <CalendarCheck className="h-4 w-4 text-church-blue" />
                <span>{formatDate(currentEvent?.date || '')} | {currentEvent?.time}</span>
              </div>
              <p className="text-sm font-medium">{currentEvent?.location}</p>
            </CardContent>
          </Card>
        )}
        
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="h-4 w-4 text-church-blue" />
                Full Name
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={onInputChange}
                required
                className="border-church-blue-light focus-visible:ring-church-blue"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-church-blue" />
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
                  className="border-church-blue-light focus-visible:ring-church-blue"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-church-blue" />
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  placeholder="Your contact number"
                  value={formData.phone}
                  onChange={onInputChange}
                  required
                  className="border-church-blue-light focus-visible:ring-church-blue"
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="numberOfAttendees" className="flex items-center gap-2">
                <CalendarCheck className="h-4 w-4 text-church-blue" />
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
                className="border-church-blue-light focus-visible:ring-church-blue"
              />
            </div>
            
            <div className="p-3 bg-blue-50 border border-blue-100 rounded-md flex items-start gap-2">
              <Mail className="h-4 w-4 text-blue-700 mt-0.5" />
              <p className="text-sm text-blue-700">
                Registration details will be sent to church staff at otenggate@gmail.com
              </p>
            </div>
          </div>
          
          <DialogFooter className="sm:justify-between gap-2">
            <Button type="button" variant="outline" onClick={onClose} className="border-church-neutral-300">
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-church-blue hover:bg-church-blue-dark text-white"
            >
              {isSubmitting ? "Submitting..." : "Submit Registration"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EventRegistrationDialog;
