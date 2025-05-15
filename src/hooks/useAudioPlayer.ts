
import { useState, useRef, useEffect } from 'react';
import { Sermon } from '@/types/sermonTypes';
import { useToast } from '@/hooks/use-toast';
import { useAudioValidation } from './useAudioValidation';
import { useAudioPlayback } from './useAudioPlayback';
import { useSermonPlaylist } from './useSermonPlaylist';

export const useAudioPlayer = (customSermons?: Sermon[], defaultSermons?: Sermon[]) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();
  
  // Use our specialized hooks
  const { isValidAudioUrl, validateAudioUrl } = useAudioValidation();
  
  const {
    currentSermonIndex,
    setCurrentSermonIndex,
    localSermons,
    setLocalSermons,
    currentSermon,
    handlePrevious,
    handleNext
  } = useSermonPlaylist(customSermons || [], defaultSermons);
  
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
  
  // Initialize sermons from props or default
  useEffect(() => {
    console.log('useAudioPlayer: Initializing sermons');
    console.log('Custom sermons provided:', customSermons?.length || 0);
    
    // Determine which sermons to use
    const sermonsToUse = customSermons || defaultSermons || [];
    console.log('Using sermons:', sermonsToUse.length);
    
    // Reset player state when sermons change
    setLocalSermons(sermonsToUse);
    setCurrentSermonIndex(0);
    setIsPlaying(false);
    setIsAudioReady(false);
    
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [customSermons, defaultSermons]);
  
  // Update audio element when current sermon changes
  useEffect(() => {
    if (audioRef.current && localSermons.length > 0 && currentSermonIndex < localSermons.length) {
      const audio = audioRef.current;
      const currentSermon = localSermons[currentSermonIndex];
      
      // Don't attempt to load invalid URLs
      if (!currentSermon || !currentSermon.audioUrl) {
        setIsAudioReady(false);
        return;
      }
      
      // Validate URL before attempting to load
      if (!validateAudioUrl(currentSermon.audioUrl)) {
        setIsAudioReady(false);
        return;
      }
      
      setIsAudioLoading(true);
      
      // Event listeners
      const setAudioData = () => {
        setDuration(audio.duration);
        setCurrentTime(audio.currentTime);
        setIsAudioReady(true);
        setIsAudioLoading(false);
        console.log('Audio loaded and ready to play:', audio.src);
      };
      
      const setAudioTime = () => setCurrentTime(audio.currentTime);
      
      const handleAudioError = (e: any) => {
        console.error('Audio error:', e);
        setIsAudioLoading(false);
        setIsAudioReady(false);
        toast({
          title: "Audio Error",
          description: "There was a problem playing this sermon. Please try another or refresh.",
          variant: "destructive",
        });
        setIsPlaying(false);
      };
      
      // Add event listeners
      audio.addEventListener('loadeddata', setAudioData);
      audio.addEventListener('timeupdate', setAudioTime);
      audio.addEventListener('error', handleAudioError);
      
      // Cleanup
      return () => {
        audio.removeEventListener('loadeddata', setAudioData);
        audio.removeEventListener('timeupdate', setAudioTime);
        audio.removeEventListener('error', handleAudioError);
      };
    }
  }, [currentSermonIndex, localSermons, toast]);
  
  return {
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
  };
};
