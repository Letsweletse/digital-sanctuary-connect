
import React, { useEffect } from 'react';
import { RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sermon } from '@/types/sermonTypes';
import SermonInfo from './SermonInfo';
import AudioControls from './AudioControls';
import SermonPlaylist from './SermonPlaylist';
import { useSermons } from '@/hooks/useSermons';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { useSermonRefresh } from '@/hooks/useSermonRefresh';
import { defaultSermons } from './constants/defaultSermons';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { isValidAudioUrl } from './utils/audioUrlUtils';

interface AudioSermonPlayerProps {
  customSermons?: Sermon[];
}

const AudioSermonPlayer = ({ customSermons }: AudioSermonPlayerProps) => {
  const { sermons: fetchedSermons, loading: sermonsLoading } = useSermons();
  
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
    isAudioReady,
    isAudioLoading,
    setLocalSermons,
    togglePlayPause,
    handlePrevious,
    handleNext,
    handleTimeChange,
    handleVolumeChange,
    toggleMute,
    setCurrentSermonIndex,
    handleAudioEnded
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
      
      // Test if the audio URL is accessible
      const checkAudioUrl = async () => {
        try {
          const response = await fetch(currentSermon.audioUrl, { method: 'HEAD' });
          if (!response.ok) {
            console.error('Audio URL is not accessible:', currentSermon.audioUrl, response.status);
          }
        } catch (err) {
          console.error('Error checking audio URL:', err);
        }
      };
      
      checkAudioUrl();
      
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

  // Auto-refresh sermons data on first load
  useEffect(() => {
    refreshSermons();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // Check if the current sermon has a valid audio URL
  const hasValidAudio = currentSermon?.audioUrl && isValidAudioUrl(currentSermon.audioUrl);
  
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
      
      {/* Current sermon info or placeholders */}
      {isAudioLoading && (
        <div className="p-4 bg-church-neutral-50 rounded-md text-center mb-4">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-5 w-48 bg-church-neutral-200 rounded mb-2"></div>
            <div className="h-4 w-32 bg-church-neutral-200 rounded"></div>
          </div>
          <p className="text-church-neutral-500 mt-2">Loading sermon audio...</p>
        </div>
      )}
      
      {!isAudioLoading && currentSermon ? (
        <SermonInfo sermon={currentSermon} />
      ) : !isAudioLoading && !sermonsLoading ? (
        <div className="p-4 bg-church-neutral-50 rounded-md text-center mb-4">
          <p className="text-church-neutral-500">No sermon selected. Please refresh or select one from the playlist.</p>
        </div>
      ) : null}
      
      {/* Error alert for invalid audio URLs */}
      {currentSermon && !hasValidAudio && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            This sermon doesn't have a valid audio file. Please select another sermon or add proper audio to this one.
          </AlertDescription>
        </Alert>
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
