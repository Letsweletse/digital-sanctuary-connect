
import React from 'react';
import { Sermon } from '@/types/sermonTypes';
import { useIsMobile } from '@/hooks/use-mobile';
import SermonCard from './components/SermonCard';
import EmptyState from './components/EmptyState';

interface SermonGridViewProps {
  sermons: Sermon[];
}

const SermonGridView = ({ sermons }: SermonGridViewProps) => {
  const isMobile = useIsMobile();
  
  if (sermons.length === 0) {
    return (
      <EmptyState 
        message="No sermons match your search criteria."
        subMessage="Try adjusting your filters or search terms."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {sermons.map((sermon) => (
        <SermonCard key={sermon.id} sermon={sermon} isMobile={isMobile} />
      ))}
    </div>
  );
};

export default SermonGridView;
