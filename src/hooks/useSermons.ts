
import { useState, useEffect } from 'react';
import { Sermon } from '@/types/sermonTypes';
import { sermonsData } from '@/data/sermonsData';
import { 
  createSermon, 
  updateSermonInList, 
  removeSermonFromList, 
  findFeaturedSermon 
} from '@/utils/sermonUtils';

export const useSermons = () => {
  const [sermons, setSermons] = useState<Sermon[]>(sermonsData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSermons = async () => {
    try {
      setLoading(true);
      // Simulating API call
      // const response = await fetch('/api/sermons');
      // const data = await response.json();
      // setSermons(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load sermons.');
      setLoading(false);
    }
  };

  useEffect(() => {
    // Uncomment this when you have a real API
    // fetchSermons();
  }, []);

  const addSermon = (sermon: Omit<Sermon, 'id'>) => {
    const newSermon = createSermon(sermon);
    setSermons(prev => [newSermon, ...prev]);
    return newSermon;
  };

  const updateSermon = (id: string, updatedSermon: Partial<Sermon>) => {
    setSermons(prev => updateSermonInList(prev, id, updatedSermon));
  };

  const deleteSermon = (id: string) => {
    setSermons(prev => removeSermonFromList(prev, id));
  };

  const getFeaturedSermon = (): Sermon | undefined => {
    return findFeaturedSermon(sermons);
  };

  return {
    sermons,
    loading,
    error,
    addSermon,
    updateSermon,
    deleteSermon,
    getFeaturedSermon,
  };
};
