
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

  // Function to handle opening follow links
  const openFollowLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
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
            <div className="flex flex-wrap gap-4 mb-6">
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
            
            {/* Follow Us Section */}
            <div className="mt-6 pt-6 border-t border-gray-700">
              <h4 className="text-xl font-semibold mb-3">Follow Gate Gaborone</h4>
              <div className="flex flex-wrap gap-3">
                <Button 
                  variant="outline" 
                  size="icon"
                  className="bg-transparent border-white/20 hover:bg-blue-600 hover:border-blue-600"
                  onClick={() => openFollowLink('https://www.facebook.com/GateGaborone')}
                >
                  <Facebook className="h-5 w-5" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon"
                  className="bg-transparent border-white/20 hover:bg-pink-600 hover:border-pink-600"
                  onClick={() => openFollowLink('https://www.instagram.com/gategaborone')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                  </svg>
                </Button>
                <Button 
                  variant="outline" 
                  size="icon"
                  className="bg-transparent border-white/20 hover:bg-red-600 hover:border-red-600"
                  onClick={() => openFollowLink('https://www.youtube.com/@GateGaborone')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-youtube">
                    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"></path>
                    <path d="m10 15 5-3-5-3z"></path>
                  </svg>
                </Button>
                <Button 
                  variant="outline" 
                  size="icon"
                  className="bg-transparent border-white/20 hover:bg-black hover:border-black"
                  onClick={() => openFollowLink('https://twitter.com/GateGaborone')}
                >
                  <Twitter className="h-5 w-5" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon"
                  className="bg-transparent border-white/20 hover:bg-black hover:border-black"
                  onClick={() => openFollowLink('https://www.tiktok.com/')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path>
                  </svg>
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
