
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
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load sermons from localStorage or fall back to sample data
  useEffect(() => {
    try {
      setLoading(true);
      
      // Try to load from localStorage first
      const savedSermons = localStorage.getItem('church_sermons');
      if (savedSermons) {
        try {
          const parsedSermons = JSON.parse(savedSermons);
          // Ensure dates are properly parsed from JSON
          const processedSermons = parsedSermons.map((sermon: any) => ({
            ...sermon,
            date: sermon.date ? new Date(sermon.date) : new Date()
          }));
          console.log('Loaded sermons from localStorage:', processedSermons.length);
          
          // If no sermons found in localStorage or it's an empty array, use sample data
          if (processedSermons.length === 0) {
            console.log('No sermons found in localStorage, using sample data');
            setSermons(sermonsData);
            // Save sample data to localStorage
            localStorage.setItem('church_sermons', JSON.stringify(sermonsData));
          } else {
            setSermons(processedSermons);
          }
        } catch (parseError) {
          console.error('Error parsing sermons from localStorage:', parseError);
          // Fall back to sample data if parsing fails
          setSermons(sermonsData);
          // Save correct format to localStorage
          localStorage.setItem('church_sermons', JSON.stringify(sermonsData));
        }
      } else {
        // Fall back to sample data if nothing in localStorage
        console.log('No sermons in localStorage, using sample data');
        setSermons(sermonsData);
        // Save sample data to localStorage
        localStorage.setItem('church_sermons', JSON.stringify(sermonsData));
      }
    } catch (err) {
      console.error('Error loading sermons:', err);
      setError('Failed to load sermons.');
      // Fall back to sample data
      setSermons(sermonsData);
    } finally {
      setLoading(false);
    }
  }, []);

  // Save sermons to localStorage whenever they change
  useEffect(() => {
    if (sermons.length > 0 && !loading) {
      try {
        // Ensure sermons are properly serialized before saving
        const sermonsCopy = sermons.map(sermon => ({
          ...sermon,
          // Convert Date objects to ISO strings for proper serialization
          date: sermon.date instanceof Date ? sermon.date.toISOString() : sermon.date,
        }));
        
        localStorage.setItem('church_sermons', JSON.stringify(sermonsCopy));
        console.log('Saved sermons to localStorage:', sermons.length);
        
        // Trigger sermon refresh event to ensure components are updated
        window.dispatchEvent(new Event('sermon-refresh'));
      } catch (err) {
        console.error('Error saving sermons to localStorage:', err);
      }
    }
  }, [sermons, loading]);

  const addSermon = (sermon: Omit<Sermon, 'id'>) => {
    const newSermon = createSermon(sermon);
    console.log('Adding new sermon:', newSermon);
    setSermons(prev => {
      const updated = [newSermon, ...prev];
      return updated;
    });
    return newSermon;
  };

  const updateSermon = (id: string, updatedSermon: Partial<Sermon>) => {
    console.log('Updating sermon:', id, updatedSermon);
    setSermons(prev => {
      const updated = updateSermonInList(prev, id, updatedSermon);
      return updated;
    });
  };

  const deleteSermon = (id: string) => {
    console.log('Deleting sermon:', id);
    setSermons(prev => {
      const updated = removeSermonFromList(prev, id);
      return updated;
    });
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
