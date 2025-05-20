
import React from 'react';
import { Sermon } from '@/types/sermonTypes';

interface SpotifySermonEmbedProps {
  spotifyEpisodeId?: string;
  sermon?: Sermon;
  height?: string;
}

const SpotifySermonEmbed = ({ spotifyEpisodeId, sermon, height = "152" }: SpotifySermonEmbedProps) => {
  // If no spotifyEpisodeId is provided but sermon has one, use that
  const effectiveEpisodeId = spotifyEpisodeId || sermon?.spotifyEpisodeId;
  
  if (!effectiveEpisodeId) {
    return (
      <div className="bg-church-neutral-100 rounded-md p-4 text-center">
        <p className="text-church-neutral-600">Spotify episode not available for this sermon.</p>
      </div>
    );
  }
  
  return (
    <div className="w-full spotify-embed rounded-md overflow-hidden">
      <iframe 
        src={`https://open.spotify.com/embed/episode/${effectiveEpisodeId}?utm_source=generator&theme=0`}
        width="100%" 
        height={height}
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
        loading="lazy"
        style={{ borderRadius: "12px" }}
      />
      
      {sermon && (
        <div className="text-xs text-church-neutral-500 mt-2 text-right">
          <a 
            href={`https://open.spotify.com/episode/${effectiveEpisodeId}`}
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:underline text-church-blue"
          >
            Listen on Spotify
          </a>
        </div>
      )}
    </div>
  );
};

export default SpotifySermonEmbed;
