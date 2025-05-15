
import React, { useState } from 'react';
import { Grid, List, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SermonListView from './SermonListView';
import SermonGridView from './SermonGridView';
import { Sermon } from '@/types/sermonTypes';

interface ViewSelectorProps {
  filteredSermons: Sermon[];
}

const ViewSelector = ({ filteredSermons }: ViewSelectorProps) => {
  const [activeView, setActiveView] = useState<'list' | 'grid'>('list');

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="text-sm text-church-neutral-600">
          {filteredSermons.length} sermon{filteredSermons.length !== 1 ? 's' : ''} found
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className={`${activeView === 'list' ? 'bg-church-neutral-100 text-church-neutral-900' : 'text-church-neutral-600'}`}
            onClick={() => setActiveView('list')}
            title="List View"
          >
            <List className="h-4 w-4 mr-1" />
            List
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className={`${activeView === 'grid' ? 'bg-church-neutral-100 text-church-neutral-900' : 'text-church-neutral-600'}`}
            onClick={() => setActiveView('grid')}
            title="Grid View"
          >
            <Grid className="h-4 w-4 mr-1" />
            Grid
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="text-church-neutral-600 hidden md:flex"
            title="Advanced Options"
          >
            <SlidersHorizontal className="h-4 w-4 mr-1" />
            Options
          </Button>
        </div>
      </div>
      
      {activeView === 'list' ? (
        <SermonListView sermons={filteredSermons} />
      ) : (
        <SermonGridView sermons={filteredSermons} />
      )}
    </div>
  );
};

export default ViewSelector;
