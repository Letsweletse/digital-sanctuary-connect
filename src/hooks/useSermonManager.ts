
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useSermons } from '@/hooks/useSermons';
import { Sermon } from '@/types/sermonTypes';
import { useIsMobile } from '@/hooks/use-mobile';

export function useSermonManager() {
  const { sermons, addSermon, updateSermon, deleteSermon } = useSermons();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedSermon, setSelectedSermon] = useState<Sermon | null>(null);
  
  // When component mounts or device changes, ensure mobile-compatible operation
  useEffect(() => {
    if (isMobile) {
      console.log('SermonManager running on mobile device');
    } else {
      console.log('SermonManager running on desktop device');
    }
    
    const handleDataRefresh = () => {
      console.log('Sermon data refresh event received');
    };
    
    window.addEventListener('sermon-refresh', handleDataRefresh);
    
    return () => {
      window.removeEventListener('sermon-refresh', handleDataRefresh);
    };
  }, [isMobile]);
  
  // Reset state
  const resetState = () => {
    setIsAdding(false);
    setIsEditing(false);
    setSelectedSermon(null);
  };
  
  // Handle edit sermon
  const handleEditSermon = (sermon: Sermon) => {
    setSelectedSermon(sermon);
    setIsEditing(true);
    setIsAdding(false);
  };
  
  // Handle delete sermon
  const handleDeleteSermon = (id: string) => {
    if (window.confirm('Are you sure you want to delete this sermon?')) {
      deleteSermon(id);
      
      // Show different toast styles based on device
      if (isMobile) {
        toast({
          title: "Sermon deleted",
          description: "The sermon has been successfully deleted.",
          duration: 3000, // Shorter duration for mobile
        });
      } else {
        toast({
          title: "Sermon deleted",
          description: "The sermon has been successfully deleted.",
        });
      }
    }
  };
  
  // Handle form submission
  const handleSubmitSermon = (sermonData: Omit<Sermon, 'id'>) => {
    try {
      if (isEditing && selectedSermon) {
        // Update existing sermon
        updateSermon(selectedSermon.id, sermonData);
        
        toast({
          title: "Sermon updated",
          description: "The sermon has been successfully updated.",
          variant: "default",
        });
      } else {
        // Add new sermon
        const newSermon = addSermon(sermonData);
        
        toast({
          title: "Sermon added",
          description: "The sermon has been successfully added.",
          variant: "default",
        });
        
        console.log('New sermon added:', newSermon);
      }
      
      // Force refresh on mobile devices to ensure updates are visible
      if (isMobile) {
        setTimeout(() => {
          window.dispatchEvent(new Event('sermon-refresh'));
        }, 300);
      }
      
      // Reset state
      resetState();
      return true;
    } catch (error) {
      console.error('Error submitting sermon:', error);
      toast({
        title: "Error",
        description: "There was a problem saving the sermon. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  // Handle starting the add process
  const startAddSermon = () => {
    setIsAdding(true);
    setIsEditing(false);
    setSelectedSermon(null);
  };

  return {
    sermons,
    isAdding,
    isEditing,
    selectedSermon,
    resetState,
    handleEditSermon,
    handleDeleteSermon,
    handleSubmitSermon,
    startAddSermon
  };
}
