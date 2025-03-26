
import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { findOne } from '@/lib/mongodb';
import { Document, WithId } from 'mongodb';

interface SermonAudioProps {
  churchId?: string;
  showLatest?: boolean;
  count?: number;
  useMongoConfig?: boolean;
}

interface ChurchConfig {
  sermonAudioId: string;
  sermonCount: number;
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
            // Properly convert MongoDB document to ChurchConfig type
            const { _id, ...configData } = churchConfig as WithId<Document>;
            
            // Make sure the document has the required fields
            if ('sermonAudioId' in configData && 'sermonCount' in configData) {
              setConfig(configData as unknown as ChurchConfig);
            } else {
              throw new Error('MongoDB document is missing required fields');
            }
          }
        } catch (err) {
          console.error('Error fetching MongoDB config', err);
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
          href={`https://www.sermonaudio.com/solo/${effectiveChurchId}/sermons/`} 
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
