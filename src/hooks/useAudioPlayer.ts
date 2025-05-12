
import { useState, useRef, useEffect } from 'react';
import { Sermon } from '@/types/sermonTypes';

export const useAudioPlayer = (customSermons?: Sermon[], defaultSermons?: Sermon[]) => {
  const [currentSermonIndex, setCurrentSermonIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [localSermons, setLocalSermons] = useState<Sermon[]>([]);
  
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
    
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [customSermons, defaultSermons]);
  
  // Update audio element when current sermon changes
  useEffect(() => {
    if (audioRef.current && localSermons.length > 0) {
      const audio = audioRef.current;
      
      // Event listeners
      const setAudioData = () => {
        setDuration(audio.duration);
        setCurrentTime(audio.currentTime);
      };
      
      const setAudioTime = () => setCurrentTime(audio.currentTime);
      
      // Add event listeners
      audio.addEventListener('loadeddata', setAudioData);
      audio.addEventListener('timeupdate', setAudioTime);
      
      // Cleanup
      return () => {
        audio.removeEventListener('loadeddata', setAudioData);
        audio.removeEventListener('timeupdate', setAudioTime);
      };
    }
  }, [currentSermonIndex, localSermons]);
  
  // The current sermon based on index
  const currentSermon = localSermons[currentSermonIndex] || (defaultSermons ? defaultSermons[0] : null);
  
  // Play/Pause audio
  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  // Previous sermon
  const handlePrevious = () => {
    setCurrentSermonIndex(prevIndex => 
      prevIndex === 0 ? localSermons.length - 1 : prevIndex - 1
    );
    setIsPlaying(false);
  };
  
  // Next sermon
  const handleNext = () => {
    setCurrentSermonIndex(prevIndex => 
      prevIndex === localSermons.length - 1 ? 0 : prevIndex + 1
    );
    setIsPlaying(false);
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
