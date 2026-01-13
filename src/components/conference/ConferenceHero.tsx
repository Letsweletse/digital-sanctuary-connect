
import React from 'react';
import { CalendarDays, Clock, MapPin, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ConferenceHeroProps {
  title: string;
  dates: string;
  venue: string;
  description: string;
  image: string;
  time?: string;
  onRegister: () => void;
}

const ConferenceHero: React.FC<ConferenceHeroProps> = ({
  title,
  dates,
  venue,
  description,
  image,
  time = "09:00 - 13:30",
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
                <span>{time}</span>
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
                  FREE REGISTRATION
                </Button>
              </div>
              
              <div>
                <Button 
                  variant="outline" 
                  className="w-full border-church-blue text-church-blue"
                  onClick={() => window.open("https://calendar.google.com/calendar/render?action=TEMPLATE&text=Perspectives%20on%20the%20Apostolic&dates=20260207T090000/20260207T133000&details=Join%20us%20for%20Perspectives%20on%20the%20Apostolic%20with%20Thamo%20Naidoo,%20Presiding%20Apostolic%20Elder%20of%20Gate%20Global%20Family.&location=GATE%20Gaborone%20Auditorium,%20Plot%2054014,%20Gaborone%20West&sprop=&sprop=name:", "_blank")}
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
