
import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { findOne, ChurchConfig } from '@/lib/mongodb';

interface SermonAudioProps {
  churchId?: string;
  showLatest?: boolean;
  count?: number;
  useMongoConfig?: boolean;
}

const SermonAudio = ({ 
  churchId = "gategaborone", 
  showLatest = true,
  count = 5,
  useMongoConfig = false
}: SermonAudioProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [config, setConfig] = useState<ChurchConfig | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch configuration from MongoDB if enabled
  useEffect(() => {
    if (useMongoConfig) {
      const fetchConfig = async () => {
        try {
          const churchConfig = await findOne('church_config', { configType: 'sermon_audio' });
          if (churchConfig) {
            setConfig(churchConfig as ChurchConfig);
          }
        } catch (err) {
          console.error('Error fetching config', err);
          setError('Could not load church configuration');
          // Fall back to default props
        }
      };
      
      fetchConfig();
    }
  }, [useMongoConfig]);
  
  // Ensure the iframe loads properly
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Use MongoDB config if available, otherwise use props
  const effectiveChurchId = (useMongoConfig && config?.sermonAudioId) ? config.sermonAudioId : churchId;
  const effectiveCount = (useMongoConfig && config?.sermonCount) ? config.sermonCount : count;
  
  const embedUrl = showLatest 
    ? `https://www.sermonaudio.com/embed/broadcaster/${effectiveChurchId}?numItems=${effectiveCount}` 
    : `https://www.sermonaudio.com/embed/search/${effectiveChurchId}`;
  
  if (error) {
    return (
      <div className="w-full p-4 text-red-500 bg-red-50 rounded-lg">
        Error: {error}. Using default configuration.
      </div>
    );
  }
  
  return (
    <div className="w-full rounded-lg overflow-hidden">
      {isLoading && (
        <div className="flex justify-center items-center h-80 bg-church-neutral-100/50 rounded-lg">
          <Loader2 className="h-8 w-8 text-church-blue animate-spin" />
        </div>
      )}
      
      <iframe 
        src={embedUrl}
        style={{ minHeight: "500px" }}
        className={`w-full border-0 rounded-lg transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        title="SermonAudio Player"
        seamless
        allow="autoplay"
      ></iframe>
      
      <div className="mt-4 text-center">
        <a 
          href={`https://www.sermonaudio.com/solo/${effectiveChurchId}/sermons/`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm text-church-blue hover:underline"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
            <polyline points="15 3 21 3 21 9"></polyline>
            <line x1="10" y1="14" x2="21" y2="3"></line>
          </svg>
          View all sermons on SermonAudio
        </a>
      </div>
    </div>
  );
};

export default SermonAudio;
