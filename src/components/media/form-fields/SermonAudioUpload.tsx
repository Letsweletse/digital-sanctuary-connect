
import React from 'react';
import { Label } from '@/components/ui/label';
import DragDropUploader from '../DragDropUploader';
import { ImageCategory } from '@/types/imageTypes';
import AudioFileDisplay from '../audio/AudioFileDisplay';
import AudioUploadProgress from '../audio/AudioUploadProgress';
import { AudioSuccessMessage } from '../audio/AudioSuccessMessage';
import { useAudioPlayer } from '../audio/AudioPlayerHook';

interface SermonAudioUploadProps {
  audioFile: File | null;
  setAudioFile: (file: File | null) => void;
  handleAudioUpload: (file: File, category: ImageCategory) => Promise<boolean>;
  audioUrl: string | null;
  setAudioUrl: (url: string | null) => void;
  isUploading?: boolean;
  uploadProgress?: number;
}

const SermonAudioUpload = ({
  audioFile,
  setAudioFile,
  handleAudioUpload,
  audioUrl,
  setAudioUrl,
  isUploading = false,
  uploadProgress = 0
}: SermonAudioUploadProps) => {
  const {
    isAudioTestable,
    isTestingAudio, 
    setIsTestingAudio,
    isPlaying,
    audioError,
    setAudioError,
    audioRef,
    togglePlayPause,
    handleAudioEnded
  } = useAudioPlayer(audioUrl);

  const handleRemoveAudio = () => {
    setAudioFile(null);
    setAudioUrl(null);
    setAudioError(null);
  };

  return (
    <div>
      <Label className="block mb-2">Sermon Audio File (All Audio Formats)</Label>
      
      {/* Hidden audio element for playback */}
      <audio 
        ref={audioRef} 
        src={audioUrl || undefined} 
        onEnded={handleAudioEnded} 
        onError={() => setAudioError('Audio playback error')} 
      />
      
      <AudioUploadProgress 
        isUploading={isUploading}
        uploadProgress={uploadProgress}
        fileName={audioFile?.name}
      />
      
      {(audioFile || audioUrl) && !isUploading && (
        <AudioFileDisplay
          audioFile={audioFile}
          audioUrl={audioUrl}
          isPlaying={isPlaying}
          audioError={audioError}
          togglePlayPause={togglePlayPause}
          onRemove={handleRemoveAudio}
        />
      )}
      
      {!isUploading && !audioUrl && !audioFile && (
        <DragDropUploader 
          onFileAccepted={handleAudioUpload}
          category="sermons"
          acceptedFileTypes={['audio/*']} 
          maxSize={500 * 1024 * 1024} // 500MB limit
        />
      )}
      
      <AudioSuccessMessage
        audioUrl={audioUrl}
        filename={audioFile?.name || "sermon-audio.mp3"}
      />
    </div>
  );
};

export default SermonAudioUpload;
