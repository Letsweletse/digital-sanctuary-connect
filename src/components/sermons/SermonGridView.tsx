
import React from 'react';
import { format } from 'date-fns';
import { Calendar, User, Download, Play } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sermon } from '@/types/sermonTypes';

interface SermonGridViewProps {
  sermons: Sermon[];
}

const SermonGridView = ({ sermons }: SermonGridViewProps) => {
  if (sermons.length === 0) {
    return (
      <div className="text-center py-10 bg-church-neutral-50 rounded-lg">
        <p className="text-church-neutral-600">No sermons match your search criteria.</p>
        <p className="text-church-neutral-500 text-sm mt-2">Try adjusting your filters or search terms.</p>
      </div>
    );
  }

  // Default sermon image
  const defaultSermonImage = "https://lovable.dev/projects/b4242310-0169-49ed-bc97-e6669ce1cf89";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sermons.map((sermon) => (
        <div 
          key={sermon.id} 
          className="border border-church-neutral-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
          itemScope 
          itemType="https://schema.org/AudioObject"
        >
          <div className="relative h-48 bg-church-neutral-100">
            <img 
              src={defaultSermonImage}
              alt={sermon.title}
              className="w-full h-full object-cover"
              itemProp="thumbnailUrl"
            />
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/60 to-transparent"></div>
            
            {sermon.tags && sermon.tags.length > 0 && (
              <div className="absolute top-3 right-3">
                <Badge className="bg-church-gold text-church-neutral-900">
                  {sermon.tags[0]}
                </Badge>
              </div>
            )}
            
            <div className="absolute bottom-4 left-4 right-4">
              <h3 className="text-white font-bold text-lg mb-1 text-shadow" itemProp="name">
                {sermon.title}
              </h3>
              <div className="flex items-center gap-2 text-white/90 text-xs">
                <Calendar className="h-3 w-3" />
                <span itemProp="datePublished">
                  {format(new Date(sermon.date), 'MMMM d, yyyy')}
                </span>
              </div>
            </div>
          </div>
          
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-church-neutral-500" />
                <span className="text-sm font-medium text-church-neutral-700" itemProp="author">
                  {sermon.speaker}
                </span>
              </div>
            </div>
            
            {sermon.description && (
              <p className="text-sm text-church-neutral-600 mb-4 line-clamp-2" itemProp="description">
                {sermon.description}
              </p>
            )}
            
            <div className="flex justify-between items-center pt-2 border-t border-church-neutral-200">
              <Button 
                variant="outline" 
                size="sm" 
                className="text-church-blue flex items-center gap-1"
              >
                <Play className="h-3.5 w-3.5" />
                Listen
              </Button>
              
              {sermon.youtubeId && (
                <Button 
                  variant="outline"
                  size="sm"
                  className="text-red-500 flex items-center gap-1"
                  asChild
                >
                  <a href={`https://www.youtube.com/watch?v=${sermon.youtubeId}`} target="_blank" rel="noopener noreferrer">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                    Watch
                  </a>
                </Button>
              )}
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-church-neutral-600"
                title="Download"
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SermonGridView;
