
import React, { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import SermonForm from './SermonForm';
import SermonList from './SermonList';
import { useSermons } from '@/hooks/useSermons';
import { Sermon } from '@/types/sermonTypes';

const SermonManager = () => {
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
    if (confirm('Are you sure you want to delete this sermon?')) {
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
  
  return (
    <div className="space-y-6">
      {/* Add/Edit form */}
      {(isAdding || isEditing) ? (
        <SermonForm
          sermon={selectedSermon || undefined}
          onSubmit={handleSubmitSermon}
          onCancel={resetState}
          isEditing={isEditing}
        />
      ) : (
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-church-neutral-900">
            Sermon Library
          </h3>
          <Button onClick={() => setIsAdding(true)} className="flex items-center gap-1">
            <Plus className="w-4 h-4" /> Add Sermon
          </Button>
        </div>
      )}
      
      {/* Sermons list */}
      {!isAdding && !isEditing && (
        <SermonList 
          sermons={sermons} 
          onEditSermon={handleEditSermon} 
          onDeleteSermon={handleDeleteSermon}
        />
      )}
    </div>
  );
};

export default SermonManager;
