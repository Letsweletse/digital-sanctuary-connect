
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

  // Debug to see what sermons are being provided to the component
  console.log('SermonListView received sermons:', sermons);

  return (
    <div className="border rounded-md overflow-hidden bg-white">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-church-neutral-100">
            <th className="py-2 md:py-3 px-2 md:px-4 text-left font-medium text-church-neutral-700">Title</th>
            <th className="py-2 md:py-3 px-2 md:px-4 text-left font-medium text-church-neutral-700 hidden md:table-cell">Speaker</th>
            <th className="py-2 md:py-3 px-2 md:px-4 text-left font-medium text-church-neutral-700 hidden sm:table-cell">Date</th>
            <th className="py-2 md:py-3 px-2 md:px-4 text-center font-medium text-church-neutral-700">
              {isMobile ? 'Play' : 'Listen'}
            </th>
          </tr>
        </thead>
        <tbody>
          {sermons.map((sermon, index) => (
            <tr 
              key={sermon.id} 
              className={cn(
                "hover:bg-church-neutral-50 transition-colors", 
                index % 2 === 0 ? "bg-white" : "bg-church-neutral-50/50"
              )}
            >
              <td className="py-2 md:py-3 px-2 md:px-4 border-t border-church-neutral-200">
                <div>
                  <p className="font-medium text-church-blue hover:text-church-blue-dark transition-colors cursor-pointer text-xs md:text-sm">
                    {sermon.title}
                  </p>
                  <p className="text-xs text-church-neutral-500 mt-1 sm:hidden">
                    {sermon.speaker} • {format(new Date(sermon.date), 'MMM d, yyyy')}
                  </p>
                </div>
              </td>
              <td className="py-2 md:py-3 px-2 md:px-4 border-t border-church-neutral-200 text-church-neutral-600 hidden md:table-cell">
                {sermon.speaker}
              </td>
              <td className="py-2 md:py-3 px-2 md:px-4 border-t border-church-neutral-200 text-church-neutral-600 hidden sm:table-cell">
                {format(new Date(sermon.date), 'MMM d, yyyy')}
              </td>
              <td className="py-2 md:py-3 px-2 md:px-4 border-t border-church-neutral-200 text-center">
                <div className="flex justify-center gap-1 md:gap-2">
                  {isValidAudioUrl(sermon.audioUrl) ? (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      title="Listen" 
                      className="h-6 w-6 md:h-8 md:w-8"
                    >
                      <Play className="h-3 w-3 md:h-4 md:w-4 text-church-blue" />
                    </Button>
                  ) : (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      title="No audio available" 
                      disabled
                      className="h-6 w-6 md:h-8 md:w-8"
                    >
                      <AlertCircle className="h-3 w-3 md:h-4 md:w-4 text-church-neutral-400" />
                    </Button>
                  )}
                  
                  {sermon.youtubeId && (
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="text-red-500 h-6 w-6 md:h-8 md:w-8"
                      title="Watch on YouTube"
                      asChild
                    >
                      <a href={`https://www.youtube.com/watch?v=${sermon.youtubeId}`} target="_blank" rel="noopener noreferrer">
                        <svg className="w-3 h-3 md:w-4 md:h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                        </svg>
                      </a>
                    </Button>
                  )}
                  
                  {isValidAudioUrl(sermon.audioUrl) && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      title="Download"
                      asChild
                      className="h-6 w-6 md:h-8 md:w-8"
                    >
                      <a href={sermon.audioUrl} download target="_blank" rel="noopener noreferrer">
                        <Download className="h-3 w-3 md:h-4 md:w-4 text-church-neutral-600" />
                      </a>
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SermonListView;
