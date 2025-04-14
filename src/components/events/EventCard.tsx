
import React from 'react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { EventCategoryObject, EventData } from '@/types/eventTypes';

interface EventCardProps {
  event: EventData;
  categories: EventCategoryObject[];
  formatDate: (dateString: string) => string;
  onRegister: (event: EventData) => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, categories, formatDate, onRegister }) => {
  return (
    <div className="glass-panel overflow-hidden group">
      <div className="relative">
        <AspectRatio ratio={16 / 9} className="w-full">
          <img 
            src={event.image} 
            alt={event.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </AspectRatio>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full p-4">
          <div 
            className={`inline-block px-2 py-1 rounded text-xs font-medium mb-2 ${
              event.category === 'worship' ? 'bg-church-blue text-church-neutral-800' :
              event.category === 'bible-study' ? 'bg-church-gold text-church-neutral-800' :
              event.category === 'fellowship' ? 'bg-green-100 text-green-800' :
              event.category === 'outreach' ? 'bg-purple-100 text-purple-800' :
              event.category === 'youth' ? 'bg-orange-100 text-orange-800' :
              event.category === 'conference' ? 'bg-blue-100 text-blue-800' :
              'bg-pink-100 text-pink-800'
            }`}
          >
            {categories.find(c => c.id === event.category)?.name}
          </div>
          <h3 className="text-xl font-bold text-white">{event.title}</h3>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-center text-church-neutral-700 mb-3">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 mr-2 text-church-gold" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          <span>{formatDate(event.date)}</span>
        </div>
        
        <div className="flex items-center text-church-neutral-700 mb-3">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 mr-2 text-church-gold" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          <span>{event.time}</span>
        </div>
        
        <div className="flex items-center text-church-neutral-700 mb-4">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 mr-2 text-church-gold" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          <span>{event.location}</span>
        </div>
        
        <p className="text-church-neutral-700 mb-6">{event.description}</p>
        
        <div className="flex space-x-3">
          {event.registration ? (
            <button 
              className="btn-primary flex-1"
              onClick={() => onRegister(event)}
            >
              Register Now
            </button>
          ) : (
            <button className="btn-primary flex-1">
              Learn More
            </button>
          )}
          <button className="btn-outline flex-1">
            Add to Calendar
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
