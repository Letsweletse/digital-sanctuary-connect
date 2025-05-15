
import { useState, useRef, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useAudioPlayer = (audioUrl: string | null) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [isAudioTestable, setIsAudioTestable] = useState(false);
  const [isTestingAudio, setIsTestingAudio] = useState(false);

  // Reset state when audio URL changes
  useEffect(() => {
    setIsPlaying(false);
    setAudioError(null);
    
    // Check if audio is available and testable
    if (audioUrl) {
      setIsAudioTestable(true);
    } else {
      setIsAudioTestable(false);
    }
  }, [audioUrl]);

  // Handle changes in the audio element
  useEffect(() => {
    if (!audioRef.current) return;

    const audio = audioRef.current;
    
    // Add event listeners to handle audio state
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleError = (e: ErrorEvent) => {
      console.error('Audio error:', e);
      setAudioError('Could not play audio file. Format may be unsupported.');
      setIsPlaying(false);
      
      toast({
        title: "Audio Playback Error",
        description: "Could not play this audio file. The format may be unsupported.",
        variant: "destructive",
      });
    };

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('error', handleError as EventListener);

    // Cleanup listeners on unmount
    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('error', handleError as EventListener);
    };
  }, [toast]);

  // Toggle play/pause
  const togglePlayPause = () => {
    if (!audioRef.current || !audioUrl) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      const playPromise = audioRef.current.play();
      
      if (playPromise) {
        playPromise.catch(error => {
          console.error('Error playing audio:', error);
          setAudioError('Playback failed. Try again.');
        });
      }
    }
  };

  // Handle audio ended event
  const handleAudioEnded = () => {
    setIsPlaying(false);
    
    // Reset to beginning
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  };

  return {
    isAudioTestable,
    isTestingAudio,
    setIsTestingAudio,
    isPlaying,
    audioError,
    setAudioError,
    audioRef,
    togglePlayPause,
    handleAudioEnded
  };
};
