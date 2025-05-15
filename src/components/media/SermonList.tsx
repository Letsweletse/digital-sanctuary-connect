
import React from 'react';
import { FileText } from 'lucide-react';
import SermonItem from './SermonItem';
import { Sermon } from '@/types/sermonTypes';
import { useLogo } from '@/components/layout/LogoContext';

interface SermonListProps {
  sermons: Sermon[];
  onEditSermon: (sermon: Sermon) => void;
  onDeleteSermon: (id: string) => void;
}

const SermonList = ({ sermons, onEditSermon, onDeleteSermon }: SermonListProps) => {
  const { logoUrl } = useLogo();
  
  if (sermons.length === 0) {
    return (
      <div className="text-center py-12 bg-church-neutral-50 rounded-lg">
        <FileText className="w-12 h-12 text-church-neutral-400 mx-auto mb-4" />
        <h4 className="text-lg font-medium text-church-neutral-700">No sermons yet</h4>
        <p className="text-church-neutral-500">Add your first sermon to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sermons.map(sermon => (
        <SermonItem 
          key={sermon.id} 
          sermon={{
            ...sermon,
            speakerImage: sermon.speakerImage && !sermon.speakerImage.includes('placeholder') ? 
              sermon.speakerImage : logoUrl || '/lovable-uploads/8c65fe13-b78a-486c-b18b-796c1ca1e52b.png'
          }} 
          onEdit={onEditSermon} 
          onDelete={onDeleteSermon} 
        />
      ))}
    </div>
  );
};

export default SermonList;
