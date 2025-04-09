
import React from 'react';
import { EventData } from '@/types/eventTypes';
import { formatDate } from '@/utils/dateUtils';
import { Share2, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FeaturedEventProps {
  featuredEvent: EventData;
  onRegisterClick: () => void;
}

const FeaturedEvent: React.FC<FeaturedEventProps> = ({ 
  featuredEvent,
  onRegisterClick 
}) => {
  // Create a more detailed WhatsApp share message with event details and image
  const generateShareMessage = () => {
    const eventDate = formatDate(featuredEvent.date);
    // Use absolute URL for registration link to ensure it works properly when shared
    const registrationUrl = `${window.location.origin}/#register-event`;
    
    // Create WhatsApp text message with event details
    return `*${featuredEvent.title}*%0A%0A📅 *Date:* ${eventDate}%0A⏰ *Time:* ${featuredEvent.time}%0A📍 *Location:* ${featuredEvent.location}%0A%0A${featuredEvent.description}%0A%0A🔗 *Register here:* ${registrationUrl}`;
  };

  // Create a WhatsApp share link with the event image and details
  const whatsAppShareLink = `https://api.whatsapp.com/send?text=${generateShareMessage()}`;

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block bg-blue-500 px-3 py-1 rounded-full text-sm font-medium text-white mb-4">
            Featured Event
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            {featuredEvent.title}
          </h2>
          <p className="max-w-2xl mx-auto text-gray-700">
            Join us for this special conference exploring apostolic ministry in the modern church. 
            Featuring powerful teachings, workshops, and fellowship.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="glass-panel overflow-hidden group">
            <div className="relative h-72 md:h-96">
              <img 
                src={featuredEvent.image}
                alt={featuredEvent.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>
              <div className="absolute bottom-0 left-0 w-full p-8">
                <div className="inline-block px-3 py-1 rounded-full text-xs font-medium mb-2 bg-blue-100 text-blue-800">
                  {featuredEvent.category.charAt(0).toUpperCase() + featuredEvent.category.slice(1)}
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">{featuredEvent.title}</h3>
                <p className="text-white/90 mb-4">
                  {formatDate(featuredEvent.date)} at {featuredEvent.time} | {featuredEvent.location}
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button 
                    onClick={onRegisterClick}
                    variant="default"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Register Now
                  </Button>
                  
                  <a 
                    href={whatsAppShareLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex"
                  >
                    <Button 
                      variant="secondary"
                      className="bg-green-600 hover:bg-green-700 text-white gap-2 group"
                    >
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="18" 
                        height="18" 
                        viewBox="0 0 24 24" 
                        fill="white"
                        className="group-hover:scale-110 transition-transform"
                      >
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      <span>Share Event</span>
                    </Button>
                  </a>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">Event Details</h4>
                  <p className="text-gray-700 mb-4">
                    {featuredEvent.description}
                  </p>
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">What to Expect</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Insightful teaching from apostolic leaders</li>
                    <li>Interactive workshops and discussions</li>
                    <li>Powerful worship and ministry</li>
                    <li>Networking with like-minded believers</li>
                  </ul>
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
