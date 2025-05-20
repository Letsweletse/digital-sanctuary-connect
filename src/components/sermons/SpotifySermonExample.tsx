
import React from 'react';
import { sermonsData } from '@/data/sermonsData';
import SpotifySermonCard from './components/SpotifySermonCard';

const SpotifySermonExample = () => {
  // Get just a few sermons for the example
  const exampleSermons = sermonsData.slice(0, 3);
  
  return (
    <div className="bg-church-neutral-50 p-6 rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-8">Sermons with Spotify Players</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {exampleSermons.map(sermon => (
          <SpotifySermonCard key={sermon.id} sermon={sermon} />
        ))}
      </div>
    </div>
  );
};

export default SpotifySermonExample;
