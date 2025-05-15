
import React from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Music, Trash2, Loader2 } from 'lucide-react';
import DragDropUploader from '../DragDropUploader';
import { ImageCategory } from '@/types/imageTypes';

interface SermonAudioUploadProps {
  audioFile: File | null;
  setAudioFile: (file: File | null) => void;
  handleAudioUpload: (file: File, category: ImageCategory) => Promise<boolean>;
  audioUrl: string | null;
  setAudioUrl: (url: string | null) => void;
  isUploading?: boolean;
}

const SermonAudioUpload = ({
  audioFile,
  setAudioFile,
  handleAudioUpload,
  audioUrl,
  setAudioUrl,
  isUploading = false
}: SermonAudioUploadProps) => {
  return (
    <div>
      <Label className="block mb-2">Sermon Audio File (All Audio Formats)</Label>
      {audioFile && (
        <div className="mb-4 p-3 bg-church-neutral-50 rounded-md flex items-center justify-between">
          <div className="flex items-center">
            <Music className="h-5 w-5 text-church-blue mr-2" />
            <span className="text-sm font-medium truncate max-w-[200px]">
              {audioFile.name}
            </span>
          </div>
          <Button 
            type="button" 
            variant="ghost" 
            size="sm"
            disabled={isUploading}
            onClick={() => {
              setAudioFile(null);
              setAudioUrl(null);
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )}
      {audioUrl && !audioFile && (
        <div className="mb-4 p-3 bg-church-neutral-50 rounded-md flex items-center justify-between">
          <div className="flex items-center">
            <Music className="h-5 w-5 text-church-blue mr-2" />
            <span className="text-sm font-medium truncate max-w-[200px]">
              {audioUrl.split('/').pop()}
            </span>
          </div>
          <Button 
            type="button" 
            variant="ghost" 
            size="sm"
            disabled={isUploading}
            onClick={() => setAudioUrl(null)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )}
      
      {isUploading ? (
        <div className="flex items-center justify-center p-4 bg-church-neutral-50 rounded-md border border-dashed border-church-neutral-300">
          <Loader2 className="h-5 w-5 text-church-blue mr-2 animate-spin" />
          <span className="text-sm font-medium">Uploading audio file...</span>
        </div>
      ) : (
        <DragDropUploader 
          onFileAccepted={handleAudioUpload}
          category="sermons"
          acceptedFileTypes={['audio/*']} 
          maxSize={60 * 1024 * 1024} // 60MB limit
        />
      )}
      
      {audioUrl && (
        <div className="mt-4 p-3 bg-green-50 border border-green-100 rounded-md">
          <p className="text-sm text-green-700">Audio file uploaded successfully and will be attached to this sermon.</p>
          <audio className="mt-2 w-full" src={audioUrl} controls></audio>
        </div>
      )}
    </div>
  );
};

export default SermonAudioUpload;
