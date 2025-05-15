
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { formatDate } from './utils/audioPlayerUtils';
import { Sermon } from '@/types/sermonTypes';
import { useLogo } from '@/components/layout/LogoContext';

interface SermonInfoProps {
  sermon: Sermon;
}

const SermonInfo: React.FC<SermonInfoProps> = ({ sermon }) => {
  const { logoUrl } = useLogo();
  
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-3">
        <Avatar className="h-12 w-12 rounded-md shadow-sm">
          <AvatarImage 
            src={sermon.speakerImage || logoUrl || '/lovable-uploads/8c65fe13-b78a-486c-b18b-796c1ca1e52b.png'} 
            alt={sermon.speaker} 
          />
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
