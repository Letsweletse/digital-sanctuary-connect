
import React from 'react';
import { EventData } from '@/types/eventTypes';
import { CalendarCheck, Clock, MapPin, ExternalLink } from "lucide-react";
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Card, CardContent } from "@/components/ui/card";

interface EventDetailCardProps {
  event: EventData;
  formatDate: (dateString: string) => string;
}

const EventDetailCard: React.FC<EventDetailCardProps> = ({ event, formatDate }) => {
  // Direct Google Maps URL for Gate Gaborone - no shortened URL
  const googleMapsUrl = "https://www.google.com/maps/place/Gate+Gaborone/@-24.6618567,25.9048083,15z/data=!4m6!3m5!1s0x1ebb5b26225a6213:0xaed9e468c1e4ef31!8m2!3d-24.6618567!4d25.9048083!16s%2Fg%2F11q89m2yrq";
  
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
          <CalendarCheck className="h-4 w-4 text-church-blue flex-shrink-0" />
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
            <span>Gate Gaborone Auditorium</span>
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
