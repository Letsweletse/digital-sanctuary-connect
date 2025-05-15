
import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, X, Volume2, AlertCircle } from 'lucide-react';

interface AudioFileDisplayProps {
  audioFile: File | null;
  audioUrl: string | null;
  isPlaying: boolean;
  audioError: string | null;
  togglePlayPause: () => void;
  onRemove: () => void;
  displayName?: string;
}

const AudioFileDisplay = ({
  audioFile,
  audioUrl,
  isPlaying,
  audioError,
  togglePlayPause,
  onRemove,
  displayName
}: AudioFileDisplayProps) => {
  const fileName = displayName || audioFile?.name || 'sermon-audio.mp3';
  const canPlay = !!audioUrl && !audioError;
  
  return (
    <div className="bg-church-neutral-50 border border-church-neutral-200 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="bg-church-blue-light/30 rounded-full p-2 mr-3">
            <Volume2 className="w-5 h-5 text-church-blue-dark" />
          </div>
          <div className="overflow-hidden">
            <p className="font-medium text-church-neutral-800 truncate" title={fileName}>
              {fileName}
            </p>
            {audioFile && (
              <p className="text-xs text-church-neutral-500">
                {(audioFile.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {canPlay && (
            <Button 
              type="button"
              size="sm"
              variant="outline"
              className="h-8 w-8 p-0 rounded-full"
              onClick={togglePlayPause}
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>
          )}
          <Button 
            type="button"
            size="sm"
            variant="outline"
            className="h-8 w-8 p-0 rounded-full text-red-500 hover:text-red-700 hover:bg-red-50"
            onClick={onRemove}
            title="Remove"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {audioError && (
        <div className="mt-2 text-xs text-red-500 flex items-center">
          <AlertCircle className="w-3 h-3 mr-1" />
          <span>Error: {audioError}</span>
        </div>
      )}
      
      {audioUrl && !audioError && (
        <div className="mt-2 text-xs text-church-blue">
          Audio file ready for submission
        </div>
      )}
    </div>
  );
};

export default AudioFileDisplay;
