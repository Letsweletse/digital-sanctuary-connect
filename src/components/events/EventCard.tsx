
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin } from "lucide-react";
import { EventData, EventCategoryObject } from '@/types/eventTypes';
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface EventCardProps {
  event: EventData;
  categories: EventCategoryObject[];
  formatDate: (dateString: string) => string;
  onRegister: (event: EventData) => void;
}

const EventCard: React.FC<EventCardProps> = ({ 
  event, 
  categories, 
  formatDate, 
  onRegister 
}) => {
  const category = categories.find(cat => cat.id === event.category) || { id: '', name: '' };
  
  const handleRegisterClick = () => {
    onRegister(event);
  };
  
  return (
    <Card className="h-full border-0 shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col bg-white dark:bg-gray-800">
      <div className="relative">
        <AspectRatio ratio={16 / 9} className="bg-gray-100 dark:bg-gray-700">
          <img 
            src={event.image} 
            alt={event.title} 
            className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
            style={{ objectPosition: '50% 12%' }}
          />
        </AspectRatio>
        <div className="absolute top-3 right-3">
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-white dark:bg-church-blue text-church-blue dark:text-white shadow-sm">
            {category.name}
          </span>
        </div>
      </div>
      
      <CardContent className="flex flex-col flex-grow p-4 space-y-3">
        <h3 className="text-xl font-bold line-clamp-2 min-h-[3.5rem]">{event.title}</h3>
        
        <div className="space-y-2 flex-grow">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
            <Calendar className="w-4 h-4 mr-2 text-church-blue" />
            <span>{formatDate(event.date)}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
            <Clock className="w-4 h-4 mr-2 text-church-blue" />
            <span>{event.time}</span>
          </div>
          
          <div className="flex items-start text-sm text-gray-600 dark:text-gray-300">
            <MapPin className="w-4 h-4 mr-2 mt-0.5 text-church-blue" />
            <span className="line-clamp-1">{event.location}</span>
          </div>
          
          {event.description && (
            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mt-2">
              {event.description}
            </p>
          )}
        </div>
        
        {event.registration && (
          <Button 
            className="w-full bg-church-blue hover:bg-church-blue-dark text-white transition-colors"
            onClick={handleRegisterClick}
          >
            FREE REGISTRATION
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default EventCard;
