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
  const shareLink = `https://api.whatsapp.com/send?text=${encodeURIComponent(`Join us for ${featuredEvent.title}! Register here: ${featuredEvent.registrationLink}`)}`;

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
        
        <div className="max-w-5xl mx-auto overflow-hidden rounded-xl shadow-xl">
          <div className="relative">
            <img 
              src={featuredEvent.image}
              alt={featuredEvent.title}
              className="w-full h-auto object-cover rounded-t-xl"
            />
            <div className="absolute bottom-0 left-0 w-full p-8 bg-black/60">
              <div className="inline-block px-4 py-2 rounded-full text-sm font-medium mb-3 bg-blue-500 text-white shadow-lg">
                {featuredEvent.category.charAt(0).toUpperCase() + featuredEvent.category.slice(1)}
              </div>
              <h3 className="text-3xl font-bold text-white mb-2">{featuredEvent.title}</h3>
              <p className="text-white/80 mb-4 text-lg">
                {formatDate(featuredEvent.date)} at {featuredEvent.time} | {featuredEvent.location}
              </p>
              <div className="flex gap-5">
                <a 
                  href={featuredEvent.registrationLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold shadow-md"
                >
                  Register Now
                </a>
                <a 
                  href={shareLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold shadow-md flex items-center justify-center"
                >
                  <Share2 size={24} className="mr-2" />
                  Share
                </a>
              </div>
            </div>
          </div>
          <div className="p-8 bg-gray-800 rounded-b-xl">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-2xl font-semibold text-white mb-3">Event Details</h4>
                <p className="text-lg opacity-80 leading-relaxed">
                  {featuredEvent.description}
                </p>
              </div>
              <div>
                <h4 className="text-2xl font-semibold text-white mb-3">What to Expect</h4>
                <ul className="list-disc list-inside text-lg opacity-80 space-y-2">
                  <li>Insightful teachings from expert speakers</li>
                  <li>Exclusive networking opportunities</li>
                  <li>Dynamic workshops and Q&A sessions</li>
                  <li>Live worship and spiritual renewal</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedEvent;
