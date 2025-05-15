
import React from 'react';
import SermonListView from './SermonListView';
import { Sermon } from '@/types/sermonTypes';

interface ViewSelectorProps {
  filteredSermons: Sermon[];
}

const ViewSelector = ({ filteredSermons }: ViewSelectorProps) => {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-medium text-church-neutral-800 mb-4">
        {filteredSermons.length} {filteredSermons.length === 1 ? 'Sermon' : 'Sermons'}
      </h2>
      
      <SermonListView sermons={filteredSermons} />
    </div>
  );
};

export default ViewSelector;
