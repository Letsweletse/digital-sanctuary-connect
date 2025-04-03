
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { formatDate } from './utils/audioPlayerUtils';
import { Sermon } from '@/types/sermonTypes';

interface SermonPlaylistProps {
  sermons: Sermon[];
  currentIndex: number;
  onSermonSelect: (index: number) => void;
}

const SermonPlaylist: React.FC<SermonPlaylistProps> = ({ sermons, currentIndex, onSermonSelect }) => {
  return (
    <div className="mt-8 border-t border-church-neutral-200 pt-6">
      <h4 className="font-medium text-church-neutral-800 mb-4">More Sermons</h4>
      <div className="space-y-3">
        {sermons.map((sermon, index) => (
          <div 
            key={sermon.id}
            className={`p-3 rounded-lg cursor-pointer transition-colors ${
              index === currentIndex
                ? 'bg-church-blue-light/30 border border-church-blue-light'
                : 'hover:bg-church-neutral-100'
            }`}
            onClick={() => onSermonSelect(index)}
          >
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8 rounded-md">
                <AvatarImage src={sermon.speakerImage} alt={sermon.speaker} />
                <AvatarFallback className="rounded-md text-xs">{sermon.speaker?.charAt(0) || 'S'}</AvatarFallback>
              </Avatar>
              <div>
                <h5 className="font-medium text-church-neutral-900">{sermon.title}</h5>
                <p className="text-xs text-church-neutral-600">
                  {sermon.speaker} • {formatDate(sermon.date)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SermonPlaylist;
