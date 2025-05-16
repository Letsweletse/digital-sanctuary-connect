
import React from 'react';
import { format } from 'date-fns';
import { Calendar, User, Download, Play, Bookmark, Clock, BookmarkCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sermon } from '@/types/sermonTypes';
import { useIsMobile } from '@/hooks/use-mobile';
import { useLogo } from '@/components/layout/LogoContext';
import { isValidAudioUrl } from '@/components/media/utils/audioUrlUtils';

interface SermonGridViewProps {
  sermons: Sermon[];
}

const SermonGridView = ({ sermons }: SermonGridViewProps) => {
  const isMobile = useIsMobile();
  const { logoUrl } = useLogo();
  const defaultLogo = '/lovable-uploads/8c65fe13-b78a-486c-b18b-796c1ca1e52b.png';
  const pastorKobusImage = '/lovable-uploads/20736aa1-df4f-4d5b-b226-d41cb293bbe0.png';
  const pastorOtengImage = '/lovable-uploads/bb2cad8b-0655-4b9e-acde-059a018eba68.png';
  
  // Get the appropriate speaker image
  const getSpeakerImage = (speaker: string) => {
    if (speaker === 'Pastor Kobus Bezuidenhout') {
      return pastorKobusImage;
    }
    if (speaker === 'Pastor Oteng Leepile') {
      return pastorOtengImage;
    }
    return logoUrl || defaultLogo;
  };
  
  if (sermons.length === 0) {
    return (
      <div className="text-center py-10 bg-church-neutral-50 rounded-lg">
        <p className="text-church-neutral-600">No sermons match your search criteria.</p>
        <p className="text-church-neutral-500 text-sm mt-2">Try adjusting your filters or search terms.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {sermons.map((sermon) => (
        <div 
          key={sermon.id} 
          className="border border-church-neutral-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 bg-white flex flex-col h-full"
          itemScope 
          itemType="https://schema.org/AudioObject"
        >
          <div className="relative h-40 sm:h-44 bg-church-neutral-100">
            <img 
              src={getSpeakerImage(sermon.speaker)}
              alt={sermon.title}
              className="w-full h-full object-cover"
              itemProp="thumbnailUrl"
              loading={isMobile ? "eager" : "lazy"} // Load immediately on mobile
            />
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/70 to-transparent"></div>
            
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
            
            {/* Tags */}
            {sermon.tags && sermon.tags.length > 1 && (
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
            )}
            
            <div className="mt-auto pt-3 border-t border-church-neutral-200 flex justify-between items-center">
              <div className="flex items-center gap-2">
                {/* Audio Button */}
                {isValidAudioUrl(sermon.audioUrl) && (
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
                {isValidAudioUrl(sermon.audioUrl) && (
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
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SermonGridView;
