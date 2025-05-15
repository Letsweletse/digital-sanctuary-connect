
import { useState, useRef, useEffect } from 'react';
import { Sermon } from '@/types/sermonTypes';
import { useToast } from '@/hooks/use-toast';

export const useAudioPlayer = (customSermons?: Sermon[], defaultSermons?: Sermon[]) => {
  const [currentSermonIndex, setCurrentSermonIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [localSermons, setLocalSermons] = useState<Sermon[]>([]);
  const [isAudioReady, setIsAudioReady] = useState(false);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const { toast } = useToast();
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
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
  
  // Check if URL is a valid audio URL
  const isValidAudioUrl = (url: string): boolean => {
    // Check if it's a Supabase URL or a blob URL
    return (
      (url.startsWith('https://') && url.includes('storage.googleapis.com')) || 
      url.startsWith('blob:') || 
      url.startsWith('https://lojchdvtwypjqupsjynf.supabase.co/storage/')
    );
  };
  
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
      if (!isValidAudioUrl(currentSermon.audioUrl)) {
        console.error('Invalid audio URL:', currentSermon.audioUrl);
        toast({
          title: "Invalid Audio URL",
          description: "The audio file for this sermon cannot be played. Please check the URL.",
          variant: "destructive",
        });
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
  
  // The current sermon based on index
  const currentSermon = localSermons[currentSermonIndex] || (defaultSermons ? defaultSermons[0] : null);
  
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
                  description: "Unable to play sermon. Please try refreshing.",
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
  
  // Previous sermon
  const handlePrevious = () => {
    setCurrentSermonIndex(prevIndex => 
      prevIndex === 0 ? localSermons.length - 1 : prevIndex - 1
    );
    setIsPlaying(false);
    setIsAudioReady(false);
  };
  
  // Next sermon
  const handleNext = () => {
    setCurrentSermonIndex(prevIndex => 
      prevIndex === localSermons.length - 1 ? 0 : prevIndex + 1
    );
    setIsPlaying(false);
    setIsAudioReady(false);
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
