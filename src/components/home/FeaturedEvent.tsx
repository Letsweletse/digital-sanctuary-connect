
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
  // Function to handle date display - shows formatted date or TBA
  const displayDate = (date: string) => {
    return date === 'TBA' ? 'Dates to be announced' : formatDate(date);
  };

  return (
    <section className="py-12 bg-gradient-to-br from-[#24324b] via-[#1c2a40] to-[#162035] text-white">
      <div className="container px-4 mx-auto">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden shadow-2xl border border-[#b8a156]/30">
            {/* Event Image - takes up less space on mobile */}
            <div className="w-full md:w-2/5 h-[240px] md:h-auto">
              <img
                src={featuredEvent.image}
                alt={featuredEvent.title}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Event Details - more premium layout */}
            <div className="w-full md:w-3/5 p-6 md:p-8">
              <div className="mb-3">
                <span className="inline-block bg-gradient-to-r from-[#b8a156] to-[#d4c278] text-white px-3 py-1 text-sm font-medium rounded-full">
                  Coming Soon
                </span>
              </div>
              
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">{featuredEvent.title}</h2>
              
              <div className="space-y-3 mb-5">
                <div className="flex items-center text-white/90">
                  <CalendarDays className="h-5 w-5 mr-3 text-[#b8a156]" />
                  <span className="font-medium">{displayDate(featuredEvent.date)}</span>
                </div>
                
                <div className="flex items-center text-white/90">
                  <Clock className="h-5 w-5 mr-3 text-[#b8a156]" />
                  <span className="font-medium">{featuredEvent.time}</span>
                </div>
                
                <div className="flex items-start text-white/90">
                  <MapPin className="h-5 w-5 mr-3 mt-0.5 text-[#b8a156]" />
                  <span className="font-medium">{featuredEvent.location}</span>
                </div>
              </div>
              
              <p className="text-white/80 mb-6 line-clamp-3">
                {featuredEvent.description}
              </p>
              
              <div className="flex flex-col xs:flex-row gap-3">
                <Button
                  onClick={onRegisterClick}
                  className="bg-gradient-to-r from-[#b8a156] to-[#d4c278] hover:from-[#d4c278] hover:to-[#b8a156] text-white px-6 font-medium py-5 md:py-3 transition duration-300 shadow-lg hover:shadow-xl border-0"
                >
                  <Users className="h-5 w-5 mr-2" />
                  Stay Updated
                </Button>
                
                <Button
                  variant="outline"
                  className="border-[#b8a156] text-white hover:bg-[#24324b]/40"
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
