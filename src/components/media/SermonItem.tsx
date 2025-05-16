
import React from 'react';
import { format } from 'date-fns';
import { Edit2, Trash2, User, CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Sermon } from '@/types/sermonTypes';
import { useLogo } from '@/components/layout/LogoContext';

interface SermonItemProps {
  sermon: Sermon;
  onEdit: (sermon: Sermon) => void;
  onDelete: (id: string) => void;
  isMobile?: boolean;
}

const SermonItem = ({ sermon, onEdit, onDelete, isMobile = false }: SermonItemProps) => {
  const { logoUrl } = useLogo();
  const defaultLogo = '/lovable-uploads/8c65fe13-b78a-486c-b18b-796c1ca1e52b.png';
  const pastorKobusImage = '/lovable-uploads/20736aa1-df4f-4d5b-b226-d41cb293bbe0.png';
  
  // Get the appropriate speaker image
  const getSpeakerImage = () => {
    if (sermon.speaker === 'Pastor Kobus Bezuidenhout') {
      return pastorKobusImage;
    }
    return sermon.speakerImage || logoUrl || defaultLogo;
  };
  
  // Force render when image or logo changes
  React.useEffect(() => {
    if (isMobile) {
      console.log('SermonItem rendering on mobile', sermon.title);
    }
  }, [isMobile, sermon.id, logoUrl]);

  return (
    <div className="glass-panel bg-white p-4 rounded-lg shadow-sm border border-church-neutral-100 hover:border-church-neutral-200 transition-all">
      <div className="flex flex-col sm:flex-row items-start gap-4">
        <Avatar className="h-16 w-16 rounded-md shadow-sm flex-shrink-0">
          <AvatarImage 
            src={getSpeakerImage()} 
            alt={sermon.speaker}
            loading={isMobile ? "eager" : "lazy"} // Load immediately on mobile
          />
          <AvatarFallback className="rounded-md">{sermon.speaker?.charAt(0) || 'S'}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h4 className="text-lg font-semibold text-church-neutral-900">
              {sermon.title}
            </h4>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(sermon)}
                className="text-church-neutral-700 hover:text-church-blue"
              >
                <Edit2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(sermon.id)}
                className="text-church-neutral-700 hover:text-red-500"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-1 text-sm text-church-neutral-600">
            <span className="flex items-center gap-1">
              <User className="w-3.5 h-3.5" />
              {sermon.speaker}
            </span>
            <span className="flex items-center gap-1">
              <CalendarIcon className="w-3.5 h-3.5" />
              {format(new Date(sermon.date), 'MMMM d, yyyy')}
            </span>
            {sermon.youtubeId && (
              <a
                href={`https://www.youtube.com/watch?v=${sermon.youtubeId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-church-blue hover:underline"
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                YouTube
              </a>
            )}
            {sermon.audioUrl && (
              <span className="flex items-center gap-1 text-church-green">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14 5.7c0-1.39-1.12-2.5-2.5-2.5S9 4.31 9 5.7V9h5V5.7z" />
                  <path d="M18 10.5a.5.5 0 0 1 0 1h-1V19a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3v-7.5H4a.5.5 0 0 1 0-1h14zm-4 0h-6v8.5c0 .83.67 1.5 1.5 1.5h3c.83 0 1.5-.67 1.5-1.5v-8.5z" />
                </svg>
                Audio Available
              </span>
            )}
          </div>
          
          {sermon.description && (
            <p className="mt-2 text-sm text-church-neutral-700 line-clamp-2">
              {sermon.description}
            </p>
          )}
          
          {sermon.tags && sermon.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {sermon.tags.map((tag, index) => (
                <span 
                  key={index} 
                  className="bg-church-blue-light/30 text-church-blue text-xs px-2 py-1 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SermonItem;
