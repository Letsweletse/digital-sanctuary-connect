
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ImageCategory } from '@/types/imageTypes';
import { supabase } from '@/integrations/supabase/client';

export const useSermonAudioUpload = () => {
  const { toast } = useToast();
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  // Upload audio file to Supabase
  const uploadAudioToSupabase = async (file: File, category: string) => {
    setIsUploading(true);
    console.log('Starting audio upload to Supabase:', file.name);
    
    try {
      // Generate a unique filename with timestamp
      const timestamp = new Date().getTime();
      const fileExt = file.name.split('.').pop();
      const fileName = `${timestamp}-${file.name.substring(0, 20).replace(/[^a-zA-Z0-9]/g, '_')}.${fileExt}`;
      const filePath = `${category}/${fileName}`;
      
      console.log('Uploading audio to path:', filePath);
      
      // Create sermons bucket if it doesn't exist
      const { data: buckets } = await supabase.storage.listBuckets();
      if (!buckets?.some(bucket => bucket.name === 'sermons')) {
        console.log('Creating sermons bucket...');
        await supabase.storage.createBucket('sermons', {
          public: true,
          fileSizeLimit: 100 * 1024 * 1024, // 100MB limit
        });
      }
      
      // Upload the file to Supabase Storage
      const { data, error } = await supabase.storage
        .from('sermons')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true, // Changed to true to allow overwriting existing files
        });
        
      if (error) {
        console.error('Error uploading file to Supabase:', error);
        toast({
          title: 'Upload Error',
          description: error.message || 'Failed to upload audio file',
          variant: 'destructive',
        });
        setIsUploading(false);
        return { success: false, url: null };
      }
      
      // Get the public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from('sermons')
        .getPublicUrl(filePath);
      
      console.log('File uploaded successfully, public URL:', publicUrl);
      
      // Test the URL to make sure it's accessible
      try {
        const response = await fetch(publicUrl, { method: 'HEAD' });
        if (!response.ok) {
          console.warn('Audio URL may not be publicly accessible:', publicUrl);
        }
      } catch (testErr) {
        console.warn('Error testing audio URL:', testErr);
      }
      
      setAudioUrl(publicUrl);
      setIsUploading(false);
      
      return { success: true, url: publicUrl };
    } catch (err) {
      console.error('Unexpected error during upload:', err);
      toast({
        title: 'Upload Error',
        description: 'An unexpected error occurred during upload',
        variant: 'destructive',
      });
      setIsUploading(false);
      return { success: false, url: null };
    }
  };

  // Handle audio file upload
  const handleAudioUpload = async (file: File, category: ImageCategory) => {
    console.log('Audio upload handler called with file:', file.name);
    
    if (file) {
      setAudioFile(file);
      
      // Create an audio element to get duration
      const audio = new Audio();
      audio.src = URL.createObjectURL(file);
      
      // Wait for audio metadata to load to get duration
      await new Promise<void>((resolve) => {
        audio.onloadedmetadata = () => {
          // Store duration in the file object for later use
          (file as any).duration = audio.duration;
          console.log('Audio duration:', audio.duration);
          resolve();
        };
        
        // Fallback if metadata can't be loaded
        audio.onerror = () => {
          console.warn('Could not load audio metadata');
          resolve();
        };
        
        // Timeout after 3 seconds if metadata loading hangs
        setTimeout(resolve, 3000);
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

  return {
    audioFile,
    setAudioFile,
    audioUrl,
    setAudioUrl,
    isUploading,
    uploadAudioToSupabase,
    handleAudioUpload
  };
};
