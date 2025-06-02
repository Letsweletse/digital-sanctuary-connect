
import { useState, useEffect } from 'react';
import { Sermon } from '@/types/sermonTypes';
import { useDualSermons } from './useDualSermons';
import { 
  createSermon, 
  updateSermonInList, 
  removeSermonFromList, 
  findFeaturedSermon 
} from '@/utils/sermonUtils';

// This hook now acts as a wrapper around the dual database system
// but maintains backward compatibility with existing components
export const useSermons = () => {
  const {
    sermons: dualSermons,
    loading: dualLoading,
    error: dualError,
    activeProvider,
    addSermon: dualAddSermon,
    updateSermon: dualUpdateSermon,
    deleteSermon: dualDeleteSermon,
    getFeaturedSermon: dualGetFeaturedSermon,
    refreshSermons: dualRefreshSermons
  } = useDualSermons();

  const [localSermons, setLocalSermons] = useState<Sermon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useLocalStorage, setUseLocalStorage] = useState(false);

  // Determine whether to use dual database or localStorage
  useEffect(() => {
    const shouldUseLocalStorage = localStorage.getItem('use_local_storage') === 'true';
    setUseLocalStorage(shouldUseLocalStorage);
    
    if (shouldUseLocalStorage) {
      // Load from localStorage (legacy support)
      loadFromLocalStorage();
    } else {
      // Use dual database system
      setLocalSermons(dualSermons);
      setLoading(dualLoading);
      setError(dualError);
    }
  }, [dualSermons, dualLoading, dualError]);

  // Load sermons from localStorage (legacy support)
  const loadFromLocalStorage = () => {
    try {
      setLoading(true);
      
      const savedSermons = localStorage.getItem('church_sermons');
      if (savedSermons) {
        try {
          const parsedSermons = JSON.parse(savedSermons);
          const processedSermons = parsedSermons.map((sermon: any) => ({
            ...sermon,
            date: sermon.date ? new Date(sermon.date) : new Date()
          }));
          console.log('Loaded sermons from localStorage:', processedSermons.length);
          setLocalSermons(processedSermons);
        } catch (parseError) {
          console.error('Error parsing sermons from localStorage:', parseError);
          setLocalSermons([]);
        }
      } else {
        console.log('No sermons in localStorage');
        setLocalSermons([]);
      }
      setError(null);
    } catch (err) {
      console.error('Error loading sermons:', err);
      setError('Failed to load sermons from localStorage.');
      setLocalSermons([]);
    } finally {
      setLoading(false);
    }
  };

  // Save sermons to localStorage when they change (if using localStorage)
  useEffect(() => {
    if (useLocalStorage && localSermons.length > 0 && !loading) {
      try {
        const sermonsCopy = localSermons.map(sermon => ({
          ...sermon,
          date: sermon.date instanceof Date ? sermon.date.toISOString() : sermon.date,
        }));
        
        localStorage.setItem('church_sermons', JSON.stringify(sermonsCopy));
        console.log('Saved sermons to localStorage:', localSermons.length);
        
        window.dispatchEvent(new Event('sermon-refresh'));
      } catch (err) {
        console.error('Error saving sermons to localStorage:', err);
      }
    }
  }, [localSermons, loading, useLocalStorage]);

  const addSermon = async (sermon: Omit<Sermon, 'id'>) => {
    if (useLocalStorage) {
      // Use localStorage (legacy behavior)
      const newSermon = createSermon(sermon);
      console.log('Adding new sermon to localStorage:', newSermon);
      setLocalSermons(prev => {
        const updated = [newSermon, ...prev];
        return updated;
      });
      return newSermon;
    } else {
      // Use dual database system
      return await dualAddSermon(sermon);
    }
  };

  const updateSermon = async (id: string, updatedSermon: Partial<Sermon>) => {
    if (useLocalStorage) {
      // Use localStorage (legacy behavior)
      console.log('Updating sermon in localStorage:', id, updatedSermon);
      setLocalSermons(prev => {
        const updated = updateSermonInList(prev, id, updatedSermon);
        return updated;
      });
    } else {
      // Use dual database system
      await dualUpdateSermon(id, updatedSermon);
    }
  };

  const deleteSermon = async (id: string) => {
    if (useLocalStorage) {
      // Use localStorage (legacy behavior)
      console.log('Deleting sermon from localStorage:', id);
      setLocalSermons(prev => {
        const updated = removeSermonFromList(prev, id);
        return updated;
      });
    } else {
      // Use dual database system
      await dualDeleteSermon(id);
    }
  };

  const getFeaturedSermon = (): Sermon | undefined => {
    if (useLocalStorage) {
      return findFeaturedSermon(localSermons);
    } else {
      return dualGetFeaturedSermon();
    }
  };

  // Method to switch between localStorage and database
  const toggleStorageMode = () => {
    const newMode = !useLocalStorage;
    setUseLocalStorage(newMode);
    localStorage.setItem('use_local_storage', newMode.toString());
    
    if (newMode) {
      loadFromLocalStorage();
    } else {
      dualRefreshSermons();
    }
  };

  // Get the appropriate sermon list
  const sermons = useLocalStorage ? localSermons : dualSermons;

  return {
    sermons,
    loading,
    error,
    addSermon,
    updateSermon,
    deleteSermon,
    getFeaturedSermon,
    // Additional properties for dual database support
    activeProvider: useLocalStorage ? 'localStorage' as const : activeProvider,
    useLocalStorage,
    toggleStorageMode,
    refreshSermons: useLocalStorage ? loadFromLocalStorage : dualRefreshSermons,
  };
};
