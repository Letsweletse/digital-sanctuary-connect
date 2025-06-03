
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Play, User, ExternalLink, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { useLatestSermon } from '@/hooks/useLatestSermon';

const LatestSermonCard = () => {
  const { latestSermon, isAdding } = useLatestSermon();

  const handleWatchOnYouTube = () => {
    if (latestSermon.youtubeId) {
      window.open(`https://www.youtube.com/watch?v=${latestSermon.youtubeId}`, '_blank');
    }
  };

  return (
    <Card className="bg-gradient-to-r from-church-blue to-church-blue-dark text-white shadow-xl">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
            Latest Sermon
          </Badge>
          {isAdding && (
            <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-100 flex items-center gap-1">
              <Loader2 className="h-3 w-3 animate-spin" />
              Adding to Database...
            </Badge>
          )}
        </div>
        
        <h3 className="text-2xl font-bold mb-2">{latestSermon.title}</h3>
        
        <div className="flex items-center gap-4 mb-4 text-white/90">
          <div className="flex items-center gap-1">
            <User className="h-4 w-4" />
            <span>{latestSermon.speaker}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{format(new Date(latestSermon.date), 'MMMM d, yyyy')}</span>
          </div>
        </div>
        
        {latestSermon.description && (
          <p className="text-white/90 mb-4 line-clamp-2">
            {latestSermon.description}
          </p>
        )}
        
        {latestSermon.tags && latestSermon.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {latestSermon.tags.map((tag, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="bg-white/10 text-white border-white/20 text-xs"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}
        
        <div className="flex gap-3">
          {latestSermon.youtubeId && (
            <Button 
              onClick={handleWatchOnYouTube}
              className="bg-white/20 hover:bg-white/30 text-white border-white/30 flex-1"
              variant="outline"
              disabled={isAdding}
            >
              <Play className="h-4 w-4 mr-2" />
              Watch on YouTube
            </Button>
          )}
          
          <Button 
            onClick={handleWatchOnYouTube}
            className="bg-white text-church-blue hover:bg-white/90"
            disabled={isAdding}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            View
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LatestSermonCard;
