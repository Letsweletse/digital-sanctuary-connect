
import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';
import { Slider } from "@/components/ui/slider";
import { formatTime } from './utils/audioPlayerUtils';

interface AudioControlsProps {
  isPlaying: boolean;
  isMuted: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  onPlayPause: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onTimeChange: (newTime: number[]) => void;
  onVolumeChange: (newVolume: number[]) => void;
  onToggleMute: () => void;
}

const AudioControls: React.FC<AudioControlsProps> = ({
  isPlaying,
  isMuted,
  currentTime,
  duration,
  volume,
  onPlayPause,
  onPrevious,
  onNext,
  onTimeChange,
  onVolumeChange,
  onToggleMute
}) => {
  return (
    <>
      {/* Progress bar */}
      <div className="mb-4">
        <Slider
          defaultValue={[0]}
          value={[currentTime]}
          max={duration || 100}
          step={1}
          onValueChange={onTimeChange}
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
            onClick={onPrevious}
            className="p-2 rounded-full hover:bg-church-neutral-100"
          >
            <SkipBack className="w-5 h-5 text-church-neutral-800" />
          </button>
          
          <button
            onClick={onPlayPause}
            className="p-3 bg-church-blue rounded-full text-white hover:bg-church-blue-dark"
          >
            {isPlaying ? 
              <Pause className="w-6 h-6" /> : 
              <Play className="w-6 h-6 ml-0.5" />
            }
          </button>
          
          <button 
            onClick={onNext}
            className="p-2 rounded-full hover:bg-church-neutral-100"
          >
            <SkipForward className="w-5 h-5 text-church-neutral-800" />
          </button>
        </div>
        
        {/* Volume control */}
        <div className="flex items-center gap-2">
          <button 
            onClick={onToggleMute}
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
            onValueChange={onVolumeChange}
            className="w-24"
          />
        </div>
      </div>
    </>
  );
};

export default AudioControls;
