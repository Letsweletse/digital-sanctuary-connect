
import { useState, useEffect, useRef } from 'react';
import { Sermon } from '@/types/sermonTypes';
import { useSermons } from '@/hooks/useSermons';
import { latestSermon } from '@/data/latestSermon';

export const useLatestSermon = () => {
  const { sermons, addSermon } = useSermons();
  const [isAdding, setIsAdding] = useState(false);
  const hasAddedRef = useRef(false);

  useEffect(() => {
    // Prevent multiple additions of the same sermon
    if (hasAddedRef.current || isAdding) {
      return;
    }

    // Check if the latest sermon already exists
    const existingSermon = sermons.find(sermon => 
      sermon.id === latestSermon.id || 
      (sermon.title === latestSermon.title && sermon.speaker === latestSermon.speaker)
    );
    
    if (!existingSermon) {
      console.log('Adding latest sermon for the first time');
      hasAddedRef.current = true;
      setIsAdding(true);
      
      // Add the latest sermon to the database
      addSermon({
        title: latestSermon.title,
        speaker: latestSermon.speaker,
        speakerImage: latestSermon.speakerImage,
        date: latestSermon.date,
        youtubeId: latestSermon.youtubeId,
        description: latestSermon.description,
        tags: latestSermon.tags,
        featured: latestSermon.featured,
        duration: latestSermon.duration,
        views: latestSermon.views,
        downloads: latestSermon.downloads,
        series: latestSermon.series
      }).then(() => {
        console.log('Latest sermon added successfully');
        setIsAdding(false);
      }).catch((error) => {
        console.error('Error adding latest sermon:', error);
        hasAddedRef.current = false; // Reset on error so it can retry
        setIsAdding(false);
      });
    }
  }, [sermons.length]); // Only depend on sermons length to avoid infinite loops

  return {
    latestSermon: sermons.find(sermon => sermon.featured) || latestSermon,
    isAdding
  };
};
