
import React from 'react';
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
    togglePlayPause,
    handlePrevious,
    handleNext,
    handleTimeChange,
    handleVolumeChange,
    toggleMute,
    setCurrentSermonIndex
  } = useAudioPlayer(customSermons || fetchedSermons, defaultSermons);
  
  // Handle sermon refresh events and mobile state
  useSermonRefresh(
    customSermons,
    fetchedSermons,
    defaultSermons,
    currentSermonIndex,
    (sermons) => localSermons.length !== sermons.length && localSermons !== sermons ? setLocalSermons(sermons) : null,
    setCurrentSermonIndex
  );
  
  // Handle sermon selection from playlist
  const handleSermonSelect = (index: number) => {
    setCurrentSermonIndex(index);
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
    }
  };
  
  return (
    <div className="w-full">
      <audio 
        ref={audioRef}
        src={currentSermon?.audioUrl}
        preload="metadata"
        onEnded={handleNext}
      />
      
      {/* Current sermon info */}
      {currentSermon && <SermonInfo sermon={currentSermon} />}
      
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
