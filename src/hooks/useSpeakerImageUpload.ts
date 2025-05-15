
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ImageCategory } from '@/types/imageTypes';
import { supabase } from '@/integrations/supabase/client';

export const useSpeakerImageUpload = () => {
  const { toast } = useToast();
  const [speakerImage, setSpeakerImage] = useState<string>('');
  const [speakerImageFile, setSpeakerImageFile] = useState<File | null>(null);

  // Helper function to upload speaker image to Supabase
  const uploadSpeakerImageToSupabase = async (file: File) => {
    try {
      const timestamp = new Date().getTime();
      const fileExt = file.name.split('.').pop();
      const fileName = `${timestamp}-${file.name.substring(0, 20).replace(/[^a-zA-Z0-9]/g, '_')}.${fileExt}`;
      const filePath = `speakers/${fileName}`;
      
      const { data, error } = await supabase.storage
        .from('sermons')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });
        
      if (error) {
        console.error('Error uploading speaker image:', error);
        return null;
      }
      
      const { data: { publicUrl } } = supabase.storage
        .from('sermons')
        .getPublicUrl(filePath);
      
      return publicUrl;
    } catch (err) {
      console.error('Unexpected error during speaker image upload:', err);
      return null;
    }
  };

  // Handle speaker image upload
  const handleSpeakerImageUpload = async (file: File, category: ImageCategory) => {
    if (file) {
      // In a real app, upload the file to a server and get the URL
      setSpeakerImage(URL.createObjectURL(file));
      setSpeakerImageFile(file);
      
      console.log('Speaker image uploaded:', file.name);
      
      toast({
        title: "Image uploaded",
        description: "Speaker image has been uploaded.",
      });
      
      return true;
    }
    return false;
  };

  return {
    speakerImage,
    setSpeakerImage,
    speakerImageFile,
    setSpeakerImageFile,
    uploadSpeakerImageToSupabase,
    handleSpeakerImageUpload
  };
};
