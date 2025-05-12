import { useEffect } from 'react';
import { Sermon } from '@/types/sermonTypes';
import { useIsMobile } from '@/hooks/use-mobile';

export const useSermonRefresh = (
  customSermons?: Sermon[],
  fetchedSermons?: Sermon[],
  defaultSermons?: Sermon[],
  currentSermonIndex: number = 0,
  setLocalSermons?: (sermons: Sermon[]) => void,
  setCurrentSermonIndex?: (index: number) => void
) => {
  const isMobile = useIsMobile();
  
  // Handle sermon refresh event (especially for mobile)
  useEffect(() => {
    const handleSermonRefresh = () => {
      console.log('Sermon refresh event received');
      
      if (!setLocalSermons) return;
      
      // Force refresh sermons data
      const sermonsToUse = customSermons || fetchedSermons || defaultSermons || [];
      console.log('Refreshing with sermons:', sermonsToUse.length);
      
      setLocalSermons(sermonsToUse);
      // Keep current index if possible
      if (setCurrentSermonIndex && currentSermonIndex >= sermonsToUse.length) {
        setCurrentSermonIndex(0);
      }
    };
    
    window.addEventListener('sermon-refresh', handleSermonRefresh);
    return () => {
      window.removeEventListener('sermon-refresh', handleSermonRefresh);
    };
  }, [customSermons, fetchedSermons, defaultSermons, currentSermonIndex, setLocalSermons, setCurrentSermonIndex]);
  
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
  
  return { isMobile };
};
