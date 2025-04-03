
import React from 'react';
import { EventData } from '@/types/eventTypes';
import { formatDate } from '@/utils/dateUtils';

interface FeaturedEventProps {
  featuredEvent: EventData;
  onRegisterClick: () => void;
}

const FeaturedEvent: React.FC<FeaturedEventProps> = ({ 
  featuredEvent,
  onRegisterClick 
}) => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block bg-church-blue-light px-3 py-1 rounded-full text-sm font-medium text-church-neutral-700 mb-4">
            Featured Event
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-church-neutral-900 mb-6">
            {featuredEvent.title}
          </h2>
          <p className="max-w-2xl mx-auto text-church-neutral-700">
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
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
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
                <button 
                  className="btn-primary inline-block"
                  onClick={onRegisterClick}
                >
                  Register Now
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-xl font-semibold text-church-neutral-900 mb-2">Event Details</h4>
                  <p className="text-church-neutral-700 mb-4">
                    {featuredEvent.description}
                  </p>
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-church-neutral-900 mb-2">What to Expect</h4>
                  <ul className="list-disc list-inside text-church-neutral-700 space-y-1">
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
