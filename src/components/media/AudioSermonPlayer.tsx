
import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';
import { Slider } from "@/components/ui/slider";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { format } from "date-fns";
import { Sermon } from '@/types/sermonTypes';

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
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
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
  
  const sermons = customSermons || defaultSermons;
  const currentSermon = sermons[currentSermonIndex];
  
  useEffect(() => {
    if (audioRef.current) {
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
  }, [currentSermonIndex]);
  
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
      prevIndex === 0 ? sermons.length - 1 : prevIndex - 1
    );
    setIsPlaying(false);
  };
  
  // Next sermon
  const handleNext = () => {
    setCurrentSermonIndex(prevIndex => 
      prevIndex === sermons.length - 1 ? 0 : prevIndex + 1
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
  
  // Format time in MM:SS
  const formatTime = (time: number) => {
    if (isNaN(time)) return "00:00";
    
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  // Format date
  const formatDate = (date: Date) => {
    return format(new Date(date), 'MMMM d, yyyy');
  };
  
  return (
    <div className="w-full">
      <audio 
        ref={audioRef}
        src={currentSermon.audioUrl}
        preload="metadata"
        onEnded={handleNext}
      />
      
      {/* Current sermon info */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="h-12 w-12 rounded-md shadow-sm">
            <AvatarImage src={currentSermon.speakerImage} alt={currentSermon.speaker} />
            <AvatarFallback className="rounded-md">{currentSermon.speaker?.charAt(0) || 'S'}</AvatarFallback>
          </Avatar>
          <div>
            <h4 className="text-lg font-bold text-church-neutral-900">{currentSermon.title}</h4>
            <p className="text-sm text-church-neutral-600">
              {currentSermon.speaker} • {formatDate(currentSermon.date)}
            </p>
          </div>
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="mb-4">
        <Slider
          defaultValue={[0]}
          value={[currentTime]}
          max={duration || 100}
          step={1}
          onValueChange={handleTimeChange}
          className="my-4"
        />
        <div className="flex justify-between text-xs text-church-neutral-600">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
      
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={handlePrevious}
            className="p-2 rounded-full hover:bg-church-neutral-100"
          >
            <SkipBack className="w-5 h-5 text-church-neutral-800" />
          </button>
          
          <button
            onClick={togglePlayPause}
            className="p-3 bg-church-blue rounded-full text-white hover:bg-church-blue-dark"
          >
            {isPlaying ? 
              <Pause className="w-6 h-6" /> : 
              <Play className="w-6 h-6 ml-0.5" />
            }
          </button>
          
          <button 
            onClick={handleNext}
            className="p-2 rounded-full hover:bg-church-neutral-100"
          >
            <SkipForward className="w-5 h-5 text-church-neutral-800" />
          </button>
        </div>
        
        {/* Volume control */}
        <div className="flex items-center gap-2">
          <button 
            onClick={toggleMute}
            className="p-2 rounded-full hover:bg-church-neutral-100"
          >
            {isMuted ? 
              <VolumeX className="w-5 h-5 text-church-neutral-800" /> : 
              <Volume2 className="w-5 h-5 text-church-neutral-800" />
            }
          </button>
          
          <Slider
            defaultValue={[0.7]}
            value={[isMuted ? 0 : volume]}
            max={1}
            step={0.01}
            onValueChange={handleVolumeChange}
            className="w-24"
          />
        </div>
      </div>
      
      {/* Sermon list */}
      <div className="mt-8 border-t border-church-neutral-200 pt-6">
        <h4 className="font-medium text-church-neutral-800 mb-4">More Sermons</h4>
        <div className="space-y-3">
          {sermons.map((sermon, index) => (
            <div 
              key={sermon.id}
              className={`p-3 rounded-lg cursor-pointer transition-colors ${
                index === currentSermonIndex
                  ? 'bg-church-blue-light/30 border border-church-blue-light'
                  : 'hover:bg-church-neutral-100'
              }`}
              onClick={() => {
                setCurrentSermonIndex(index);
                setIsPlaying(false);
              }}
            >
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8 rounded-md">
                  <AvatarImage src={sermon.speakerImage} alt={sermon.speaker} />
                  <AvatarFallback className="rounded-md text-xs">{sermon.speaker?.charAt(0) || 'S'}</AvatarFallback>
                </Avatar>
                <div>
                  <h5 className="font-medium text-church-neutral-900">{sermon.title}</h5>
                  <p className="text-xs text-church-neutral-600">
                    {sermon.speaker} • {formatDate(sermon.date)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AudioSermonPlayer;
