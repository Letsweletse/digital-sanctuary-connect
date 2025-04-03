
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { formatDate } from './utils/audioPlayerUtils';
import { Sermon } from '@/types/sermonTypes';

interface SermonInfoProps {
  sermon: Sermon;
}

const SermonInfo: React.FC<SermonInfoProps> = ({ sermon }) => {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-3">
        <Avatar className="h-12 w-12 rounded-md shadow-sm">
          <AvatarImage src={sermon.speakerImage} alt={sermon.speaker} />
          <AvatarFallback className="rounded-md">{sermon.speaker?.charAt(0) || 'S'}</AvatarFallback>
        </Avatar>
        <div>
          <h4 className="text-lg font-bold text-church-neutral-900">{sermon.title}</h4>
          <p className="text-sm text-church-neutral-600">
            {sermon.speaker} • {formatDate(sermon.date)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SermonInfo;
