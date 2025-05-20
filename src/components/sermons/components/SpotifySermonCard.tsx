
import React from 'react';
import { format } from 'date-fns';
import { Calendar, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Sermon } from '@/types/sermonTypes';
import SpotifySermonEmbed from '@/components/media/SpotifySermonEmbed';
import { useLogo } from '@/components/layout/LogoContext';
import { getSpeakerImage } from '@/components/media/utils/speakerImageUtils';

interface SpotifySermonCardProps {
  sermon: Sermon;
}

const SpotifySermonCard: React.FC<SpotifySermonCardProps> = ({ sermon }) => {
  const { logoUrl } = useLogo();
  
  // For this example, we're using a fixed Spotify episode ID
  // In real implementation, this would come from your sermon data
  const spotifyEpisodeId = "7makk4oTQel546B0PZlDM5"; // Example ID
  
  return (
    <div className="border border-church-neutral-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 bg-white flex flex-col h-full">
      <div className="p-4">
        <div className="flex items-center gap-4 mb-4">
          <img 
            src={getSpeakerImage(sermon.speaker, logoUrl)}
            alt={sermon.speaker}
            className="w-16 h-16 rounded-full object-cover"
          />
          <div>
            <h3 className="font-bold text-lg text-church-neutral-900 mb-1">
              {sermon.title}
            </h3>
            <div className="flex flex-wrap items-center gap-2 text-sm text-church-neutral-600">
              <span className="flex items-center gap-1">
                <User className="h-3.5 w-3.5" />
                {sermon.speaker}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {format(new Date(sermon.date), 'MMMM d, yyyy')}
              </span>
            </div>
          </div>
        </div>
        
        {/* Spotify player embed */}
        <SpotifySermonEmbed spotifyEpisodeId={spotifyEpisodeId} />
        
        {/* Tags */}
        {sermon.tags && sermon.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-4">
            {sermon.tags.map((tag, index) => (
              <Badge 
                key={index} 
                variant="secondary"
                className="bg-church-neutral-100 hover:bg-church-neutral-200 text-church-neutral-700 text-xs"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SpotifySermonCard;
