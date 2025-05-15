
import React from 'react';
import { Label } from '@/components/ui/label';
import DragDropUploader from '../DragDropUploader';
import { ImageCategory } from '@/types/imageTypes';
import AudioFileDisplay from '../audio/AudioFileDisplay';
import AudioUploadProgress from '../audio/AudioUploadProgress';
import { AudioSuccessMessage } from '../audio/AudioSuccessMessage';
import { FileAudio, Info } from 'lucide-react';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';

interface SermonAudioUploadProps {
  audioFile: File | null;
  setAudioFile: (file: File | null) => void;
  handleAudioUpload: (file: File, category: ImageCategory) => Promise<boolean>;
  audioUrl: string | null;
  setAudioUrl: (url: string | null) => void;
  isUploading?: boolean;
  uploadProgress?: number;
  sermonTitle?: string;
  speakerName?: string;
}

const SermonAudioUpload = ({
  audioFile,
  setAudioFile,
  handleAudioUpload,
  audioUrl,
  setAudioUrl,
  isUploading = false,
  uploadProgress = 0,
  sermonTitle = '',
  speakerName = ''
}: SermonAudioUploadProps) => {
  // Use the audio player hook with empty array instead of string
  const {
    isPlaying,
    audioError,
    setAudioError,
    audioRef,
    togglePlayPause,
    handleAudioEnded
  } = useAudioPlayer([], []);

  const handleRemoveAudio = () => {
    setAudioFile(null);
    setAudioUrl(null);
    setAudioError(null);
  };

  // Generate a display name for the audio file based on sermon details
  const getSermonFileName = () => {
    if (audioFile?.name) return audioFile.name;
    if (sermonTitle && speakerName) {
      return `${sermonTitle} - ${speakerName}.mp3`;
    }
    return "sermon-audio.mp3";
  };

  return (
    <div className="space-y-4">
      {/* Audio metadata preview */}
      {(sermonTitle || speakerName) && (
        <div className="bg-church-blue-light/10 rounded-md p-4 border border-church-blue-light/20">
          <div className="flex items-start gap-3">
            <FileAudio className="h-5 w-5 text-church-blue mt-1" />
            <div>
              <h4 className="font-medium text-church-blue-dark mb-1">Audio File Information</h4>
              <p className="text-sm text-church-neutral-700">
                Your audio will be uploaded with the following details:
              </p>
              <dl className="mt-2 space-y-1 text-sm">
                <div className="flex">
                  <dt className="w-20 font-medium">Title:</dt>
                  <dd>{sermonTitle || "(Not set)"}</dd>
                </div>
                <div className="flex">
                  <dt className="w-20 font-medium">Speaker:</dt>
                  <dd>{speakerName || "(Not set)"}</dd>
                </div>
                <div className="flex">
                  <dt className="w-20 font-medium">Filename:</dt>
                  <dd className="font-mono text-xs">{getSermonFileName()}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      )}
      
      <div className="border border-church-neutral-200 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-3">
          <FileAudio className="h-5 w-5 text-church-blue" />
          <Label className="font-medium text-base">Sermon Audio File</Label>
        </div>
        
        <div className="text-sm text-church-neutral-600 mb-4 flex items-start gap-2">
          <Info className="h-4 w-4 text-church-blue-dark shrink-0 mt-0.5" />
          <p>Upload your sermon audio file. Supported formats include MP3, WAV, M4A, and OGG.</p>
        </div>
      
        {/* Hidden audio element for playback */}
        <audio 
          ref={audioRef} 
          src={audioUrl || undefined} 
          onEnded={handleAudioEnded} 
          onError={() => setAudioError('Audio playback error')} 
        />
        
        {/* Upload progress indicator */}
        <AudioUploadProgress 
          isUploading={isUploading}
          uploadProgress={uploadProgress}
          fileName={audioFile?.name}
        />
        
        {/* Display uploaded audio file */}
        {(audioFile || audioUrl) && !isUploading && (
          <AudioFileDisplay
            audioFile={audioFile}
            audioUrl={audioUrl}
            isPlaying={isPlaying}
            audioError={audioError}
            togglePlayPause={togglePlayPause}
            onRemove={handleRemoveAudio}
            displayName={getSermonFileName()}
          />
        )}
        
        {/* Audio upload drop zone */}
        {!isUploading && !audioUrl && !audioFile && (
          <DragDropUploader 
            onFileAccepted={handleAudioUpload}
            category="sermons"
            acceptedFileTypes={['audio/*']} 
            maxSize={500 * 1024 * 1024} // 500MB limit
          />
        )}
        
        {/* Success message */}
        {audioUrl && (
          <AudioSuccessMessage
            audioUrl={audioUrl}
            filename={getSermonFileName()}
          />
        )}
      </div>
    </div>
  );
};

export default SermonAudioUpload;
