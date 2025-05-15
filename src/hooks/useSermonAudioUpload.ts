
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ImageCategory } from '@/types/imageTypes';
import { supabase } from '@/integrations/supabase/client';

export const useSermonAudioUpload = () => {
  const { toast } = useToast();
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  // Upload audio file to Supabase
  const uploadAudioToSupabase = async (file: File, category: string) => {
    try {
      // Generate a unique filename with timestamp
      const timestamp = new Date().getTime();
      const fileExt = file.name.split('.').pop();
      const fileName = `${timestamp}-${file.name.substring(0, 20).replace(/[^a-zA-Z0-9]/g, '_')}.${fileExt}`;
      const filePath = `${category}/${fileName}`;
      
      // Upload the file to Supabase Storage
      const { data, error } = await supabase.storage
        .from('sermons')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });
        
      if (error) {
        console.error('Error uploading file to Supabase:', error);
        toast({
          title: 'Upload Error',
          description: error.message || 'Failed to upload audio file',
          variant: 'destructive',
        });
        return { success: false, url: null };
      }
      
      // Get the public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from('sermons')
        .getPublicUrl(filePath);
      
      console.log('File uploaded successfully, public URL:', publicUrl);
      
      return { success: true, url: publicUrl };
    } catch (err) {
      console.error('Unexpected error during upload:', err);
      toast({
        title: 'Upload Error',
        description: 'An unexpected error occurred during upload',
        variant: 'destructive',
      });
      return { success: false, url: null };
    }
  };

  // Handle audio file upload
  const handleAudioUpload = async (file: File, category: ImageCategory) => {
    if (file) {
      setAudioFile(file);
      
      console.log('Audio file uploaded:', file.name);
      
      toast({
        title: "Audio uploaded",
        description: `File "${file.name}" has been uploaded.`,
      });
      
      return true;
    }
    return false;
  };

  return {
    audioFile,
    setAudioFile,
    audioUrl,
    setAudioUrl,
    uploadAudioToSupabase,
    handleAudioUpload
  };
};
