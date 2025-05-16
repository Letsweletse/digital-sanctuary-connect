
import React from 'react';
import { FileText } from 'lucide-react';
import SermonItem from './SermonItem';
import { Sermon } from '@/types/sermonTypes';
import { useLogo } from '@/components/layout/LogoContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { getSpeakerImage } from './utils/speakerImageUtils';

interface SermonListProps {
  sermons: Sermon[];
  onEditSermon: (sermon: Sermon) => void;
  onDeleteSermon: (id: string) => void;
}

const SermonList = ({ sermons, onEditSermon, onDeleteSermon }: SermonListProps) => {
  const { logoUrl } = useLogo();
  const isMobile = useIsMobile();
  
  // Using a unique timestamp to force re-render of sermon items
  const [refreshKey, setRefreshKey] = React.useState(Date.now());
  
  React.useEffect(() => {
    // Force refresh when component mounts to ensure images load correctly
    setRefreshKey(Date.now());
    
    // Force refresh when device type changes
    const handleDeviceChange = () => {
      console.log('Device changed, refreshing sermon list');
      setRefreshKey(Date.now());
    };
    
    window.addEventListener('device-changed', handleDeviceChange);
    
    return () => {
      window.removeEventListener('device-changed', handleDeviceChange);
    };
  }, []);
  
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
    <div className="space-y-4" key={`sermon-list-${refreshKey}`}>
      {sermons.map(sermon => (
        <SermonItem 
          key={`${sermon.id}-${refreshKey}`} 
          sermon={{
            ...sermon,
            speakerImage: getSpeakerImage(sermon.speaker, logoUrl),
            thumbnailUrl: getSpeakerImage(sermon.speaker, logoUrl)
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
