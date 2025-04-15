
import React from 'react';
import { Button } from "@/components/ui/button";
import { EventData } from '@/types/eventTypes';
import { formatDate } from '@/utils/dateUtils';
import { CalendarDays, Clock, MapPin, Users } from "lucide-react";

interface FeaturedEventProps {
  featuredEvent: EventData;
  onRegisterClick: () => void;
}

const FeaturedEvent: React.FC<FeaturedEventProps> = ({ featuredEvent, onRegisterClick }) => {
  return (
    <section className="py-12 bg-gray-50 dark:bg-gray-900">
      <div className="container px-4 mx-auto">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg">
            {/* Event Image - takes up less space on mobile */}
            <div className="w-full md:w-2/5 h-[200px] md:h-auto">
              <img
                src={featuredEvent.image}
                alt={featuredEvent.title}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Event Details - more compact layout */}
            <div className="w-full md:w-3/5 p-5 md:p-8">
              <div className="mb-2">
                <span className="inline-block bg-church-blue-light/30 text-church-blue px-3 py-1 text-sm font-medium rounded-full">
                  Featured Event
                </span>
              </div>
              
              <h2 className="text-2xl md:text-3xl font-bold mb-3">{featuredEvent.title}</h2>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <CalendarDays className="h-4 w-4 mr-2 text-church-blue" />
                  <span>{formatDate(featuredEvent.date)}</span>
                </div>
                
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <Clock className="h-4 w-4 mr-2 text-church-blue" />
                  <span>{featuredEvent.time}</span>
                </div>
                
                <div className="flex items-start text-gray-600 dark:text-gray-300">
                  <MapPin className="h-4 w-4 mr-2 mt-0.5 text-church-blue" />
                  <span>{featuredEvent.location}</span>
                </div>
              </div>
              
              <p className="text-gray-600 dark:text-gray-300 mb-5 line-clamp-3">
                {featuredEvent.description}
              </p>
              
              <div className="flex flex-col xs:flex-row gap-3">
                <Button
                  onClick={onRegisterClick}
                  className="bg-church-blue hover:bg-church-blue-dark text-white px-6"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Register Now
                </Button>
                
                <Button
                  variant="outline"
                  className="border-church-blue text-church-blue hover:bg-church-blue-light/10"
                  asChild
                >
                  <a href="/events">View All Events</a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedEvent;
