
import React from 'react';
import { EventData } from '@/types/eventTypes';
import { formatDate } from '@/utils/dateUtils';
import { Share2, Facebook, Twitter, Linkedin, Mail, MessageSquare } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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
  // Prepare sharing links for various platforms
  const eventTitle = encodeURIComponent(featuredEvent.title);
  const eventDate = encodeURIComponent(formatDate(featuredEvent.date));
  const eventTime = encodeURIComponent(featuredEvent.time);
  const shareUrl = encodeURIComponent(`https://gategaborone.com/events?register=${encodeURIComponent(featuredEvent.title)}`);
  
  const shareLinks = {
    whatsapp: `https://api.whatsapp.com/send?text=Join%20me%20at%20${eventTitle}%20on%20${eventDate}%20at%20${eventTime}!%20Register%20here:%20${shareUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
    twitter: `https://twitter.com/intent/tweet?text=Join%20me%20at%20${eventTitle}%20at%20Gate%20Gaborone!&url=${shareUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`,
    email: `mailto:?subject=Join%20me%20at%20${eventTitle}&body=I'm%20attending%20${eventTitle}%20at%20Gate%20Gaborone%20on%20${eventDate}%20at%20${eventTime}.%20You%20should%20join%20too!%20Register%20here:%20${shareUrl}`,
    tiktok: `https://www.tiktok.com/share?text=Join%20me%20at%20${eventTitle}%20at%20Gate%20Gaborone!%20Register%20here:%20${shareUrl}`
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
            <div className="flex flex-wrap gap-5">
              <a 
                href={featuredEvent.registrationLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold shadow-md"
                onClick={(e) => {
                  e.preventDefault();
                  onRegisterClick();
                }}
              >
                Register Now
              </a>
              
              {/* Enhanced social sharing dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold shadow-md flex items-center justify-center">
                  <Share2 size={20} className="mr-2" />
                  Share
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-white rounded-md shadow-lg p-1">
                  <DropdownMenuLabel>Share this event</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem className="cursor-pointer" onClick={() => window.open(shareLinks.whatsapp, '_blank')}>
                    <MessageSquare className="h-4 w-4 mr-2 text-green-500" />
                    <span>WhatsApp</span>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem className="cursor-pointer" onClick={() => window.open(shareLinks.facebook, '_blank')}>
                    <Facebook className="h-4 w-4 mr-2 text-blue-600" />
                    <span>Facebook</span>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem className="cursor-pointer" onClick={() => window.open(shareLinks.twitter, '_blank')}>
                    <Twitter className="h-4 w-4 mr-2 text-black" />
                    <span>Twitter/X</span>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem className="cursor-pointer" onClick={() => window.open(shareLinks.linkedin, '_blank')}>
                    <Linkedin className="h-4 w-4 mr-2 text-blue-700" />
                    <span>LinkedIn</span>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem className="cursor-pointer" onClick={() => window.open(shareLinks.email, '_blank')}>
                    <Mail className="h-4 w-4 mr-2 text-gray-600" />
                    <span>Email</span>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem className="cursor-pointer" onClick={() => window.open(shareLinks.tiktok, '_blank')}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="black" className="mr-2">
                      <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                    </svg>
                    <span>TikTok</span>
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
