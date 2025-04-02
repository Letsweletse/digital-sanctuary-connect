
import React from 'react';
import { EventCategory } from '@/types/eventTypes';

interface EventCategoryFilterProps {
  categories: EventCategory[];
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

const EventCategoryFilter: React.FC<EventCategoryFilterProps> = ({ categories, activeCategory, onCategoryChange }) => {
  return (
    <div className="mb-10 overflow-x-auto">
      <div className="flex space-x-2 min-w-max">
        {categories.map(category => (
          <button
            key={category.id}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
              activeCategory === category.id 
                ? 'bg-church-blue text-church-neutral-800' 
                : 'bg-church-neutral-100 text-church-neutral-700 hover:bg-church-neutral-200'
            }`}
            onClick={() => onCategoryChange(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default EventCategoryFilter;
