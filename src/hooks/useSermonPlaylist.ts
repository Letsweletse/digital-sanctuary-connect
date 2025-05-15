
import { useState } from 'react';
import { Sermon } from '@/types/sermonTypes';

export const useSermonPlaylist = (
  initialSermons: Sermon[], 
  defaultSermons?: Sermon[]
) => {
  const [currentSermonIndex, setCurrentSermonIndex] = useState(0);
  const [localSermons, setLocalSermons] = useState<Sermon[]>(initialSermons.length > 0 ? initialSermons : defaultSermons || []);

  // Navigate to previous sermon
  const handlePrevious = () => {
    setCurrentSermonIndex(prevIndex => 
      prevIndex === 0 ? localSermons.length - 1 : prevIndex - 1
    );
  };

  // Navigate to next sermon
  const handleNext = () => {
    setCurrentSermonIndex(prevIndex => 
      prevIndex === localSermons.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Get the current sermon based on index
  const currentSermon = localSermons[currentSermonIndex] || (defaultSermons ? defaultSermons[0] : null);

  return {
    currentSermonIndex,
    setCurrentSermonIndex,
    localSermons,
    setLocalSermons,
    currentSermon,
    handlePrevious,
    handleNext
  };
};
