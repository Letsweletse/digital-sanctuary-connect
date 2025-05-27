
import React from 'react';
import { CalendarDays, Clock, MapPin, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ConferenceHeroProps {
  title: string;
  dates: string;
  venue: string;
  description: string;
  image: string;
  onRegister: () => void;
}

const ConferenceHero: React.FC<ConferenceHeroProps> = ({
  title,
  dates,
  venue,
  description,
  image,
  onRegister
}) => {
  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-r from-church-blue-dark/70 to-church-blue-dark/70 z-10"></div>
      <div className="w-full h-72 md:h-96 bg-church-blue bg-cover bg-center" style={{ backgroundImage: `url(${image})` }}></div>
      
      <div className="container mx-auto px-4 relative z-20 -mt-32 md:-mt-40">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="p-6 md:p-8">
            <h1 className="text-2xl md:text-4xl font-bold text-church-blue-dark mb-4">{title}</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="flex items-center text-church-neutral-700">
                <CalendarDays className="h-5 w-5 mr-2 text-church-blue" />
                <span>{dates}</span>
              </div>
              
              <div className="flex items-center text-church-neutral-700">
                <Clock className="h-5 w-5 mr-2 text-church-blue" />
                <span>Multiple Sessions</span>
              </div>
              
              <div className="flex items-center text-church-neutral-700">
                <MapPin className="h-5 w-5 mr-2 text-church-blue" />
                <span>{venue}</span>
              </div>
            </div>
            
            <p className="text-church-neutral-700 mb-6">{description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <Button 
                  className="w-full bg-church-gold hover:bg-church-gold-dark text-white"
                  onClick={onRegister}
                >
                  <Users className="h-5 w-5 mr-2" />
                  Register Now
                </Button>
              </div>
              
              <div>
                <Button 
                  variant="outline" 
                  className="w-full border-church-blue text-church-blue"
                  onClick={() => window.open("https://calendar.google.com/calendar/render?action=TEMPLATE&text=Apostolic%20Conference:%20Rule%20Your%20Domain&dates=20250703T180000/20250705T133000&details=Join%20us%20for%20this%20transformative%20conference%20as%20we%20explore%20apostolic%20principles%20for%20ruling%20your%20domain.&location=Travelodge%20Conference%20Centre,%20Gaborone&sprop=&sprop=name:", "_blank")}
                >
                  Add to Calendar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConferenceHero;
