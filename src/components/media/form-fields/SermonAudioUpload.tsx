
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Music, Trash2 } from 'lucide-react';
import DragDropUploader from '../DragDropUploader';
import { ImageCategory } from '@/types/imageTypes';
import { useToast } from '@/hooks/use-toast';

interface SermonAudioUploadProps {
  audioFile: File | null;
  setAudioFile: (file: File | null) => void;
  handleAudioUpload: (file: File, category: ImageCategory) => Promise<boolean>;
}

const SermonAudioUpload = ({
  audioFile,
  setAudioFile,
  handleAudioUpload
}: SermonAudioUploadProps) => {
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);

  // Enhanced audio upload handler with better format detection
  const handleFileUpload = async (file: File, category: ImageCategory) => {
    setError(null);
    
    // Expanded list of accepted audio formats with more variations
    const acceptedFormats = [
      'audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 
      'audio/aac', 'audio/flac', 'audio/m4a', 'audio/x-m4a',
      'audio/mp4', 'audio/x-mp3', 'audio/webm'
    ];
    
    // More flexible file format checking
    const isAcceptedFormat = 
      acceptedFormats.includes(file.type) || 
      file.name.toLowerCase().endsWith('.mp3') ||
      file.name.toLowerCase().endsWith('.m4a') ||
      file.name.toLowerCase().endsWith('.wav') ||
      file.name.toLowerCase().endsWith('.ogg');
    
    if (!isAcceptedFormat) {
      const errorMsg = `Unsupported file format. Supported formats are: MP3, WAV, OGG, AAC, FLAC, M4A`;
      setError(errorMsg);
      toast({
        title: "Invalid file format",
        description: errorMsg,
        variant: "destructive",
      });
      return false;
    }
    
    // Check file size (50MB limit)
    const MAX_SIZE = 50 * 1024 * 1024; // 50MB
    if (file.size > MAX_SIZE) {
      const errorMsg = `File is too large. Maximum size is 50MB.`;
      setError(errorMsg);
      toast({
        title: "File too large",
        description: errorMsg,
        variant: "destructive",
      });
      return false;
    }
    
    // Set the audio file in the parent component first
    setAudioFile(file);
    
    // Then try to upload it
    try {
      console.log('Uploading audio file:', file.name, 'type:', file.type);
      const result = await handleAudioUpload(file, category);
      
      if (result) {
        toast({
          title: "Audio uploaded",
          description: `File "${file.name}" has been uploaded successfully.`,
        });
        return true;
      } else {
        throw new Error("Upload returned false");
      }
    } catch (err) {
      console.error("Audio upload error:", err);
      setError("Failed to upload audio file. Please try again.");
      toast({
        title: "Upload failed",
        description: "There was an error uploading your audio file. Check console for details.",
        variant: "destructive",
      });
      return false;
    }
  };

  return (
    <div>
      <Label className="block mb-2">Sermon Audio File (MP3, WAV, OGG, etc.)</Label>
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
            onClick={() => setAudioFile(null)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )}
      {error && (
        <div className="mb-4 p-2 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
          {error}
        </div>
      )}
      <DragDropUploader 
        onFileAccepted={handleFileUpload}
        category="sermons"
        acceptedFileTypes={[
          'audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 
          'audio/aac', 'audio/flac', 'audio/m4a', 'audio/x-m4a',
          'audio/mp4', 'audio/x-mp3', 'audio/webm'
        ]}
        maxSize={50 * 1024 * 1024} // 50MB limit
      />
    </div>
  );
};

export default SermonAudioUpload;
