
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Sermon } from '@/types/sermonTypes';
import { dualSermonService, DatabaseProvider } from '@/services/dualSermonService';

export const useDualSermons = () => {
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeProvider, setActiveProvider] = useState<DatabaseProvider>('supabase');
  const { toast } = useToast();

  // Load sermons with proper error handling
  const loadSermons = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Loading sermons from dual service...');
      const result = await dualSermonService.getSermons();
      
      setSermons(result.sermons);
      setActiveProvider(result.provider);
      
      console.log(`Successfully loaded ${result.sermons.length} sermons from ${result.provider}`);
      
      if (result.sermons.length === 0) {
        toast({
          title: "No Sermons Found",
          description: "No sermons are currently available in the database.",
        });
      } else if (result.provider !== 'supabase') {
        toast({
          title: "Using Fallback Database",
          description: `Loaded sermons from ${result.provider} database.`,
        });
      }
    } catch (err) {
      console.error('Failed to load sermons:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      setSermons([]);
      
      toast({
        title: "Database Connection Failed",
        description: "Unable to connect to sermon databases. Please check your connection.",
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
    loadSermons();
    
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
