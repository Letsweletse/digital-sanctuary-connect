
import { useState, useRef, useEffect } from 'react';

export const useAudioPlayer = (audioUrl: string | null) => {
  const [isAudioTestable, setIsAudioTestable] = useState<boolean>(false);
  const [isTestingAudio, setIsTestingAudio] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Check if audio exists after component mount
  useEffect(() => {
    if (audioUrl) {
      validateAudioUrl(audioUrl);
    }
  }, [audioUrl]);

  // Validate audio URL
  const validateAudioUrl = async (url: string) => {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      if (response.ok) {
        setIsAudioTestable(true);
        setAudioError(null);
      } else {
        setIsAudioTestable(false);
        setAudioError(`Audio file not accessible (Status: ${response.status})`);
      }
    } catch (err) {
      console.error('Error validating audio URL:', err);
      setIsAudioTestable(false);
      setAudioError('Unable to validate audio file');
    }
  };

  // Play/pause control
  const togglePlayPause = () => {
    if (!audioRef.current || !audioUrl) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise.then(() => {
          setIsPlaying(true);
        }).catch(err => {
          console.error('Error playing audio:', err);
          setAudioError('Unable to play audio file');
        });
      }
    }
  };

  // Audio ended handler
  const handleAudioEnded = () => {
    setIsPlaying(false);
  };
  
  return {
    isAudioTestable,
    setIsAudioTestable,
    isTestingAudio,
    setIsTestingAudio,
    isPlaying,
    setIsPlaying,
    audioError,
    setAudioError,
    audioRef,
    togglePlayPause,
    handleAudioEnded
  };
};
