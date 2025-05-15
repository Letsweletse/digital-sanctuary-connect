
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Music, Trash2, Loader2, AlertCircle, CheckCircle, Download } from 'lucide-react';
import DragDropUploader from '../DragDropUploader';
import { ImageCategory } from '@/types/imageTypes';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();
  const [isAudioTestable, setIsAudioTestable] = useState<boolean>(false);
  const [isTestingAudio, setIsTestingAudio] = useState<boolean>(false);

  // Function to test if audio can be played
  const testAudioPlayback = async (url: string) => {
    try {
      setIsTestingAudio(true);
      const audio = new Audio();
      audio.src = url;
      
      await new Promise<void>((resolve, reject) => {
        audio.oncanplaythrough = () => {
          setIsAudioTestable(true);
          resolve();
        };
        audio.onerror = () => reject(new Error('Audio cannot be played'));
        // Set timeout in case it hangs
        setTimeout(() => reject(new Error('Audio load timeout')), 5000);
      });
      
      toast({
        title: "Audio Test Successful",
        description: "The audio file can be played successfully.",
      });
      return true;
    } catch (err) {
      console.error('Audio test failed:', err);
      toast({
        title: "Audio Test Failed",
        description: "There was an issue playing this audio file. Please try uploading again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsTestingAudio(false);
    }
  };

  // Handle downloading the audio file
  const handleDownload = () => {
    if (!audioUrl) return;
    
    // Create an anchor element and trigger download
    const link = document.createElement('a');
    link.href = audioUrl;
    link.download = audioFile?.name || 'sermon-audio.mp3';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Download Started",
      description: "Your sermon audio file is being downloaded.",
    });
  };

  const getFileDisplayName = () => {
    if (audioFile) {
      return audioFile.name;
    }
    if (audioUrl) {
      const urlParts = audioUrl.split('/');
      const fileName = urlParts[urlParts.length - 1];
      return decodeURIComponent(fileName).replace(/%20/g, ' ');
    }
    return 'Unknown file';
  };

  return (
    <div>
      <Label className="block mb-2">Sermon Audio File (All Audio Formats)</Label>
      {(audioFile || audioUrl) && (
        <div className="mb-4 p-3 bg-church-neutral-50 rounded-md">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Music className="h-5 w-5 text-church-blue mr-2" />
              <span className="text-sm font-medium truncate max-w-[200px]">
                {getFileDisplayName()}
              </span>
            </div>
            <div className="flex gap-2">
              {audioUrl && (
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={handleDownload}
                  className="flex items-center gap-1"
                >
                  <Download className="h-4 w-4" />
                  <span className="hidden sm:inline">Download</span>
                </Button>
              )}
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
          </div>
          
          {/* Audio preview */}
          {audioUrl && (
            <div className="bg-white p-2 rounded-md border border-church-neutral-200">
              <audio 
                className="w-full" 
                src={audioUrl} 
                controls
                onError={(e) => {
                  console.error('Audio playback error:', e);
                }} 
              />
            </div>
          )}
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
        <div className="mt-4 p-4 rounded-md bg-green-50 border border-green-100">
          <div className="flex items-center gap-2 mb-2 text-green-700">
            <CheckCircle className="h-5 w-5" />
            <span className="font-medium">Audio file uploaded successfully</span>
          </div>
          
          <div className="text-sm text-green-700">
            <p>
              Your sermon audio is ready to be saved with this form. Make sure to fill out all the required fields and click "Save" to finalize.
            </p>
            
            <div className="flex gap-2 mt-3">
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                disabled={isTestingAudio}
                onClick={() => audioUrl && testAudioPlayback(audioUrl)}
                className="bg-white"
              >
                {isTestingAudio ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Testing...
                  </>
                ) : (
                  'Test Audio'
                )}
              </Button>
              
              {audioUrl && (
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={handleDownload}
                  className="flex items-center gap-1 bg-white"
                >
                  <Download className="h-4 w-4" />
                  Download
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SermonAudioUpload;
