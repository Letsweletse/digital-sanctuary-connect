
import React from 'react';
import { format } from 'date-fns';
import { Calendar, User, Download, Play, Bookmark, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sermon } from '@/types/sermonTypes';
import { isValidAudioUrl } from '@/components/media/utils/audioUrlUtils';
import { getSpeakerImage } from '@/components/media/utils/speakerImageUtils';
import { useLogo } from '@/components/layout/LogoContext';

interface SermonCardProps {
  sermon: Sermon;
  isMobile: boolean;
}

const SermonCard: React.FC<SermonCardProps> = ({ sermon, isMobile }) => {
  const { logoUrl } = useLogo();
  
  // Create a unique key for image to force refresh
  const imageKey = `sermon-img-${sermon.id}-${sermon.speaker}`;
  
  return (
    <div 
      className="border border-church-neutral-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 bg-white flex flex-col h-full"
      itemScope 
      itemType="https://schema.org/AudioObject"
    >
      <div className="relative h-40 sm:h-44 bg-church-neutral-100">
        <img 
          key={imageKey}
          src={getSpeakerImage(sermon.speaker, logoUrl)}
          alt={sermon.title}
          className="w-full h-full object-cover"
          itemProp="thumbnailUrl"
          loading={isMobile ? "eager" : "lazy"} // Load immediately on mobile
        />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/70 to-transparent"></div>
        
        <SermonCardBadges sermon={sermon} />
        
        <div className="absolute bottom-3 left-3 right-3">
          <div className="flex items-center gap-2 text-white/90 text-xs mb-1">
            <User className="h-3 w-3" />
            <span itemProp="author" className="font-medium">
              {sermon.speaker}
            </span>
          </div>
          <h3 className="text-white font-bold text-md mb-1 line-clamp-2" itemProp="name">
            {sermon.title}
          </h3>
          <div className="flex items-center gap-2 text-white/80 text-xs">
            <Calendar className="h-3 w-3" />
            <span itemProp="datePublished">
              {format(new Date(sermon.date), 'MMM d, yyyy')}
            </span>
            
            {sermon.duration && (
              <>
                <span className="mx-1">•</span>
                <Clock className="h-3 w-3" />
                <span>{sermon.duration}</span>
              </>
            )}
          </div>
        </div>
      </div>
      
      <div className="p-3 md:p-4 flex-grow flex flex-col">
        {/* Description */}
        {sermon.description && (
          <p className="text-xs md:text-sm text-church-neutral-600 mb-3 md:mb-4 line-clamp-2" itemProp="description">
            {sermon.description}
          </p>
        )}
        
        <SermonCardTags sermon={sermon} />
        
        <div className="mt-auto pt-3 border-t border-church-neutral-200 flex justify-between items-center">
          <SermonCardActions sermon={sermon} />
        </div>
      </div>
    </div>
  );
};

// Subcomponent for badges
const SermonCardBadges: React.FC<{ sermon: Sermon }> = ({ sermon }) => {
  return (
    <>
      {sermon.series && (
        <div className="absolute top-3 left-3">
          <Badge className="bg-church-blue/90 text-white text-xs">
            {sermon.series}
          </Badge>
        </div>
      )}
      
      {sermon.tags && sermon.tags.length > 0 && (
        <div className="absolute top-3 right-3">
          <Badge className="bg-church-gold/90 text-church-neutral-900 text-xs">
            {sermon.tags[0]}
          </Badge>
        </div>
      )}
    </>
  );
};

// Subcomponent for tags
const SermonCardTags: React.FC<{ sermon: Sermon }> = ({ sermon }) => {
  if (!sermon.tags || sermon.tags.length <= 1) return null;
  
  return (
    <div className="flex flex-wrap gap-1 mb-3">
      {sermon.tags.slice(1, 4).map((tag, index) => (
        <Badge 
          key={index} 
          variant="secondary"
          className="bg-church-neutral-100 hover:bg-church-neutral-200 text-church-neutral-700 text-xs"
        >
          {tag}
        </Badge>
      ))}
      {sermon.tags.length > 4 && (
        <Badge variant="secondary" className="bg-church-neutral-100 text-church-neutral-700 text-xs">
          +{sermon.tags.length - 4}
        </Badge>
      )}
    </div>
  );
};

// Subcomponent for action buttons
const SermonCardActions: React.FC<{ sermon: Sermon }> = ({ sermon }) => {
  const hasAudio = isValidAudioUrl(sermon.audioUrl);
  
  return (
    <>
      <div className="flex items-center gap-2">
        {/* Audio Button */}
        {hasAudio && (
          <Button 
            variant="outline" 
            size="sm" 
            className="text-church-blue flex items-center gap-1 text-xs md:text-sm py-1 h-8"
            onClick={() => {
              // Dispatch custom event to play this sermon in the audio player
              const event = new CustomEvent('sermon-play', { 
                detail: { sermonId: sermon.id } 
              });
              window.dispatchEvent(event);
            }}
          >
            <Play className="h-3 w-3 md:h-3.5 md:w-3.5" />
            Listen
          </Button>
        )}
        
        {/* Spotify Button */}
        {sermon.spotifyEpisodeId && (
          <Button 
            variant="outline" 
            size="sm"
            className="text-green-500 flex items-center gap-1 text-xs md:text-sm py-1 h-8"
            asChild
          >
            <a href={`https://open.spotify.com/episode/${sermon.spotifyEpisodeId}`} target="_blank" rel="noopener noreferrer">
              <svg className="w-3 h-3 md:w-3.5 md:h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
              </svg>
              Spotify
            </a>
          </Button>
        )}
        
        {/* YouTube Button */}
        {sermon.youtubeId && (
          <Button 
            variant="outline"
            size="sm"
            className="text-red-500 flex items-center gap-1 text-xs md:text-sm py-1 h-8"
            asChild
          >
            <a href={`https://www.youtube.com/watch?v=${sermon.youtubeId}`} target="_blank" rel="noopener noreferrer">
              <svg className="w-3 h-3 md:w-3.5 md:h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              Watch
            </a>
          </Button>
        )}
      </div>
      
      <div className="flex items-center">
        {/* Save Button */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-church-neutral-500 hover:text-church-blue h-8 w-8"
          title="Save to favorites"
        >
          <Bookmark className="h-3.5 w-3.5" />
        </Button>
        
        {/* Download Button */}
        {hasAudio && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-church-neutral-500 hover:text-church-blue h-8 w-8"
            title="Download"
            asChild
          >
            <a href={sermon.audioUrl} download target="_blank" rel="noopener noreferrer">
              <Download className="h-3.5 w-3.5" />
            </a>
          </Button>
        )}
      </div>
    </>
  );
};

export default SermonCard;
