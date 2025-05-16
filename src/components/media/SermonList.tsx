
import React from 'react';
import { FileText } from 'lucide-react';
import SermonItem from './SermonItem';
import { Sermon } from '@/types/sermonTypes';
import { useLogo } from '@/components/layout/LogoContext';
import { useIsMobile } from '@/hooks/use-mobile';

interface SermonListProps {
  sermons: Sermon[];
  onEditSermon: (sermon: Sermon) => void;
  onDeleteSermon: (id: string) => void;
}

const SermonList = ({ sermons, onEditSermon, onDeleteSermon }: SermonListProps) => {
  const { logoUrl } = useLogo();
  const isMobile = useIsMobile();
  const defaultLogo = '/lovable-uploads/8c65fe13-b78a-486c-b18b-796c1ca1e52b.png';
  const pastorKobusImage = '/lovable-uploads/20736aa1-df4f-4d5b-b226-d41cb293bbe0.png';
  const pastorOtengImage = '/lovable-uploads/bb2cad8b-0655-4b9e-acde-059a018eba68.png';
  const pastorCynthiaImage = '/lovable-uploads/cfcf20f7-6921-4a44-b7ca-47809450d18c.png';
  const peterTaylorImage = '/lovable-uploads/a90674e8-ab9d-4607-97c5-e9553e6d0075.png';
  const thamoNaidooImage = '/lovable-uploads/8c68ccba-388a-445d-83c6-8adbd58c12de.png';
  
  React.useEffect(() => {
    // Force refresh when device type changes
    const handleDeviceChange = () => {
      console.log('Device changed, refreshing sermon list');
    };
    
    window.addEventListener('device-changed', handleDeviceChange);
    
    return () => {
      window.removeEventListener('device-changed', handleDeviceChange);
    };
  }, []);
  
  // Helper function to determine speaker image
  const getSpeakerImage = (sermon: Sermon) => {
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
            speakerImage: getSpeakerImage(sermon),
            thumbnailUrl: getSpeakerImage(sermon)
          }} 
          onEdit={onEditSermon} 
          onDelete={onDeleteSermon}
          isMobile={isMobile}
        />
      ))}
    </div>
  );
};

export default SermonList;
