
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ImageCategory } from '@/types/imageTypes';
import { supabase } from '@/integrations/supabase/client';

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

  // Create Supabase bucket if it doesn't exist
  const ensureSermonsBucketExists = async () => {
    try {
      // Check if the bucket exists
      const { data: buckets, error: listError } = await supabase.storage.listBuckets();
      
      if (listError) {
        console.error('Error checking buckets:', listError);
        return false;
      }
      
      const bucketExists = buckets?.some(bucket => bucket.name === 'sermons');
      
      if (!bucketExists) {
        console.log('Creating sermons bucket...');
        const { error: createError } = await supabase.storage.createBucket('sermons', {
          public: true,
          fileSizeLimit: 500 * 1024 * 1024, // 500MB limit
        });
        
        if (createError) {
          console.error('Error creating sermons bucket:', createError);
          return false;
        }
        
        console.log('Sermons bucket created successfully');
      }
      
      return true;
    } catch (err) {
      console.error('Error ensuring sermons bucket exists:', err);
      return false;
    }
  };

  // Upload audio file to Supabase with real progress tracking
  const uploadAudioToSupabase = async (file: File, category: string) => {
    setIsUploading(true);
    setUploadProgress(0);
    console.log(`Starting audio upload to Supabase: ${file.name} (${(file.size / (1024 * 1024)).toFixed(2)} MB)`);
    
    try {
      // Ensure the bucket exists
      const bucketReady = await ensureSermonsBucketExists();
      if (!bucketReady) {
        toast({
          title: 'Storage Error',
          description: 'Could not prepare storage for uploads. Please try again.',
          variant: 'destructive',
        });
        setIsUploading(false);
        return { success: false, url: null };
      }
      
      // Generate a unique filename with timestamp
      const timestamp = new Date().getTime();
      const fileExt = file.name.split('.').pop();
      // Create a clean filename by removing special characters
      const cleanFileName = file.name.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 20);
      const fileName = `${timestamp}-${cleanFileName}.${fileExt}`;
      const filePath = `${category}/${fileName}`;
      
      console.log('Uploading audio to path:', filePath);
      
      // Set up manual progress tracking
      let lastProgressUpdate = Date.now();
      const progressInterval = setInterval(() => {
        // Gradually increase progress during upload
        setUploadProgress(prev => {
          // Once we're over 90%, stop incrementing to avoid false completion
          if (prev >= 90) return 90;
          return Math.min(90, prev + Math.random() * 5);
        });
      }, 800);
      
      // Upload the file to Supabase Storage
      const { data, error } = await supabase.storage
        .from('sermons')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true, // Allow overwriting existing files
          contentType: file.type, // Set correct content type
        });
        
      clearInterval(progressInterval);
      
      if (error) {
        console.error('Error uploading file to Supabase:', error);
        toast({
          title: 'Upload Error',
          description: error.message || 'Failed to upload audio file',
          variant: 'destructive',
        });
        setIsUploading(false);
        setUploadProgress(0);
        return { success: false, url: null };
      }
      
      console.log('File uploaded successfully:', data?.path);
      setUploadProgress(100);
      
      // Get the public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from('sermons')
        .getPublicUrl(filePath);
      
      console.log('File uploaded successfully, public URL:', publicUrl);
      
      // Verify the URL using a HEAD request
      try {
        const response = await fetch(publicUrl, { method: 'HEAD' });
        if (!response.ok) {
          console.warn('Audio URL may not be publicly accessible:', publicUrl, response.status);
          toast({
            title: "Warning",
            description: "Audio was uploaded but may have limited accessibility. Please test playback.",
            variant: "warning",
          });
        } else {
          console.log('Audio URL is publicly accessible:', publicUrl);
        }
      } catch (testErr) {
        console.warn('Error testing audio URL:', testErr);
      }
      
      // Set a small delay before returning to allow the storage to process the file
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setAudioUrl(publicUrl);
      setIsUploading(false);
      
      return { success: true, url: publicUrl, path: data?.path };
    } catch (err) {
      console.error('Unexpected error during upload:', err);
      toast({
        title: 'Upload Error',
        description: 'An unexpected error occurred during upload',
        variant: 'destructive',
      });
      setIsUploading(false);
      setUploadProgress(0);
      return { success: false, url: null };
    }
  };

  // Handle audio file upload
  const handleAudioUpload = async (file: File, category: ImageCategory) => {
    console.log('Audio upload handler called with file:', file.name, `(${(file.size / (1024 * 1024)).toFixed(2)} MB)`);
    
    if (file) {
      setAudioFile(file);
      
      // Create an audio element to get duration
      const audio = new Audio();
      audio.src = URL.createObjectURL(file);
      
      // Wait for audio metadata to load to get duration
      await new Promise<void>((resolve) => {
        audio.onloadedmetadata = () => {
          // Store duration and size as metadata
          setAudioMetadata({
            duration: audio.duration,
            size: file.size
          });
          
          console.log('Audio metadata loaded:',
            'Duration:', audio.duration,
            'Size:', (file.size / (1024 * 1024)).toFixed(2), 'MB');
          resolve();
        };
        
        // Fallback if metadata can't be loaded
        audio.onerror = () => {
          console.warn('Could not load audio metadata');
          resolve();
        };
        
        // Timeout after 5 seconds if metadata loading hangs
        setTimeout(resolve, 5000);
      });
      
      // Automatically start upload when file is selected
      const result = await uploadAudioToSupabase(file, 'sermons');
      if (result.success && result.url) {
        setAudioUrl(result.url);
        
        toast({
          title: "Audio uploaded",
          description: `File "${file.name}" has been uploaded and is ready to use.`,
        });
        
        return true;
      }
      
      return false;
    }
    return false;
  };

  // Get audio duration 
  const getAudioDuration = (): number | undefined => {
    return audioMetadata.duration;
  };

  // Format duration as mm:ss or hh:mm:ss
  const getFormattedDuration = (): string => {
    const duration = getAudioDuration();
    if (!duration) return "00:00";
    
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = Math.floor(duration % 60);
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Get formatted file size
  const getFormattedFileSize = (): string => {
    if (!audioMetadata.size) return "Unknown size";
    
    const sizeInMB = audioMetadata.size / (1024 * 1024);
    return `${sizeInMB.toFixed(2)} MB`;
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
