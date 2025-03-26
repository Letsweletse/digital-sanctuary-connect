
import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

interface SermonAudioProps {
  churchId?: string;
  showLatest?: boolean;
  count?: number;
}

const SermonAudio = ({ 
  churchId = "gategaborone", 
  showLatest = true,
  count = 5
}: SermonAudioProps) => {
  const [isLoading, setIsLoading] = useState(true);
  
  // Ensure the iframe loads properly
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  const embedUrl = showLatest 
    ? `https://www.sermonaudio.com/embed/broadcaster/${churchId}?numItems=${count}` 
    : `https://www.sermonaudio.com/embed/search/${churchId}`;
  
  return (
    <div className="w-full rounded-lg overflow-hidden">
      {isLoading && (
        <div className="flex justify-center items-center h-80 bg-church-neutral-100">
          <Loader2 className="h-8 w-8 text-church-blue animate-spin" />
        </div>
      )}
      
      <iframe 
        src={embedUrl}
        style={{ minHeight: "500px" }}
        className={`w-full border-0 transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        title="SermonAudio Player"
        seamless
        allow="autoplay"
      ></iframe>
      
      <div className="mt-4 text-center">
        <a 
          href={`https://www.sermonaudio.com/solo/gategaborone/sermons/`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-sm text-church-blue hover:underline"
        >
          View all sermons on SermonAudio
        </a>
      </div>
    </div>
  );
};

export default SermonAudio;
