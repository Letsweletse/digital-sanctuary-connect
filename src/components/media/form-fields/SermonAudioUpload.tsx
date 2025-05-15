
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Music, Trash2, Loader2, AlertCircle, CheckCircle, Download, Play, Pause } from 'lucide-react';
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
  const { toast } = useToast();
  const [isAudioTestable, setIsAudioTestable] = useState<boolean>(false);
  const [isTestingAudio, setIsTestingAudio] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  // Check if audio exists after component mount
  useEffect(() => {
    if (audioUrl) {
      validateAudioUrl(audioUrl);
    }
  }, [audioUrl]);

  // Validate audio URL
  const validateAudioUrl = async (url: string) => {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      if (response.ok) {
        setIsAudioTestable(true);
        setAudioError(null);
      } else {
        setIsAudioTestable(false);
        setAudioError(`Audio file not accessible (Status: ${response.status})`);
      }
    } catch (err) {
      console.error('Error validating audio URL:', err);
      setIsAudioTestable(false);
      setAudioError('Unable to validate audio file');
    }
  };

  // Function to test if audio can be played
  const testAudioPlayback = async (url: string) => {
    try {
      setIsTestingAudio(true);
      const audio = new Audio();
      audio.src = url;
      
      await new Promise<void>((resolve, reject) => {
        audio.oncanplaythrough = () => {
          setIsAudioTestable(true);
          setAudioError(null);
          resolve();
        };
        audio.onerror = (e) => {
          console.error('Audio test error:', e);
          setAudioError('Audio cannot be played');
          reject(new Error('Audio cannot be played'));
        };
        // Set timeout in case it hangs
        setTimeout(() => reject(new Error('Audio load timeout')), 10000);
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

  // Play/pause control
  const togglePlayPause = () => {
    if (!audioRef.current || !audioUrl) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise.then(() => {
          setIsPlaying(true);
        }).catch(err => {
          console.error('Error playing audio:', err);
          setAudioError('Unable to play audio file');
          toast({
            title: "Playback Error",
            description: "There was a problem playing the audio file.",
            variant: "destructive",
          });
        });
      }
    }
  };

  // Audio ended handler
  const handleAudioEnded = () => {
    setIsPlaying(false);
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
      
      {/* Hidden audio element for playback */}
      <audio 
        ref={audioRef} 
        src={audioUrl || undefined} 
        onEnded={handleAudioEnded} 
        onError={() => setAudioError('Audio playback error')} 
      />
      
      {isUploading && (
        <div className="mb-6 p-4 bg-church-neutral-50 rounded-md border border-church-neutral-200">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-sm">Uploading {audioFile?.name}</h4>
            <span className="text-sm text-church-blue">{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} className="h-2" />
          <p className="text-xs text-church-neutral-500 mt-2">
            Please wait while your audio file is being uploaded to the server...
          </p>
        </div>
      )}
      
      {(audioFile || audioUrl) && !isUploading && (
        <div className="mb-4 p-4 bg-church-neutral-50 rounded-md border border-church-neutral-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <Music className="h-5 w-5 text-church-blue mr-2 flex-shrink-0" />
              <span className="text-sm font-medium truncate max-w-[200px]">
                {getFileDisplayName()}
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
                    onClick={handleDownload}
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
                disabled={isUploading}
                onClick={() => {
                  setAudioFile(null);
                  setAudioUrl(null);
                  setAudioError(null);
                }}
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
                onError={(e) => {
                  console.error('Audio playback error:', e);
                  setAudioError('Audio preview failed to load');
                }} 
              />
            </div>
          )}
        </div>
      )}
      
      {!isUploading && !audioUrl && !audioFile && (
        <DragDropUploader 
          onFileAccepted={handleAudioUpload}
          category="sermons"
          acceptedFileTypes={['audio/*']} 
          maxSize={500 * 1024 * 1024} // 500MB limit
        />
      )}
      
      {audioUrl && !isUploading && !audioError && (
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
