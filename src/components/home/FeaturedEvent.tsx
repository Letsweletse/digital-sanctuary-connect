import React from 'react';
import { EventData } from '@/types/eventTypes';
import { formatDate } from '@/utils/dateUtils';
import { Share2 } from 'lucide-react';

interface FeaturedEventProps {
  featuredEvent: EventData;
  onRegisterClick: () => void;
}

const FeaturedEvent: React.FC<FeaturedEventProps> = ({ 
  featuredEvent,
  onRegisterClick 
}) => {
  const shareEvent = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: featuredEvent.title,
          text: `Join us for ${featuredEvent.title}! Register here:`,
          url: featuredEvent.registrationLink,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(featuredEvent.registrationLink);
        alert('Link copied to clipboard!');
      } catch (error) {
        console.error('Failed to copy link:', error);
        alert('Unable to copy link. Please copy manually.');
      }
    }
  };

  const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`Join us for ${featuredEvent.title}! Register here: ${featuredEvent.registrationLink}`)}`;

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
                <div className="flex gap-4">
                  <a 
                    href={featuredEvent.registrationLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn-primary text-white px-4 py-2 rounded-lg font-medium"
                  >
                    Register Now
                  </a>
                  <button 
                    className="btn-secondary text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center"
                    onClick={shareEvent}
                  >
                    <Share2 size={20} />
                  </button>
                  <a 
                    href={whatsappShareUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn-secondary text-white px-4 py-2 rounded-lg font-medium"
                  >
                    <img src="/whatsapp-icon.svg" alt="Share on WhatsApp" className="w-5 h-5" />
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
