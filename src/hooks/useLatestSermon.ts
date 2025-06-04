
import { useState, useEffect, useRef } from 'react';
import { Sermon } from '@/types/sermonTypes';
import { useSermons } from '@/hooks/useSermons';

export const useLatestSermon = () => {
  const { sermons } = useSermons();
  const [isAdding, setIsAdding] = useState(false);

  // Find the latest featured sermon from the database
  const latestSermon = sermons.find(sermon => sermon.featured) || sermons[0] || null;

  return {
    latestSermon,
    isAdding: false // No longer auto-adding mock data
  };
};
