
import React from 'react';
import { format } from 'date-fns';
import { Play, Download, AlertCircle, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Sermon } from '@/types/sermonTypes';
import { isValidAudioUrl } from '@/components/media/utils/audioUrlUtils';
import { useIsMobile } from '@/hooks/use-mobile';

interface SermonListViewProps {
  sermons: Sermon[];
}

const SermonListView = ({ sermons }: SermonListViewProps) => {
  const isMobile = useIsMobile();
  
  if (sermons.length === 0) {
    return (
      <div className="text-center py-10 bg-church-neutral-50 rounded-lg">
        <p className="text-church-neutral-600">No sermons match your search criteria.</p>
        <p className="text-church-neutral-500 text-sm mt-2">Try adjusting your filters or search terms.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-5xl mx-auto">
      {sermons.map((sermon) => (
        <div 
          key={sermon.id}
          className="bg-white rounded-xl shadow-md p-4 flex flex-col md:flex-row md:items-center justify-between"
        >
          <div>
            <h3 className="font-semibold text-gray-800">{sermon.title}</h3>
            <p className="text-sm text-gray-600">
              {sermon.speaker} • {format(new Date(sermon.date), 'MMM d, yyyy')}
            </p>
          </div>
          
          <div className="flex items-center gap-2 mt-2 md:mt-0">
            {isValidAudioUrl(sermon.audioUrl) ? (
              <Button
                className="inline-block text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm"
                asChild
              >
                <a href={`#sermon-${sermon.id}`} onClick={(e) => {
                  e.preventDefault();
                  // Here we could implement playback functionality
                  console.log('Playing sermon:', sermon.title);
                }}>
                  🎧 Listen
                </a>
              </Button>
            ) : (
              <Button
                className="inline-block text-white bg-gray-400 px-4 py-2 rounded text-sm cursor-not-allowed"
                disabled
              >
                🎧 Listen
              </Button>
            )}
            
            {sermon.youtubeId && (
              <Button
                variant="outline"
                className="hidden md:flex items-center gap-1"
                asChild
              >
                <a href={`https://www.youtube.com/watch?v=${sermon.youtubeId}`} target="_blank" rel="noopener noreferrer">
                  <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                  Watch
                </a>
              </Button>
            )}
            
            {isValidAudioUrl(sermon.audioUrl) && (
              <Button
                variant="outline"
                size="icon"
                className="hidden md:flex"
                asChild
                title="Download"
              >
                <a href={sermon.audioUrl} download target="_blank" rel="noopener noreferrer">
                  <Download className="h-4 w-4" />
                </a>
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SermonListView;
