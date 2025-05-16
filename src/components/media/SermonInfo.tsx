
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
  const defaultLogo = '/lovable-uploads/8c65fe13-b78a-486c-b18b-796c1ca1e52b.png';
  const pastorKobusImage = '/lovable-uploads/20736aa1-df4f-4d5b-b226-d41cb293bbe0.png';
  const pastorOtengImage = '/lovable-uploads/bb2cad8b-0655-4b9e-acde-059a018eba68.png';
  const pastorCynthiaImage = '/lovable-uploads/cfcf20f7-6921-4a44-b7ca-47809450d18c.png';
  const peterTaylorImage = '/lovable-uploads/a90674e8-ab9d-4607-97c5-e9553e6d0075.png';
  const thamoNaidooImage = '/lovable-uploads/8c68ccba-388a-445d-83c6-8adbd58c12de.png';
  
  // Get the appropriate speaker image
  const getSpeakerImage = () => {
    if (sermon.speaker === 'Pastor Kobus Bezuidenhout') {
      return pastorKobusImage;
    }
    if (sermon.speaker === 'Pastor Oteng Leepile') {
      return pastorOtengImage;
    }
    if (sermon.speaker === 'Pastor Cynthia Harman') {
      return pastorCynthiaImage;
    }
    if (sermon.speaker === 'Peter Taylor') {
      return peterTaylorImage;
    }
    if (sermon.speaker === 'Thamo Naidoo') {
      return thamoNaidooImage;
    }
    return sermon.speakerImage || logoUrl || defaultLogo;
  };
  
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-3">
        <Avatar className="h-12 w-12 rounded-md shadow-sm">
          <AvatarImage 
            src={getSpeakerImage()} 
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
