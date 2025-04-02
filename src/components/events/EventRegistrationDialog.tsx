
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CalendarCheck, User, Mail, Phone, Users } from "lucide-react";
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Card, CardContent } from "@/components/ui/card";
import { EventData, RegistrationFormData } from '@/types/eventTypes';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl md:max-w-2xl lg:max-w-3xl w-[95%] max-h-[90vh] overflow-y-auto p-0 gap-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-xl md:text-2xl">Register for {currentEvent?.title}</DialogTitle>
          <DialogDescription className="text-base">
            Complete the form below to reserve your spot.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col md:flex-row">
          {/* Left side - Event details */}
          <div className="md:w-2/5 p-4 md:p-6">
            {currentEvent && (
              <Card className="border-none shadow-none bg-transparent">
                <AspectRatio ratio={4/3} className="overflow-hidden rounded-md shadow-md">
                  <img 
                    src={currentEvent.image} 
                    alt={currentEvent.title} 
                    className="w-full h-full object-cover"
                  />
                </AspectRatio>
                <CardContent className="p-4 mt-3 bg-church-blue-light bg-opacity-20 rounded-md space-y-2">
                  <h3 className="font-bold text-lg text-church-blue-dark">{currentEvent?.title}</h3>
                  <div className="flex items-center gap-2 text-sm md:text-base">
                    <CalendarCheck className="h-4 w-4 text-church-blue" />
                    <span className="font-medium">{formatDate(currentEvent?.date || '')} | {currentEvent?.time}</span>
                  </div>
                  <p className="text-sm md:text-base font-medium flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-church-blue mt-1">
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    <span>{currentEvent?.location}</span>
                  </p>
                  {currentEvent?.description && (
                    <p className="text-sm md:text-base mt-2 text-church-neutral-700">
                      {currentEvent.description.length > 120 
                        ? `${currentEvent.description.substring(0, 120)}...` 
                        : currentEvent.description}
                    </p>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
          
          {/* Right side - Form */}
          <div className="md:w-3/5 p-4 md:p-6 pt-2 md:pt-6">
            <form onSubmit={onSubmit} className="space-y-5">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name" className="flex items-center gap-2 text-base">
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
                    className="border-church-blue-light focus-visible:ring-church-blue text-base"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="email" className="flex items-center gap-2 text-base">
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
                      className="border-church-blue-light focus-visible:ring-church-blue text-base"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="phone" className="flex items-center gap-2 text-base">
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
                      className="border-church-blue-light focus-visible:ring-church-blue text-base"
                    />
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="numberOfAttendees" className="flex items-center gap-2 text-base">
                    <Users className="h-4 w-4 text-church-blue" />
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
                    className="border-church-blue-light focus-visible:ring-church-blue text-base"
                  />
                </div>
                
                <div className="p-4 bg-blue-50 border border-blue-100 rounded-md flex items-start gap-2 mt-2">
                  <Mail className="h-5 w-5 text-blue-700 mt-0.5" />
                  <p className="text-sm md:text-base text-blue-700">
                    Registration details will be sent to church staff at otenggate@gmail.com
                  </p>
                </div>
              </div>
              
              <DialogFooter className={isMobile ? "flex-col gap-3 mt-4" : "sm:justify-between gap-3 mt-4"}>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onClose} 
                  className="border-church-neutral-300 w-full md:w-auto text-base"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-church-blue hover:bg-church-blue-dark text-white w-full md:w-auto text-base py-6 md:py-2.5"
                >
                  {isSubmitting ? "Submitting..." : "Submit Registration"}
                </Button>
              </DialogFooter>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventRegistrationDialog;
