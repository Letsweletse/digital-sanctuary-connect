
import React from 'react';
import { format } from 'date-fns';
import { Play, Download, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
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
          <div className="p-4 flex flex-col sm:flex-row items-start gap-4">
            {/* Speaker Image - Using Church Logo */}
            <Avatar className="h-16 w-16 rounded-md shadow-sm flex-shrink-0">
              <AvatarImage 
                src={logoUrl || defaultLogo} 
                alt={sermon.speaker} 
              />
              <AvatarFallback className="rounded-md">
                {sermon.speaker?.charAt(0) || 'S'}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              {/* Speaker Name and Title */}
              <div>
                <p className="text-sm text-church-neutral-600 mb-1">
                  {sermon.speaker}
                </p>
                <h3 className="font-semibold text-lg text-church-neutral-800 mb-1">
                  {sermon.title}
                </h3>
                <p className="text-xs text-church-neutral-500">
                  {format(new Date(sermon.date), 'MMMM d, yyyy')}
                </p>
              </div>
              
              {/* Action Buttons */}
              <div className="flex mt-3 gap-2 flex-wrap">
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
                      YouTube
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
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SermonListView;
