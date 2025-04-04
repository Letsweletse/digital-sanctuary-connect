
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SermonListView from './SermonListView';
import SermonGridView from './SermonGridView';
import { Sermon } from '@/types/sermonTypes';

interface ViewSelectorProps {
  activeView: string;
  setActiveView: (view: string) => void;
  filteredSermons: Sermon[];
}

const ViewSelector = ({ activeView, setActiveView, filteredSermons }: ViewSelectorProps) => {
  return (
    <Tabs value={activeView} onValueChange={setActiveView} className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-church-neutral-800">
          {filteredSermons.length} {filteredSermons.length === 1 ? 'Sermon' : 'Sermons'}
        </h2>
        <TabsList>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="grid">Grid View</TabsTrigger>
        </TabsList>
      </div>
      
      <TabsContent value="list" className="mt-0">
        <SermonListView sermons={filteredSermons} />
      </TabsContent>
      
      <TabsContent value="grid" className="mt-0">
        <SermonGridView sermons={filteredSermons} />
      </TabsContent>
    </Tabs>
  );
};

export default ViewSelector;
