
import { useState, useRef, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Sermon } from '@/types/sermonTypes';
import { useSermonPlaylist } from './useSermonPlaylist';
import { useAudioPlayback } from './useAudioPlayback';

export const useAudioPlayer = (initialSermons: Sermon[] = [], defaultSermons: Sermon[] = []) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();
  
  // Get sermon playlist functionality
  const {
    currentSermonIndex,
    setCurrentSermonIndex,
    localSermons,
    setLocalSermons,
    currentSermon,
    handlePrevious,
    handleNext
  } = useSermonPlaylist(initialSermons, defaultSermons);

  // Get audio playback controls
  const {
    isPlaying,
    setIsPlaying,
    duration,
    setDuration,
    currentTime,
    setCurrentTime,
    volume,
    isMuted,
    isAudioReady,
    setIsAudioReady,
    isAudioLoading,
    setIsAudioLoading,
    togglePlayPause,
    handleTimeChange,
    handleVolumeChange,
    toggleMute
  } = useAudioPlayback(audioRef);

  // State for audio testing
  const [isAudioTestable, setIsAudioTestable] = useState(false);
  const [isTestingAudio, setIsTestingAudio] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);

  // Reset state when sermon changes
  useEffect(() => {
    setIsPlaying(false);
    setAudioError(null);
    
    // Check if audio is available and testable
    if (currentSermon?.audioUrl) {
      setIsAudioTestable(true);
    } else {
      setIsAudioTestable(false);
    }
    
    // Mark audio as loading when sermon changes
    setIsAudioLoading(true);
    
    // Reset audio ready state
    setIsAudioReady(false);
    
    // Small timeout to allow audio to load
    const loadTimer = setTimeout(() => {
      setIsAudioLoading(false);
    }, 1000);
    
    return () => clearTimeout(loadTimer);
  }, [currentSermon?.audioUrl, setIsPlaying, setIsAudioLoading, setIsAudioReady]);

  // Handle changes in the audio element
  useEffect(() => {
    if (!audioRef.current) return;

    const audio = audioRef.current;
    
    // Add event listeners to handle audio state
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleLoadedMetadata = () => {
      setIsAudioReady(true);
      setIsAudioLoading(false);
      setDuration(audio.duration);
    };
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleError = (e: ErrorEvent) => {
      console.error('Audio error:', e);
      setAudioError('Could not play audio file. Format may be unsupported.');
      setIsPlaying(false);
      setIsAudioLoading(false);
      
      toast({
        title: "Audio Playback Error",
        description: "Could not play this audio file. The format may be unsupported.",
        variant: "destructive",
      });
    };

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('error', handleError as EventListener);

    // Cleanup listeners on unmount
    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('error', handleError as EventListener);
    };
  }, [toast, setIsPlaying, setDuration, setCurrentTime, setIsAudioReady, setIsAudioLoading]);

  // Handle audio ended event
  const handleAudioEnded = () => {
    setIsPlaying(false);
    
    // Reset to beginning
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  };

  return {
    // Sermon playlist properties
    currentSermon,
    currentSermonIndex,
    setCurrentSermonIndex,
    localSermons,
    setLocalSermons,
    handlePrevious,
    handleNext,
    
    // Audio playback properties
    isPlaying,
    duration,
    currentTime,
    volume,
    isMuted,
    isAudioReady,
    isAudioLoading,
    togglePlayPause,
    handleTimeChange,
    handleVolumeChange,
    toggleMute,
    
    // Audio testing properties
    isAudioTestable,
    isTestingAudio,
    setIsTestingAudio,
    audioError,
    setAudioError,
    
    // Audio reference
    audioRef,
    handleAudioEnded
  };
};
