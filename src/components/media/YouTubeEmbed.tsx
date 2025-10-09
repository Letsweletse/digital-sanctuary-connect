import React, { useState, useEffect } from 'react';

interface YouTubeEmbedProps {
  channelId: string;
  maxResults?: number;
  showDetails?: boolean;
}

interface VideoItem {
  id: string;
  title: string;
  thumbnail: string;
  publishedAt: string;
}

const YouTubeEmbed: React.FC<YouTubeEmbedProps> = ({ 
  channelId, 
  maxResults = 6,
  showDetails = true 
}) => {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  
  // Pastor Kobus Bezuidenhout sermons only
  const videos: VideoItem[] = [
    {
      id: 'IwMUujsr4QI',
      title: 'Sunday Sermon - The Wisdom Of God - 05 Oct 2025',
      thumbnail: 'https://img.youtube.com/vi/IwMUujsr4QI/maxresdefault.jpg',
      publishedAt: '2025-10-05'
    },
    {
      id: 'OVYHy6jebeo',
      title: 'The Nation Of God - Sunday Sermon - 24 Aug 2025',
      thumbnail: 'https://img.youtube.com/vi/OVYHy6jebeo/maxresdefault.jpg',
      publishedAt: '2025-08-24'
    },
    {
      id: 'g4SkdDWkUUQ',
      title: 'Sunday Sermon - 14 Sept 2025',
      thumbnail: 'https://img.youtube.com/vi/g4SkdDWkUUQ/maxresdefault.jpg',
      publishedAt: '2025-09-14'
    }
  ];
  
  useEffect(() => {
    // Set the first video as default when component loads
    if (videos.length > 0 && !selectedVideo) {
      setSelectedVideo(videos[0].id);
    }
  }, []);
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  return (
    <div className="w-full">
      {/* Main Video Player */}
      {selectedVideo && (
        <div className="relative pb-[56.25%] h-0 mb-6">
          <iframe 
            src={`https://www.youtube.com/embed/${selectedVideo}`}
            className="absolute top-0 left-0 w-full h-full rounded-xl"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      )}
      
      {/* Video List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {videos.slice(0, maxResults).map((video) => (
          <div 
            key={video.id}
            className={`cursor-pointer group overflow-hidden rounded-lg transition-all duration-300 ${
              selectedVideo === video.id 
                ? 'ring-2 ring-church-blue'
                : 'hover:shadow-lg'
            }`}
            onClick={() => setSelectedVideo(video.id)}
          >
            <div className="relative pb-[56.25%]">
              <img 
                src={video.thumbnail}
                alt={video.title}
                className="absolute top-0 left-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  // Fallback if thumbnail doesn't load
                  e.currentTarget.src = `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-church-blue/80 flex items-center justify-center group-hover:bg-church-blue transition-colors">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="24" 
                    height="24" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="text-white"
                  >
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                </div>
              </div>
            </div>
            
            {showDetails && (
              <div className="p-3">
                <h3 className="font-medium text-church-neutral-900 mb-1 truncate">{video.title}</h3>
                <p className="text-church-neutral-500 text-sm">{formatDate(video.publishedAt)}</p>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-6 text-center">
        <a 
          href={`https://www.youtube.com/@${channelId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary"
        >
          View All Videos on YouTube
        </a>
      </div>
    </div>
  );
};

export default YouTubeEmbed;
