
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useSermons } from '@/hooks/useSermons';
import { Sermon } from '@/types/sermonTypes';

export function useSermonManager() {
  const { sermons, addSermon, updateSermon, deleteSermon } = useSermons();
  const { toast } = useToast();
  
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedSermon, setSelectedSermon] = useState<Sermon | null>(null);
  
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
      toast({
        title: "Sermon deleted",
        description: "The sermon has been successfully deleted.",
      });
    }
  };
  
  // Handle form submission
  const handleSubmitSermon = (sermonData: Omit<Sermon, 'id'>) => {
    if (isEditing && selectedSermon) {
      // Update existing sermon
      updateSermon(selectedSermon.id, sermonData);
      
      toast({
        title: "Sermon updated",
        description: "The sermon has been successfully updated.",
      });
    } else {
      // Add new sermon
      const newSermon = addSermon(sermonData);
      
      toast({
        title: "Sermon added",
        description: "The sermon has been successfully added.",
      });
    }
    
    // Reset state
    resetState();
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
