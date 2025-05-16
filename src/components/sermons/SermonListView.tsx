import React from 'react';
import { format } from 'date-fns';
import { Play, Download, ExternalLink, Calendar, Clock, User, Bookmark, BookmarkCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Sermon } from '@/types/sermonTypes';
import { isValidAudioUrl } from '@/components/media/utils/audioUrlUtils';
import { useLogo } from '@/components/layout/LogoContext';

interface SermonListViewProps {
  sermons: Sermon[];
}

const SermonListView = ({ sermons }: SermonListViewProps) => {
  const { logoUrl } = useLogo();
  const defaultLogo = '/lovable-uploads/8c65fe13-b78a-486c-b18b-796c1ca1e52b.png';
  const pastorKobusImage = '/lovable-uploads/20736aa1-df4f-4d5b-b226-d41cb293bbe0.png';
  const pastorOtengImage = '/lovable-uploads/bb2cad8b-0655-4b9e-acde-059a018eba68.png';
  const pastorCynthiaImage = '/lovable-uploads/cfcf20f7-6921-4a44-b7ca-47809450d18c.png';

  // Get the appropriate speaker image
  const getSpeakerImage = (speaker: string) => {
    if (speaker === 'Pastor Kobus Bezuidenhout') {
      return pastorKobusImage;
    }
    if (speaker === 'Pastor Oteng Leepile') {
      return pastorOtengImage;
    }
    if (speaker === 'Pastor Cynthia Harman') {
      return pastorCynthiaImage;
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
    <div className="space-y-4">
      {sermons.map((sermon) => (
        <div 
          key={sermon.id} 
          className="border border-church-neutral-200 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-all duration-300"
        >
          <div className="p-4 md:p-5 flex flex-col sm:flex-row items-start gap-4">
            {/* Left Side: Speaker Image and Sermon Date */}
            <div className="flex flex-col items-center space-y-2 sm:w-28">
              <Avatar className="h-16 w-16 rounded-md shadow-sm flex-shrink-0">
                <AvatarImage 
                  src={getSpeakerImage(sermon.speaker)} 
                  alt={sermon.speaker} 
                />
                <AvatarFallback className="rounded-md">
                  {sermon.speaker?.charAt(0) || 'S'}
                </AvatarFallback>
              </Avatar>
              
              <div className="text-xs text-center text-church-neutral-500 flex flex-col items-center">
                <Calendar className="h-3 w-3 mb-1" />
                {format(new Date(sermon.date), 'MMM d, yyyy')}
              </div>
            </div>
            
            <div className="flex-1">
              {/* Series Tag (if available) */}
              {sermon.series && (
                <Badge variant="outline" className="text-church-blue text-xs mb-2">
                  {sermon.series}
                </Badge>
              )}
              
              {/* Title */}
              <h3 className="font-bold text-lg text-church-neutral-900 mb-1 hover:text-church-blue cursor-pointer transition-colors">
                {sermon.title}
              </h3>
              
              {/* Speaker and Additional Info */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-2 text-sm text-church-neutral-600">
                <span className="flex items-center gap-1">
                  <User className="h-3.5 w-3.5" />
                  {sermon.speaker}
                </span>
                
                {sermon.duration && (
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {sermon.duration}
                  </span>
                )}
                
                {sermon.downloads > 0 && (
                  <span className="flex items-center gap-1">
                    <Download className="h-3.5 w-3.5" />
                    {sermon.downloads} downloads
                  </span>
                )}
              </div>
              
              {/* Description (if available) */}
              {sermon.description && (
                <p className="text-sm text-church-neutral-700 mb-3 line-clamp-2">
                  {sermon.description}
                </p>
              )}
              
              {/* Tags */}
              {sermon.tags && sermon.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
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
              
              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 mt-2">
                {/* Listen Audio Button */}
                {isValidAudioUrl(sermon.audioUrl) ? (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-1 text-church-blue"
                    onClick={() => {
                      // Dispatch custom event to play this sermon in the audio player
                      const event = new CustomEvent('sermon-play', { 
                        detail: { sermonId: sermon.id } 
                      });
                      window.dispatchEvent(event);
                    }}
                  >
                    <Play className="h-3 w-3" />
                    Listen
                  </Button>
                ) : null}
                
                {/* YouTube Button */}
                {sermon.youtubeId && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-red-500 flex items-center gap-1"
                    asChild
                  >
                    <a href={`https://www.youtube.com/watch?v=${sermon.youtubeId}`} target="_blank" rel="noopener noreferrer">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                      </svg>
                      Watch
                    </a>
                  </Button>
                )}
                
                {/* Download Button */}
                {isValidAudioUrl(sermon.audioUrl) && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-1 text-church-neutral-600"
                    asChild
                  >
                    <a href={sermon.audioUrl} download target="_blank" rel="noopener noreferrer">
                      <Download className="h-3 w-3" />
                      Download
                    </a>
                  </Button>
                )}
                
                {/* Save Button */}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="flex items-center gap-1 text-church-neutral-500 hover:text-church-blue ml-auto"
                  title="Save to favorites"
                >
                  <Bookmark className="h-3 w-3" />
                  <span className="hidden sm:inline">Save</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SermonListView;
