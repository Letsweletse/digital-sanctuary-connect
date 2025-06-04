
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Play, User, ExternalLink, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { useLatestSermon } from '@/hooks/useLatestSermon';
import { useNavigate } from 'react-router-dom';

const LatestSermonCard = () => {
  const { latestSermon } = useLatestSermon();
  const navigate = useNavigate();

  // Show message to upload sermons if none exist
  if (!latestSermon) {
    return (
      <Card className="bg-gradient-to-r from-church-blue to-church-blue-dark text-white shadow-xl">
        <CardContent className="p-6 text-center">
          <h3 className="text-2xl font-bold mb-4">No Sermons Yet</h3>
          <p className="text-white/90 mb-6">
            Upload your first sermon to get started with your sermon library.
          </p>
          <Button 
            onClick={() => navigate('/admin')}
            className="bg-white text-church-blue hover:bg-white/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Upload Sermon
          </Button>
        </CardContent>
      </Card>
    );
  }

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
            >
              <Play className="h-4 w-4 mr-2" />
              Watch on YouTube
            </Button>
          )}
          
          <Button 
            onClick={handleWatchOnYouTube}
            className="bg-white text-church-blue hover:bg-white/90"
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
