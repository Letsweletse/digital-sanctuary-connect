
import React from 'react';
import { EventData } from '@/types/eventTypes';
import { CalendarCheck, Clock, MapPin } from "lucide-react";
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Card, CardContent } from "@/components/ui/card";

interface EventDetailCardProps {
  event: EventData;
  formatDate: (dateString: string) => string;
}

const EventDetailCard: React.FC<EventDetailCardProps> = ({ event, formatDate }) => {
  return (
    <Card className="border-none shadow-md bg-white rounded-lg overflow-hidden">
      <AspectRatio ratio={16/9} className="overflow-hidden bg-gray-100">
        <img 
          src={event.image} 
          alt={event.title} 
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
        />
      </AspectRatio>
      <CardContent className="p-4 space-y-2">
        <h3 className="font-bold text-base md:text-lg text-church-blue-dark line-clamp-2">{event.title}</h3>
        <div className="flex items-center gap-1.5 text-xs md:text-sm">
          <CalendarCheck className="h-3.5 w-3.5 text-church-blue flex-shrink-0" />
          <span className="font-medium">{formatDate(event.date || '')}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs md:text-sm">
          <Clock className="h-3.5 w-3.5 text-church-blue flex-shrink-0" />
          <span className="font-medium">{event.time}</span>
        </div>
        <div className="flex items-start gap-1.5 text-xs md:text-sm">
          <MapPin className="h-3.5 w-3.5 text-church-blue mt-0.5 flex-shrink-0" />
          <span className="line-clamp-1">
            <a 
              href="https://maps.app.goo.gl/mVLNzv5R2T8wQZNt7" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-church-blue hover:underline"
            >
              {event.location}
            </a>
          </span>
        </div>
        {event.description && (
          <p className="text-xs md:text-sm mt-1 text-church-neutral-700 line-clamp-2">
            {event.description}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default EventDetailCard;
