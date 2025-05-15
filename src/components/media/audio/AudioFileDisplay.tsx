
import React from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Music, Trash2, Download, Play, Pause, AlertCircle } from 'lucide-react';
import { getFileDisplayName, handleDownload } from './AudioValidationHelper';

interface AudioFileDisplayProps {
  audioFile: File | null;
  audioUrl: string | null;
  isPlaying: boolean;
  audioError: string | null;
  togglePlayPause: () => void;
  onRemove: () => void;
}

const AudioFileDisplay: React.FC<AudioFileDisplayProps> = ({
  audioFile,
  audioUrl,
  isPlaying,
  audioError,
  togglePlayPause,
  onRemove,
}) => {
  return (
    <div className="mb-4 p-4 bg-church-neutral-50 rounded-md border border-church-neutral-200">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <Music className="h-5 w-5 text-church-blue mr-2 flex-shrink-0" />
          <span className="text-sm font-medium truncate max-w-[200px]">
            {getFileDisplayName(audioFile, audioUrl)}
          </span>
        </div>
        <div className="flex gap-2">
          {audioUrl && !audioError && (
            <>
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={togglePlayPause}
                className="flex items-center gap-1"
              >
                {isPlaying ? (
                  <><Pause className="h-4 w-4" /> Pause</>
                ) : (
                  <><Play className="h-4 w-4" /> Play</>
                )}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={() => handleDownload(audioUrl, audioFile)}
                className="flex items-center gap-1"
              >
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Download</span>
              </Button>
            </>
          )}
          <Button 
            type="button" 
            variant="ghost" 
            size="sm"
            onClick={onRemove}
            className="text-church-neutral-700 hover:text-red-500"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Audio error message */}
      {audioError && (
        <Alert variant="destructive" className="mb-3 py-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-xs">{audioError}</AlertDescription>
        </Alert>
      )}
      
      {/* Audio preview */}
      {audioUrl && !audioError && (
        <div className="bg-white p-2 rounded-md border border-church-neutral-200">
          <audio 
            className="w-full" 
            src={audioUrl} 
            controls
            onError={() => console.error('Audio preview failed to load')} 
          />
        </div>
      )}
    </div>
  );
};

export default AudioFileDisplay;
