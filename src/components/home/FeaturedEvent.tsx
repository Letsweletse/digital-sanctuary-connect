import React from 'react';
import { Button } from "@/components/ui/button";
import { EventData } from '@/types/eventTypes';
import { formatDate } from '@/utils/dateUtils';
import { CalendarDays, Clock, MapPin, Users, BadgeDollarSign } from "lucide-react";
import EventCountdownTimer from '@/components/events/EventCountdownTimer';

interface FeaturedEventProps {
  featuredEvent: EventData;
  onRegisterClick: () => void;
}

const FeaturedEvent: React.FC<FeaturedEventProps> = ({
  featuredEvent,
  onRegisterClick
}) => {
  // Function to handle date display - shows formatted date or TBA
  const displayDate = (date: string, endDate?: string) => {
    if (date === 'TBA') return 'Dates to be announced';
    if (endDate) {
      const startDate = new Date(date);
      const endDateObj = new Date(endDate);

      // Format as "July 3-5, 2025"
      const startMonth = startDate.toLocaleDateString('en-US', {
        month: 'long'
      });
      const startDay = startDate.getDate();
      const endDay = endDateObj.getDate();
      const year = startDate.getFullYear();
      return `${startMonth} ${startDay}-${endDay}, ${year}`;
    }
    return formatDate(date);
  };

  // Parse the conference date for the countdown
  const getTargetDate = () => {
    if (featuredEvent.date === 'TBA') {
      // Use a date in the future for TBA events
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 30); // 30 days from now
      return futureDate;
    }
    return new Date(featuredEvent.date);
  };

  return (
    <section className="py-16 bg-gradient-to-br from-[#1a2332] via-[#24324b] to-[#2d3e5a] text-white relative overflow-hidden">
      {/* Premium background pattern */}
      <div className="absolute inset-0 opacity-50" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23b8a156' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>
      
      <div className="container px-4 mx-auto relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Premium header */}
          <div className="text-center mb-8">
            <span className="inline-block bg-gradient-to-r from-[#b8a156] to-[#d4c278] text-white px-6 py-2 text-sm font-semibold rounded-full uppercase tracking-wider mb-4">
              Perspectives On The Apostolic
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2 bg-gradient-to-r from-white to-[#b8a156] bg-clip-text text-transparent">
              Upcoming Conference
            </h2>
          </div>

          {/* Large Countdown Timer at the top */}
          <div className="mb-8">
            <EventCountdownTimer targetDate={getTargetDate()} />
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden shadow-2xl border border-[#b8a156]/20 hover:border-[#b8a156]/40 transition-all duration-300">
            <div className="flex flex-col lg:flex-row">
              {/* Event Image - Mobile responsive with proper aspect ratio */}
              <div className="lg:w-1/2 relative">
                <div className="aspect-[4/3] lg:aspect-auto lg:h-[600px] w-full">
                  <img 
                    src="/lovable-uploads/poa-november-2025.jpeg" 
                    alt={featuredEvent.title} 
                    className="w-full h-full object-cover object-center" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent mx-0 px-[6px]"></div>
                </div>
              </div>
              
              {/* Event Details */}
              <div className="lg:w-1/2 p-6 lg:p-10 flex flex-col justify-center">
                <div className="mb-6">
                  <h3 className="text-2xl lg:text-3xl font-bold mb-4 text-white leading-tight">
                    {featuredEvent.title}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center text-white/90 bg-white/5 rounded-lg p-3">
                      <CalendarDays className="h-5 w-5 mr-3 text-[#b8a156] flex-shrink-0" />
                      <div>
                        <div className="font-medium text-sm text-[#b8a156]">Date</div>
                        <div className="font-semibold">{displayDate(featuredEvent.date, featuredEvent.endDate)}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-white/90 bg-white/5 rounded-lg p-3">
                      <MapPin className="h-5 w-5 mr-3 text-[#b8a156] flex-shrink-0" />
                      <div>
                        <div className="font-medium text-sm text-[#b8a156]">Venue</div>
                        <div className="font-semibold">Cresta Lodge Gaborone, Samora Machel Dr, Gaborone</div>
                      </div>
                    </div>
                  </div>

                  {/* Schedule */}
                  <div className="mb-6">
                    <div className="flex items-center mb-3">
                      <Clock className="h-5 w-5 mr-2 text-[#b8a156]" />
                      <span className="font-semibold text-[#b8a156]">Conference Schedule</span>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4 space-y-2">
                      <div className="text-white/90 font-medium">Saturday: Session 1 (09:00–10:15)</div>
                      <div className="text-white/90 font-medium">Saturday: Session 2 (10:45–12:00)</div>
                      <div className="text-white/90 font-medium">Saturday: Session 3 (12:05–13:10)</div>
                    </div>
                  </div>

                  {/* FREE Registration Notice */}
                  <div className="mb-6">
                    <div className="bg-gradient-to-r from-green-500/20 to-green-400/20 border border-green-400/30 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <BadgeDollarSign className="h-6 w-6 mr-3 text-green-400" />
                          <div>
                            <div className="font-semibold text-white">FREE Registration</div>
                            <div className="text-white/80 text-sm">No cost - just reserve your spot</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-400">FREE</div>
                          <div className="text-white/70 text-xs">No charge</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-white/90 mb-6 leading-relaxed">
                    {featuredEvent.description}
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button 
                      onClick={onRegisterClick} 
                      className="bg-gradient-to-r from-[#b8a156] to-[#d4c278] hover:from-[#d4c278] hover:to-[#b8a156] text-white px-8 py-6 text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl border-0 rounded-lg"
                    >
                      <Users className="h-5 w-5 mr-3" />
                      FREE REGISTRATION
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="bg-gradient-to-r from-church-blue to-church-blue-dark hover:from-church-blue-dark hover:to-church-blue text-white font-semibold px-6 py-6 text-lg border-2 border-church-blue rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105" 
                      asChild
                    >
                      <a href="/conference" className="flex items-center justify-center">
                        View Full Details
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedEvent;

