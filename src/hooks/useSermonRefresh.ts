import { useEffect } from 'react';
import { Sermon } from '@/types/sermonTypes';
import { useIsMobile } from '@/hooks/use-mobile';
import { refreshSermons } from '@/components/media/utils/audioPlayerUtils';
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
  
  // Handle sermon refresh event (especially for mobile)
  useEffect(() => {
    const handleSermonRefresh = () => {
      console.log('Sermon refresh event received');
      
      if (!setLocalSermons) {
        console.log('No setLocalSermons function provided, skipping refresh');
        return;
      }
      
      // Force refresh sermons data
      const sermonsToUse = customSermons || fetchedSermons || defaultSermons || [];
      console.log('Refreshing with sermons:', sermonsToUse.length);
      
      if (sermonsToUse.length > 0) {
        setLocalSermons(sermonsToUse);
        
        // Keep current index if possible or reset to beginning
        if (setCurrentSermonIndex) {
          const newIndex = currentSermonIndex >= sermonsToUse.length ? 0 : currentSermonIndex;
          setCurrentSermonIndex(newIndex);
          console.log('Setting sermon index to:', newIndex);
        }
        
        // Show toast notification for successful refresh
        toast({
          title: "Sermons refreshed",
          description: `${sermonsToUse.length} sermons are now available for playback`,
          variant: "default",
        });
      } else {
        // Show warning message if no sermons found
        toast({
          title: "No sermons found",
          description: "Unable to find any sermon data to refresh",
          variant: "destructive",
        });
      }
    };
    
    window.addEventListener('sermon-refresh', handleSermonRefresh);
    
    // Initial refresh on mount
    setTimeout(() => {
      // Add small delay to ensure component is fully mounted
      refreshSermons();
    }, 500);
    
    return () => {
      window.removeEventListener('sermon-refresh', handleSermonRefresh);
    };
  }, [customSermons, fetchedSermons, defaultSermons, currentSermonIndex, setLocalSermons, setCurrentSermonIndex, toast]);
  
  // Track when component mounts/unmounts on mobile
  useEffect(() => {
    if (isMobile) {
      console.log('AudioSermonPlayer mounted on mobile');
    }
    
    return () => {
      if (isMobile) {
        console.log('AudioSermonPlayer unmounted on mobile');
      }
    };
  }, [isMobile]);
  
  return { isMobile, refreshSermons };
};
