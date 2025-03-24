
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
  
  // Actual videos from Gate Gaborone Ministries YouTube channel
  const videos: VideoItem[] = [
    {
      id: '0Nkx8oww13E',
      title: 'SUNDAY SERVICE || THIS MORNING || 10/12/2023',
      thumbnail: 'https://images.unsplash.com/photo-1543269865-cbf427effbad',
      publishedAt: '2023-12-10'
    },
    {
      id: 'p6Q5iqTIEqw',
      title: 'SUNDAY SERVICE || THIS MORNING || 26/11/2023',
      thumbnail: 'https://images.unsplash.com/photo-1577896851698-52dd2060e3b0',
      publishedAt: '2023-11-26'
    },
    {
      id: 'PcfStYPwYnI',
      title: 'How to Turn Your Life into a House of God ft Dr Thabo Senkhane',
      thumbnail: 'https://images.unsplash.com/photo-1543269865-cbf427effbad',
      publishedAt: '2023-05-28'
    },
    {
      id: 'pPLDsqBQmDA',
      title: 'When God Builds Your House | Pastor Kobus Bezuidenhout',
      thumbnail: 'https://images.unsplash.com/photo-1577896851698-52dd2060e3b0',
      publishedAt: '2023-05-21'
    },
    {
      id: 'rJgfBOuVrUQ',
      title: 'Sunday Worship Service | Mothersday Service',
      thumbnail: 'https://images.unsplash.com/photo-1508963493744-76fce69379c0',
      publishedAt: '2023-05-14'
    },
    {
      id: 'BNDMHJCc6w4',
      title: 'Sunday Worship Service | Pastor Kobus',
      thumbnail: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88',
      publishedAt: '2023-05-07'
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
                src={`${video.thumbnail}?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`}
                alt={video.title}
                className="absolute top-0 left-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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
