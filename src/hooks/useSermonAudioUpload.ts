
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ImageCategory } from '@/types/imageTypes';
import { uploadAudioToSupabase } from '@/services/audioUploadService';
import { extractAudioMetadata, formatAudioDuration, formatFileSize } from '@/utils/audioMetadataUtils';

export const useSermonAudioUpload = () => {
  const { toast } = useToast();
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [audioMetadata, setAudioMetadata] = useState<{
    duration?: number;
    size?: number;
  }>({});

  // Handle audio file upload
  const handleAudioUpload = async (file: File, category: ImageCategory) => {
    console.log('Audio upload handler called with file:', file.name, `(${(file.size / (1024 * 1024)).toFixed(2)} MB)`);
    
    if (file) {
      setAudioFile(file);
      setIsUploading(true);
      setUploadProgress(0);
      
      // Extract audio metadata
      const metadata = await extractAudioMetadata(file);
      setAudioMetadata(metadata);
      
      // Upload the file to Supabase
      const result = await uploadAudioToSupabase(file, 'sermons', (progress) => {
        setUploadProgress(progress);
      });

      setIsUploading(false);
      
      if (result.success && result.url) {
        setAudioUrl(result.url);
        
        toast({
          title: "Audio uploaded",
          description: `File "${file.name}" has been uploaded and is ready to use.`,
        });
        
        return true;
      } else {
        toast({
          title: 'Upload Error',
          description: 'Failed to upload audio file',
          variant: 'destructive',
        });
        
        return false;
      }
    }
    return false;
  };

  // Get audio duration 
  const getAudioDuration = (): number | undefined => {
    return audioMetadata.duration;
  };

  // Format duration as mm:ss or hh:mm:ss
  const getFormattedDuration = (): string => {
    return formatAudioDuration(audioMetadata.duration);
  };

  // Get formatted file size
  const getFormattedFileSize = (): string => {
    return formatFileSize(audioMetadata.size);
  };

  return {
    audioFile,
    setAudioFile,
    audioUrl,
    setAudioUrl,
    isUploading,
    uploadProgress,
    audioMetadata,
    uploadAudioToSupabase,
    handleAudioUpload,
    getAudioDuration,
    getFormattedDuration,
    getFormattedFileSize
  };
};
