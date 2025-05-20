
import React from 'react';
import { format } from 'date-fns';
import { User, Calendar } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Sermon } from '@/types/sermonTypes';
import SpotifySermonEmbed from '@/components/media/SpotifySermonEmbed';
import { useLogo } from '@/components/layout/LogoContext';
import { getSpeakerImage } from '@/components/media/utils/speakerImageUtils';

interface SpotifySermonCardProps {
  sermon: Sermon;
}

const SpotifySermonCard = ({ sermon }: SpotifySermonCardProps) => {
  const { logoUrl } = useLogo();
  
  // Only display sermons with Spotify episode IDs
  if (!sermon.spotifyEpisodeId) {
    return null;
  }

  return (
    <Card className="overflow-hidden border-church-neutral-200">
      <CardContent className="pt-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-row items-center gap-4">
            <Avatar className="h-12 w-12 rounded-md shadow-sm flex-shrink-0">
              <AvatarImage 
                src={getSpeakerImage(sermon.speaker, logoUrl)} 
                alt={sermon.speaker} 
              />
              <AvatarFallback className="rounded-md">{sermon.speaker?.charAt(0) || 'S'}</AvatarFallback>
            </Avatar>
            <div>
              <h4 className="text-md font-semibold text-church-neutral-900 line-clamp-1">
                {sermon.title}
              </h4>
              <div className="flex items-center gap-2 text-xs text-church-neutral-600">
                <span className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  {sermon.speaker}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {typeof sermon.date === 'string' 
                    ? format(new Date(sermon.date), 'MMM d, yyyy')
                    : format(sermon.date, 'MMM d, yyyy')}
                </span>
              </div>
            </div>
          </div>
          
          <SpotifySermonEmbed spotifyEpisodeId={sermon.spotifyEpisodeId} />
        </div>
      </CardContent>
    </Card>
  );
};

export default SpotifySermonCard;
