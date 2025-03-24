
import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';
import { Slider } from "@/components/ui/slider";

interface Sermon {
  id: string;
  title: string;
  speaker: string;
  date: string;
  audioUrl: string;
}

const AudioSermonPlayer = () => {
  const [currentSermonIndex, setCurrentSermonIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Sample sermon data - replace with real data from your backend
  const sermons: Sermon[] = [
    {
      id: '1',
      title: 'Finding Peace in Troubled Times',
      speaker: 'Pastor John Doe',
      date: '2023-12-10',
      audioUrl: 'https://cdn.devdojo.com/episode/June2023/the-making-of-wave.mp3',
    },
    {
      id: '2',
      title: 'The Power of Community',
      speaker: 'Elder Sarah Smith',
      date: '2023-12-03',
      audioUrl: 'https://cdn.devdojo.com/episode/June2023/how-to-build-a-successful-team.mp3',
    },
    {
      id: '3',
      title: 'Walking in Faith',
      speaker: 'Pastor John Doe',
      date: '2023-11-26',
      audioUrl: 'https://cdn.devdojo.com/episode/May2023/wave-update-saas-starter-kit.mp3',
    },
  ];
  
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
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
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
        <h4 className="text-lg font-bold text-church-neutral-900">{currentSermon.title}</h4>
        <p className="text-sm text-church-neutral-600">
          {currentSermon.speaker} • {formatDate(currentSermon.date)}
        </p>
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
              <h5 className="font-medium text-church-neutral-900">{sermon.title}</h5>
              <p className="text-xs text-church-neutral-600">
                {sermon.speaker} • {formatDate(sermon.date)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AudioSermonPlayer;
