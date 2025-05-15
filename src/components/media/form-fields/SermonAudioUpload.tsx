
import React from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Music, Trash2 } from 'lucide-react';
import DragDropUploader from '../DragDropUploader';
import { ImageCategory } from '@/types/imageTypes';

interface SermonAudioUploadProps {
  audioFile: File | null;
  setAudioFile: (file: File | null) => void;
  handleAudioUpload: (file: File, category: ImageCategory) => Promise<boolean>;
  audioUrl: string | null;
  setAudioUrl: (url: string | null) => void;
}

const SermonAudioUpload = ({
  audioFile,
  setAudioFile,
  handleAudioUpload,
  audioUrl,
  setAudioUrl
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
            onClick={() => setAudioUrl(null)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )}
      <DragDropUploader 
        onFileAccepted={handleAudioUpload}
        category="sermons"
        acceptedFileTypes={['audio/*']} 
        maxSize={60 * 1024 * 1024} // 60MB limit
      />
    </div>
  );
};

export default SermonAudioUpload;
