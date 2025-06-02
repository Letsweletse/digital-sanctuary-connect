
import { useState, useEffect } from 'react';
import { Sermon } from '@/types/sermonTypes';
import { useSermons } from '@/hooks/useSermons';
import { latestSermon } from '@/data/latestSermon';

export const useLatestSermon = () => {
  const { sermons, addSermon } = useSermons();
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    // Check if the latest sermon already exists
    const existingSermon = sermons.find(sermon => sermon.id === latestSermon.id);
    
    if (!existingSermon && !isAdding) {
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
        setIsAdding(false);
      });
    }
  }, [sermons, addSermon, isAdding]);

  return {
    latestSermon: sermons.find(sermon => sermon.featured) || latestSermon,
    isAdding
  };
};
