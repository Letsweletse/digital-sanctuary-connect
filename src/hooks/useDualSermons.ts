
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Sermon } from '@/types/sermonTypes';
import { dualSermonService, DatabaseProvider } from '@/services/dualSermonService';

export const useDualSermons = () => {
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeProvider, setActiveProvider] = useState<DatabaseProvider>('supabase');
  const { toast } = useToast();

  // Memoized load function to prevent infinite loops
  const loadSermons = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Loading sermons from dual service...');
      const result = await dualSermonService.getSermons();
      
      console.log('Dual service result:', result);
      
      setSermons(result.sermons);
      setActiveProvider(result.provider);
      
      console.log(`Successfully loaded ${result.sermons.length} sermons from ${result.provider}`);
      
      if (result.sermons.length === 0) {
        console.log('No sermons found - database may be empty');
      } else {
        console.log('Sermons loaded successfully');
        if (result.provider !== 'supabase') {
          toast({
            title: "Using Fallback Database",
            description: `Loaded sermons from ${result.provider} database.`,
          });
        }
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
  }, [toast]);

  // Initial load
  useEffect(() => {
    loadSermons();
  }, [loadSermons]);

  // Auto-refresh with better interval management
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('Auto-refreshing sermons...');
      loadSermons();
    }, 60000); // Increased to 60 seconds for better performance
    
    return () => clearInterval(interval);
  }, [loadSermons]);

  const addSermon = useCallback(async (sermon: Omit<Sermon, 'id'>) => {
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
  }, [activeProvider, toast]);

  const updateSermon = useCallback(async (id: string, updatedSermon: Partial<Sermon>) => {
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
  }, [activeProvider, toast]);

  const deleteSermon = useCallback(async (id: string) => {
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
  }, [activeProvider, toast]);

  const getFeaturedSermon = useCallback((): Sermon | undefined => {
    return sermons.find(sermon => sermon.featured);
  }, [sermons]);

  const switchProvider = useCallback((provider: DatabaseProvider) => {
    dualSermonService.setPrimaryProvider(provider);
    setActiveProvider(provider);
    loadSermons();
    
    toast({
      title: "Provider Switched",
      description: `Now using ${provider} as primary database.`,
    });
  }, [loadSermons, toast]);

  const refreshSermons = useCallback(() => {
    console.log('Manual refresh triggered');
    loadSermons();
  }, [loadSermons]);

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
