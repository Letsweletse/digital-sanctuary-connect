import React, { useState, useRef, useEffect } from 'react';
import { Sermon } from '@/types/sermonTypes';
import SermonInfo from './SermonInfo';
import AudioControls from './AudioControls';
import SermonPlaylist from './SermonPlaylist';
import { useSermons } from '@/hooks/useSermons';
import { useIsMobile } from '@/hooks/use-mobile';

interface AudioSermonPlayerProps {
  customSermons?: Sermon[];
}

const AudioSermonPlayer = ({ customSermons }: AudioSermonPlayerProps) => {
  const [currentSermonIndex, setCurrentSermonIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [localSermons, setLocalSermons] = useState<Sermon[]>([]);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { sermons: fetchedSermons } = useSermons();
  const isMobile = useIsMobile();
  
  // Default sermon data if no custom sermons provided
  const defaultSermons: Sermon[] = [
    {
      id: '1',
      title: 'He\'s Power In Us',
      speaker: 'Peter Taylor',
      speakerImage: '/lovable-uploads/8c65fe13-b78a-486c-b18b-796c1ca1e52b.png',
      date: new Date('2025-03-30'),
      audioUrl: 'https://cdn.devdojo.com/episode/June2023/the-making-of-wave.mp3',
      youtubeId: 'PpSxcNgBOqM',
      description: 'A powerful sermon about the Holy Spirit living in us.',
      tags: ['Holy Spirit', 'Power', 'Christian Living'],
    },
    {
      id: '2',
      title: 'The Power of Community',
      speaker: 'Elder Sarah Smith',
      speakerImage: '/placeholder.svg',
      date: new Date('2025-03-23'),
      audioUrl: 'https://cdn.devdojo.com/episode/June2023/how-to-build-a-successful-team.mp3',
    },
    {
      id: '3',
      title: 'Walking in Faith',
      speaker: 'Pastor John Doe',
      speakerImage: '/placeholder.svg',
      date: new Date('2025-03-16'),
      audioUrl: 'https://cdn.devdojo.com/episode/May2023/wave-update-saas-starter-kit.mp3',
    },
  ];
  
  // Initialize sermons from props or default
  useEffect(() => {
    console.log('AudioSermonPlayer: Initializing sermons');
    console.log('Custom sermons provided:', customSermons?.length || 0);
    console.log('Fetched sermons:', fetchedSermons?.length || 0);
    
    // Determine which sermons to use
    const sermonsToUse = customSermons || fetchedSermons || defaultSermons;
    console.log('Using sermons:', sermonsToUse.length);
    
    // Reset player state when sermons change
    setLocalSermons(sermonsToUse);
    setCurrentSermonIndex(0);
    setIsPlaying(false);
    
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [customSermons, fetchedSermons]);
  
  // Handle sermon refresh event (especially for mobile)
  useEffect(() => {
    const handleSermonRefresh = () => {
      console.log('Sermon refresh event received');
      
      // Force refresh sermons data
      const sermonsToUse = customSermons || fetchedSermons || defaultSermons;
      console.log('Refreshing with sermons:', sermonsToUse.length);
      
      setLocalSermons(sermonsToUse);
      // Keep current index if possible
      if (currentSermonIndex >= sermonsToUse.length) {
        setCurrentSermonIndex(0);
      }
    };
    
    window.addEventListener('sermon-refresh', handleSermonRefresh);
    return () => {
      window.removeEventListener('sermon-refresh', handleSermonRefresh);
    };
  }, [customSermons, fetchedSermons, defaultSermons, currentSermonIndex]);
  
  // Track when component mounts/unmounts on mobile
  useEffect(() => {
    if (isMobile) {
      console.log('AudioSermonPlayer mounted on mobile');
    }
    
    return () => {
      if (isMobile) {
        console.log('AudioSermonPlayer unmounted on mobile');
      }
    };
  }, [isMobile]);
  
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
  const currentSermon = localSermons[currentSermonIndex] || defaultSermons[0];
  
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
  
  // Handle sermon selection from playlist
  const handleSermonSelect = (index: number) => {
    setCurrentSermonIndex(index);
    setIsPlaying(false);
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
      <SermonInfo sermon={currentSermon} />
      
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
