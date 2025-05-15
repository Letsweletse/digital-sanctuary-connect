
import React, { useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sermon } from '@/types/sermonTypes';
import SermonInfo from './SermonInfo';
import AudioControls from './AudioControls';
import SermonPlaylist from './SermonPlaylist';
import { useSermons } from '@/hooks/useSermons';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { useSermonRefresh } from '@/hooks/useSermonRefresh';
import { defaultSermons } from './constants/defaultSermons';

interface AudioSermonPlayerProps {
  customSermons?: Sermon[];
}

const AudioSermonPlayer = ({ customSermons }: AudioSermonPlayerProps) => {
  const { sermons: fetchedSermons } = useSermons();
  
  const {
    audioRef,
    currentSermon,
    isPlaying,
    isMuted,
    currentTime,
    duration,
    volume,
    currentSermonIndex,
    localSermons,
    setLocalSermons,
    togglePlayPause,
    handlePrevious,
    handleNext,
    handleTimeChange,
    handleVolumeChange,
    toggleMute,
    setCurrentSermonIndex
  } = useAudioPlayer(customSermons || fetchedSermons, defaultSermons);
  
  // Handle sermon refresh events and mobile state
  const { refreshSermons } = useSermonRefresh(
    customSermons,
    fetchedSermons,
    defaultSermons,
    currentSermonIndex,
    setLocalSermons,
    setCurrentSermonIndex
  );
  
  // Handle sermon selection from playlist
  const handleSermonSelect = (index: number) => {
    setCurrentSermonIndex(index);
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };
  
  // Ensure audio element is properly set up
  useEffect(() => {
    if (audioRef.current && currentSermon?.audioUrl) {
      // Reset audio element when source changes
      audioRef.current.load();
      
      // Handle errors
      const handleError = (e: any) => {
        console.error('Audio playback error:', e);
      };
      
      audioRef.current.addEventListener('error', handleError);
      return () => {
        audioRef.current?.removeEventListener('error', handleError);
      };
    }
  }, [currentSermon?.audioUrl]);
  
  // Trigger manual refresh
  const handleManualRefresh = () => {
    refreshSermons();
  };
  
  return (
    <div className="w-full">
      <audio 
        ref={audioRef}
        src={currentSermon?.audioUrl}
        preload="metadata"
        onEnded={handleNext}
      />
      
      {/* Manual refresh button */}
      <div className="flex justify-end mb-4">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleManualRefresh}
          className="flex items-center gap-1 text-church-blue"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh Sermons
        </Button>
      </div>
      
      {/* Current sermon info */}
      {currentSermon ? (
        <SermonInfo sermon={currentSermon} />
      ) : (
        <div className="p-4 bg-church-neutral-50 rounded-md text-center mb-4">
          <p className="text-church-neutral-500">No sermon selected. Please refresh or select one from the playlist.</p>
        </div>
      )}
      
      {/* Audio controls */}
      <AudioControls
        isPlaying={isPlaying}
        isMuted={isMuted}
        currentTime={currentTime}
        duration={duration}
        volume={volume}
        onPlayPause={togglePlayPause}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onTimeChange={handleTimeChange}
        onVolumeChange={handleVolumeChange}
        onToggleMute={toggleMute}
      />
      
      {/* Sermon playlist */}
      <SermonPlaylist
        sermons={localSermons}
        currentIndex={currentSermonIndex}
        onSermonSelect={handleSermonSelect}
      />
    </div>
  );
};

export default AudioSermonPlayer;
