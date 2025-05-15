
import React from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Music, Trash2, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import DragDropUploader from '../DragDropUploader';
import { ImageCategory } from '@/types/imageTypes';
import { Alert, AlertDescription } from '@/components/ui/alert';

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
  // Function to test if audio can be played
  const testAudioPlayback = async (url: string) => {
    try {
      const audio = new Audio();
      audio.src = url;
      await new Promise<void>((resolve, reject) => {
        audio.oncanplaythrough = () => resolve();
        audio.onerror = () => reject(new Error('Audio cannot be played'));
        // Set timeout in case it hangs
        setTimeout(() => reject(new Error('Audio load timeout')), 5000);
      });
      return true;
    } catch (err) {
      console.error('Audio test failed:', err);
      return false;
    }
  };

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
        <div className="flex items-center justify-center p-6 bg-church-neutral-50 rounded-md border border-dashed border-church-neutral-300">
          <div className="flex flex-col items-center">
            <Loader2 className="h-6 w-6 text-church-blue mb-2 animate-spin" />
            <span className="text-sm font-medium">Uploading audio file...</span>
            <p className="text-xs text-church-neutral-500 mt-1">This may take a minute for larger files</p>
          </div>
        </div>
      ) : (
        <DragDropUploader 
          onFileAccepted={handleAudioUpload}
          category="sermons"
          acceptedFileTypes={['audio/*']} 
          maxSize={100 * 1024 * 1024} // 100MB limit
        />
      )}
      
      {audioUrl && (
        <div className="mt-4 p-4 rounded-md">
          <div className="flex items-center gap-2 mb-2 text-green-700">
            <CheckCircle className="h-5 w-5" />
            <span className="font-medium">Audio file uploaded successfully</span>
          </div>
          
          <div className="bg-white p-3 rounded-md border border-church-neutral-200 shadow-sm">
            <audio 
              className="w-full" 
              src={audioUrl} 
              controls
              onError={(e) => {
                console.error('Audio playback error:', e);
              }} 
            />
            <div className="flex justify-between items-center mt-2 text-xs text-church-neutral-600">
              <span>Audio preview</span>
              <a 
                href={audioUrl} 
                target="_blank"
                rel="noopener noreferrer" 
                className="text-church-blue hover:underline"
              >
                Test in new window
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SermonAudioUpload;
