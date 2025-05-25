
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import SermonForm from './SermonForm';
import SermonList from './SermonList';
import DatabaseSwitcher from '../admin/DatabaseSwitcher';
import { useSermonManager } from '@/hooks/useSermonManager';
import { useDualSermons } from '@/hooks/useDualSermons';

const SermonManager = () => {
  const {
    sermons,
    isAdding,
    isEditing,
    selectedSermon,
    resetState,
    handleEditSermon,
    handleDeleteSermon,
    handleSubmitSermon,
    startAddSermon
  } = useSermonManager();
  
  const {
    activeProvider,
    switchProvider,
    refreshSermons,
    loading
  } = useDualSermons();
  
  return (
    <div className="space-y-6">
      {/* Database Configuration */}
      <DatabaseSwitcher
        activeProvider={activeProvider}
        onSwitchProvider={switchProvider}
        onRefresh={refreshSermons}
        sermonCount={sermons.length}
        loading={loading}
      />
      
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
          <Button onClick={startAddSermon} className="flex items-center gap-1">
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
