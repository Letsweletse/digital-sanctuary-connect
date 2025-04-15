
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
    <Card className="border-none shadow-none bg-transparent">
      <AspectRatio ratio={16/9} className="overflow-hidden rounded-md shadow-md">
        <img 
          src={event.image} 
          alt={event.title} 
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
        />
      </AspectRatio>
      <CardContent className="p-3 mt-2 bg-church-blue-light bg-opacity-20 rounded-md space-y-1.5 border border-church-blue-light/30">
        <h3 className="font-bold text-base text-church-blue-dark line-clamp-2">{event.title}</h3>
        <div className="flex items-center gap-1.5 text-xs md:text-sm">
          <CalendarCheck className="h-3.5 w-3.5 text-church-blue" />
          <span className="font-medium">{formatDate(event.date || '')}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs md:text-sm">
          <Clock className="h-3.5 w-3.5 text-church-blue" />
          <span className="font-medium">{event.time}</span>
        </div>
        <p className="text-xs md:text-sm font-medium flex items-start gap-1.5">
          <MapPin className="h-3.5 w-3.5 text-church-blue mt-0.5" />
          <span className="line-clamp-1">{event.location}</span>
        </p>
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
