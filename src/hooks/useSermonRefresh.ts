import { useEffect, useCallback } from 'react';
import { Sermon } from '@/types/sermonTypes';
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/components/ui/use-toast';

export const useSermonRefresh = (
  customSermons?: Sermon[],
  fetchedSermons?: Sermon[],
  defaultSermons?: Sermon[],
  currentSermonIndex: number = 0,
  setLocalSermons?: (sermons: Sermon[]) => void,
  setCurrentSermonIndex?: (index: number) => void
) => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  
  // Create a memoized refresh function to prevent infinite loops
  const refreshSermons = useCallback(() => {
    console.log('Triggering sermon refresh...');
    
    if (!setLocalSermons) {
      console.log('No setLocalSermons function provided, skipping refresh');
      return;
    }
    
    // Determine which sermons to use with better priority logic
    const sermonsToUse = customSermons?.length 
      ? customSermons 
      : fetchedSermons?.length 
        ? fetchedSermons 
        : defaultSermons || [];
    
    console.log('Refreshing with sermons:', sermonsToUse.length);
    
    if (sermonsToUse.length > 0) {
      setLocalSermons(sermonsToUse);
      
      // Keep current index if possible or reset to beginning
      if (setCurrentSermonIndex) {
        const newIndex = currentSermonIndex >= sermonsToUse.length ? 0 : currentSermonIndex;
        setCurrentSermonIndex(newIndex);
        console.log('Setting sermon index to:', newIndex);
      }
      
      // Dispatch global refresh event for other components
      window.dispatchEvent(new CustomEvent('sermon-refresh', { 
        detail: { sermons: sermonsToUse } 
      }));
      
      // Show success toast
      toast({
        title: "Sermons refreshed",
        description: `${sermonsToUse.length} sermons are now available`,
        variant: "default",
      });
    } else {
      console.warn('No sermons found during refresh');
      toast({
        title: "No sermons found",
        description: "Unable to find any sermon data. Please check your connection.",
        variant: "destructive",
      });
    }
  }, [customSermons, fetchedSermons, defaultSermons, currentSermonIndex, setLocalSermons, setCurrentSermonIndex, toast]);
  
  // Handle sermon refresh event listener
  useEffect(() => {
    const handleSermonRefresh = () => {
      console.log('Sermon refresh event received');
      refreshSermons();
    };
    
    window.addEventListener('sermon-refresh', handleSermonRefresh);
    
    return () => {
      window.removeEventListener('sermon-refresh', handleSermonRefresh);
    };
  }, [refreshSermons]);
  
  // Initial refresh on mount with delay for component stability
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      console.log('Initial sermon refresh on mount');
      refreshSermons();
    }, 100); // Reduced delay for better responsiveness
    
    return () => clearTimeout(timeoutId);
  }, [refreshSermons]);
  
  // Track mobile state changes
  useEffect(() => {
    if (isMobile) {
      console.log('Component mounted on mobile - triggering refresh');
      refreshSermons();
    }
    
    return () => {
      if (isMobile) {
        console.log('Component unmounted on mobile');
      }
    };
  }, [isMobile, refreshSermons]);
  
  return { 
    isMobile, 
    refreshSermons 
  };
};
