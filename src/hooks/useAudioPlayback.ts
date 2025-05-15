
import { useState, useEffect, RefObject } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useAudioPlayback = (audioRef: RefObject<HTMLAudioElement>) => {
  const { toast } = useToast();
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isAudioReady, setIsAudioReady] = useState(false);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  
  // Play/Pause audio
  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        // Check if audio is ready to play
        if (audioRef.current.readyState >= 2) {
          const playPromise = audioRef.current.play();
          
          // Handle play promise to catch potential errors
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                setIsPlaying(true);
              })
              .catch(error => {
                console.error("Play error:", error);
                toast({
                  title: "Playback Error",
                  description: "Unable to play sermon. Please try refreshing or check audio format.",
                  variant: "destructive",
                });
                setIsPlaying(false);
              });
          }
        } else {
          // If not ready, try to load the audio first
          audioRef.current.load();
          toast({
            title: "Loading Audio",
            description: "Please wait while the sermon loads...",
          });
        }
      }
    }
  };

  // Seek in audio
  const handleTimeChange = (newTime: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = newTime[0];
      setCurrentTime(newTime[0]);
    }
  };
  
  // Change volume
  const handleVolumeChange = (newVolume: number[]) => {
    const volumeValue = newVolume[0];
    setVolume(volumeValue);
    
    if (audioRef.current) {
      audioRef.current.volume = volumeValue;
      setIsMuted(volumeValue === 0);
    }
  };
  
  // Toggle mute
  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume;
        setIsMuted(false);
      } else {
        audioRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  return {
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
  };
};
