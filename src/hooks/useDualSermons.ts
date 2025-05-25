
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Sermon } from '@/types/sermonTypes';
import { dualSermonService, DatabaseProvider } from '@/services/dualSermonService';
import { sermonsData } from '@/data/sermonsData';

export const useDualSermons = () => {
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeProvider, setActiveProvider] = useState<DatabaseProvider>('supabase');
  const { toast } = useToast();

  // Load sermons with fallback support
  const loadSermons = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try to load from dual service
      const result = await dualSermonService.getSermons();
      
      if (result.sermons.length > 0) {
        setSermons(result.sermons);
        setActiveProvider(result.provider);
        console.log(`Loaded ${result.sermons.length} sermons from ${result.provider}`);
      } else {
        // If no sermons found in either database, use local sample data
        console.log('No sermons found in databases, using sample data');
        setSermons(sermonsData);
        setActiveProvider('supabase'); // Default provider
        
        toast({
          title: "Using Sample Data",
          description: "No sermons found in databases. Displaying sample sermons.",
        });
      }
    } catch (err) {
      console.error('Failed to load sermons from both providers:', err);
      setError('Failed to load sermons from databases');
      
      // Fall back to local sample data
      setSermons(sermonsData);
      setActiveProvider('supabase');
      
      toast({
        title: "Database Connection Failed",
        description: "Using sample data. Check your database connections.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSermons();
  }, []);

  const addSermon = async (sermon: Omit<Sermon, 'id'>) => {
    try {
      const newSermon = await dualSermonService.addSermon(sermon);
      setSermons(prev => [newSermon, ...prev]);
      
      toast({
        title: "Sermon Added",
        description: `Sermon saved to ${activeProvider} database.`,
      });
      
      return newSermon;
    } catch (err) {
      console.error('Error adding sermon:', err);
      toast({
        title: "Error Adding Sermon",
        description: "Failed to save sermon to database.",
        variant: "destructive",
      });
      throw err;
    }
  };

  const updateSermon = async (id: string, updatedSermon: Partial<Sermon>) => {
    try {
      await dualSermonService.updateSermon(id, updatedSermon);
      setSermons(prev => 
        prev.map(sermon => 
          sermon.id === id ? { ...sermon, ...updatedSermon } : sermon
        )
      );
      
      toast({
        title: "Sermon Updated",
        description: `Sermon updated in ${activeProvider} database.`,
      });
    } catch (err) {
      console.error('Error updating sermon:', err);
      toast({
        title: "Error Updating Sermon",
        description: "Failed to update sermon in database.",
        variant: "destructive",
      });
      throw err;
    }
  };

  const deleteSermon = async (id: string) => {
    try {
      await dualSermonService.deleteSermon(id);
      setSermons(prev => prev.filter(sermon => sermon.id !== id));
      
      toast({
        title: "Sermon Deleted",
        description: `Sermon removed from ${activeProvider} database.`,
      });
    } catch (err) {
      console.error('Error deleting sermon:', err);
      toast({
        title: "Error Deleting Sermon",
        description: "Failed to delete sermon from database.",
        variant: "destructive",
      });
      throw err;
    }
  };

  const getFeaturedSermon = (): Sermon | undefined => {
    return sermons.find(sermon => sermon.featured);
  };

  const switchProvider = (provider: DatabaseProvider) => {
    dualSermonService.setPrimaryProvider(provider);
    setActiveProvider(provider);
    loadSermons(); // Reload sermons from new provider
    
    toast({
      title: "Provider Switched",
      description: `Now using ${provider} as primary database.`,
    });
  };

  const refreshSermons = () => {
    loadSermons();
  };

  return {
    sermons,
    loading,
    error,
    activeProvider,
    addSermon,
    updateSermon,
    deleteSermon,
    getFeaturedSermon,
    switchProvider,
    refreshSermons,
  };
};
