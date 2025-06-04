
import React from 'react';
import { EventData } from '@/types/eventTypes';
import { CalendarDays, Clock, MapPin, ExternalLink } from "lucide-react";
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Card, CardContent } from "@/components/ui/card";

interface EventDetailCardProps {
  event: EventData;
  formatDate: (dateString: string) => string;
}

const EventDetailCard: React.FC<EventDetailCardProps> = ({ event, formatDate }) => {
  // Updated Google Maps URL for the conference location
  const googleMapsUrl = "https://maps.app.goo.gl/Y5BPKfURyqQJ8EuXA";
  
  // Function to handle date display - shows formatted date or TBA
  const displayDate = (dateString: string) => {
    return dateString === 'TBA' ? 'Dates to be announced' : formatDate(dateString);
  };
  
  return (
    <Card className="border-none shadow-md bg-white rounded-lg overflow-hidden">
      <AspectRatio ratio={16/9} className="overflow-hidden bg-gray-100">
        <img 
          src={event.image} 
          alt={event.title} 
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
        />
      </AspectRatio>
      <CardContent className="p-4 space-y-2.5">
        <h3 className="font-bold text-base md:text-lg text-church-blue-dark line-clamp-2">{event.title}</h3>
        <div className="flex items-center gap-2 text-xs md:text-sm">
          <CalendarDays className="h-4 w-4 text-church-blue flex-shrink-0" />
          <span className="font-medium">{displayDate(event.date || '')}</span>
        </div>
        <div className="flex items-center gap-2 text-xs md:text-sm">
          <Clock className="h-4 w-4 text-church-blue flex-shrink-0" />
          <span className="font-medium">{event.time}</span>
        </div>
        <div className="flex items-start gap-2 text-xs md:text-sm">
          <MapPin className="h-4 w-4 text-church-blue mt-0.5 flex-shrink-0" />
          <a 
            href={googleMapsUrl}
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-church-blue hover:underline flex items-center gap-1 group"
          >
            <span>Travelodge Conference Centre</span>
            <ExternalLink className="h-3 w-3 opacity-70 group-hover:opacity-100" />
          </a>
        </div>
        {event.description && (
          <p className="text-xs md:text-sm mt-1 text-church-neutral-700">
            {event.description}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default EventDetailCard;
