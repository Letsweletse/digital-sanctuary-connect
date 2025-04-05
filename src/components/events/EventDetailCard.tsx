
import React from 'react';
import { EventData } from '@/types/eventTypes';
import { CalendarCheck } from "lucide-react";
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Card, CardContent } from "@/components/ui/card";

interface EventDetailCardProps {
  event: EventData;
  formatDate: (dateString: string) => string;
}

const EventDetailCard: React.FC<EventDetailCardProps> = ({ event, formatDate }) => {
  return (
    <Card className="border-none shadow-none bg-transparent">
      <AspectRatio ratio={4/3} className="overflow-hidden rounded-md shadow-md">
        <img 
          src={event.image} 
          alt={event.title} 
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
        />
      </AspectRatio>
      <CardContent className="p-4 mt-3 bg-church-blue-light bg-opacity-20 rounded-md space-y-2 border border-church-blue-light/30">
        <h3 className="font-bold text-lg text-church-blue-dark">{event.title}</h3>
        <div className="flex items-center gap-2 text-sm md:text-base">
          <CalendarCheck className="h-4 w-4 text-church-blue" />
          <span className="font-medium">{formatDate(event.date || '')} | {event.time}</span>
        </div>
        <p className="text-sm md:text-base font-medium flex items-start gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-church-blue mt-1">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          <span>{event.location}</span>
        </p>
        {event.description && (
          <p className="text-sm md:text-base mt-2 text-church-neutral-700">
            {event.description.length > 120 
              ? `${event.description.substring(0, 120)}...` 
              : event.description}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default EventDetailCard;
