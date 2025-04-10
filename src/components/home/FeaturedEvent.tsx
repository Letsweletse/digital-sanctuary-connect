
import React from 'react';
import { EventData } from '@/types/eventTypes';
import { formatDate } from '@/utils/dateUtils';
import { Share2, Facebook, Twitter, Linkedin, Mail, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface FeaturedEventProps {
  featuredEvent: EventData;
  onRegisterClick: () => void;
}

const FeaturedEvent: React.FC<FeaturedEventProps> = ({ 
  featuredEvent,
  onRegisterClick 
}) => {
  const eventUrl = "https://gategaborone.com/events";
  
  const shareData = {
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(`Join me for ${featuredEvent.title}! Register here: ${eventUrl}`)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(eventUrl)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Join me at ${featuredEvent.title}! Register here: ${eventUrl}`)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(eventUrl)}`,
    email: `mailto:?subject=${encodeURIComponent(`Join me at ${featuredEvent.title}`)}&body=${encodeURIComponent(`I'm attending ${featuredEvent.title} on ${formatDate(featuredEvent.date)} at ${featuredEvent.time}. You should join too! Register here: ${eventUrl}`)}`,
    tiktok: "https://www.tiktok.com/"
  };

  return (
    <section className="py-20 bg-gray-900 text-white">
      <div className="container mx-auto px-6 md:px-12 lg:px-16">
        <div className="text-center mb-14">
          <span className="inline-block bg-blue-500 px-4 py-2 rounded-full text-lg font-semibold text-white shadow-lg">
            Featured Event
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold mt-6 leading-tight">
            {featuredEvent.title}
          </h2>
          <p className="max-w-3xl mx-auto text-lg opacity-80 mt-4">
            Join us for this exclusive experience featuring renowned speakers, impactful workshops, and transformative fellowship.
          </p>
        </div>
        
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 items-center bg-gray-800 rounded-xl shadow-xl overflow-hidden">
          <div className="h-full">
            <img 
              src={featuredEvent.image}
              alt={featuredEvent.title}
              className="w-full h-full object-contain rounded-l-xl"
            />
          </div>
          <div className="p-8">
            <div className="inline-block px-4 py-2 rounded-full text-sm font-medium mb-3 bg-blue-500 text-white shadow-lg">
              {featuredEvent.category.charAt(0).toUpperCase() + featuredEvent.category.slice(1)}
            </div>
            <h3 className="text-3xl font-bold text-white mb-2">{featuredEvent.title}</h3>
            <p className="text-white/80 mb-4 text-lg">
              {formatDate(featuredEvent.date)} at {featuredEvent.time} | {featuredEvent.location}
            </p>
            <p className="text-lg opacity-80 leading-relaxed mb-4">
              {featuredEvent.description}
            </p>
            <div className="flex flex-wrap gap-4">
              <Button 
                onClick={onRegisterClick}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold shadow-md"
              >
                Register Now
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold shadow-md flex items-center">
                    <Share2 size={20} className="mr-2" />
                    Share
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuItem asChild>
                    <a 
                      href={shareData.whatsapp} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <MessageCircle className="h-4 w-4 text-green-500" />
                      <span>WhatsApp</span>
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <a 
                      href={shareData.facebook} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <Facebook className="h-4 w-4 text-blue-600" />
                      <span>Facebook</span>
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <a 
                      href={shareData.twitter} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <Twitter className="h-4 w-4 text-black" />
                      <span>Twitter/X</span>
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <a 
                      href={shareData.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <Linkedin className="h-4 w-4 text-blue-700" />
                      <span>LinkedIn</span>
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <a 
                      href={shareData.tiktok} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                        <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path>
                      </svg>
                      <span>TikTok</span>
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <a 
                      href={shareData.email} 
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span>Email</span>
                    </a>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedEvent;
