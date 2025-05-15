
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Sermon } from '@/types/sermonTypes';
import { ImageCategory } from '@/types/imageTypes';
import { useSpeakerImageUpload } from './useSpeakerImageUpload';
import { useSermonAudioUpload } from './useSermonAudioUpload';

export const useSermonForm = (sermon?: Sermon, onSubmit?: (sermon: Omit<Sermon, 'id'>) => void) => {
  const { toast } = useToast();
  
  // Use the specialized hooks
  const {
    speakerImage,
    setSpeakerImage,
    speakerImageFile,
    setSpeakerImageFile,
    uploadSpeakerImageToSupabase,
    handleSpeakerImageUpload
  } = useSpeakerImageUpload();
  
  const {
    audioFile,
    setAudioFile,
    audioUrl,
    setAudioUrl,
    uploadAudioToSupabase,
    handleAudioUpload
  } = useSermonAudioUpload();
  
  // Form state
  const [title, setTitle] = useState(sermon?.title || '');
  const [speaker, setSpeaker] = useState(sermon?.speaker || '');
  const [date, setDate] = useState<Date>(sermon?.date ? new Date(sermon.date) : new Date());
  const [description, setDescription] = useState(sermon?.description || '');
  const [youtubeId, setYoutubeId] = useState(sermon?.youtubeId || '');
  const [tags, setTags] = useState(sermon?.tags?.join(', ') || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [series, setSeries] = useState(sermon?.series || '');
  
  // Initialize values from the sermon prop if available
  useEffect(() => {
    if (sermon) {
      console.log('Editing sermon:', sermon);
      setSpeakerImage(sermon.speakerImage || '');
      setAudioUrl(sermon.audioUrl || null);
    }
  }, [sermon]);

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

      // Upload audio file if there's a new one
      let finalAudioUrl = audioUrl;
      if (audioFile) {
        const result = await uploadAudioToSupabase(audioFile, 'sermons');
        if (result.success && result.url) {
          finalAudioUrl = result.url;
        }
      }
      
      const formData = {
        title,
        speaker,
        speakerImage: speakerImageUrl || '/placeholder.svg',
        date,
        audioUrl: finalAudioUrl || '',
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
