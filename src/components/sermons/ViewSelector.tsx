
import React from 'react';
import SermonListView from './SermonListView';
import { Sermon } from '@/types/sermonTypes';

interface ViewSelectorProps {
  filteredSermons: Sermon[];
}

const ViewSelector = ({ filteredSermons }: ViewSelectorProps) => {
  return <SermonListView sermons={filteredSermons} />;
};

export default ViewSelector;
