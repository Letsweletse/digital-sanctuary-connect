
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Sermon } from '@/types/sermonTypes';
import { supabase } from '@/integrations/supabase/client';
import { ImageCategory } from '@/types/imageTypes';

export const useSermonForm = (sermon?: Sermon, onSubmit?: (sermon: Omit<Sermon, 'id'>) => void) => {
  const { toast } = useToast();
  
  // Form state
  const [title, setTitle] = useState(sermon?.title || '');
  const [speaker, setSpeaker] = useState(sermon?.speaker || '');
  const [date, setDate] = useState<Date>(sermon?.date ? new Date(sermon.date) : new Date());
  const [description, setDescription] = useState(sermon?.description || '');
  const [youtubeId, setYoutubeId] = useState(sermon?.youtubeId || '');
  const [tags, setTags] = useState(sermon?.tags?.join(', ') || '');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(sermon?.audioUrl || null);
  const [speakerImage, setSpeakerImage] = useState(sermon?.speakerImage || '');
  const [speakerImageFile, setSpeakerImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [series, setSeries] = useState(sermon?.series || '');
  
  // Log for debugging
  useEffect(() => {
    if (sermon) {
      console.log('Editing sermon:', sermon);
    }
  }, [sermon]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!title || !speaker || !date) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const formattedTags = tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
      
      // Upload speaker image if there's a new one
      let speakerImageUrl = speakerImage;
      if (speakerImageFile) {
        const imageUrl = await uploadSpeakerImageToSupabase(speakerImageFile);
        if (imageUrl) {
          speakerImageUrl = imageUrl;
        }
      }
      
      const formData = {
        title,
        speaker,
        speakerImage: speakerImageUrl || '/placeholder.svg',
        date,
        audioUrl: audioUrl || '',
        youtubeId,
        description,
        tags: formattedTags,
        series,
        thumbnailUrl: 'https://lovable.dev/projects/b4242310-0169-49ed-bc97-e6669ce1cf89',
        duration: '00:00', 
      };
      
      console.log('Submitting sermon data:', formData);
      if (onSubmit) {
        onSubmit(formData);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Error",
        description: "An error occurred while saving the sermon. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    title,
    setTitle,
    speaker,
    setSpeaker,
    date,
    setDate,
    description,
    setDescription,
    youtubeId,
    setYoutubeId,
    tags,
    setTags,
    audioFile,
    setAudioFile,
    audioUrl,
    setAudioUrl,
    speakerImage,
    setSpeakerImage,
    isSubmitting,
    series,
    setSeries,
    handleSubmit,
    handleSpeakerImageUpload,
    handleAudioUpload
  };
};
