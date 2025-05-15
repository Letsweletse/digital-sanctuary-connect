import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Sermon, SermonSchema } from '@/types/sermonTypes';
import { ImageCategory } from '@/types/imageTypes';

export const useSermonForm = (sermon: Sermon | undefined, onSubmit: (sermon: Omit<Sermon, 'id'>) => void) => {
  const router = useRouter();
  const { toast } = useToast();
  const [title, setTitle] = useState(sermon?.title || '');
  const [speaker, setSpeaker] = useState(sermon?.speaker || '');
  const [date, setDate] = useState(sermon?.date || new Date());
  const [description, setDescription] = useState(sermon?.description || '');
  const [youtubeId, setYoutubeId] = useState(sermon?.youtubeId || '');
  const [tags, setTags] = useState(sermon?.tags || []);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(sermon?.audioUrl || null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [series, setSeries] = useState(sermon?.series || '');
  const [speakerImage, setSpeakerImage] = useState<File | null>(sermon?.speakerImage || null);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);

      // Validate required fields
      if (!title || !speaker || !date) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Check if either audioFile or youtubeId is provided
      if (!audioFile && !audioUrl && !youtubeId) {
        toast({
          title: "Media Missing",
          description: "Please upload an audio file or provide a YouTube ID.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // If audioFile is provided, but audioUrl is not, show a warning
      if (audioFile && !audioUrl) {
        toast({
          title: "Audio Not Uploaded",
          description: "Please upload an audio file for this sermon or provide a YouTube ID.",
          variant: "destructive", // Change from "warning" to "destructive"
        });
        setIsSubmitting(false);
        return;
      }

      const sermonData: Omit<Sermon, 'id'> = {
        title,
        speaker,
        date,
        description,
        youtubeId,
        tags,
        audioUrl: audioUrl || null,
        series,
        speakerImage: speakerImage ? speakerImage.name : null,
      };

      try {
        SermonSchema.parse(sermonData);
        await onSubmit(sermonData);
        toast({
          title: "Success",
          description: sermon ? "Sermon updated successfully!" : "Sermon added successfully!",
        });
        router.push('/sermons');
      } catch (error: any) {
        console.error("Form submission error:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to submit sermon. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [title, speaker, date, description, youtubeId, tags, audioFile, audioUrl, series, speakerImage, onSubmit, router, toast]
  );

  const handleSpeakerImageUpload = async (file: File, category: ImageCategory) => {
    console.log('Speaker image upload handler called with file:', file.name);
    if (file) {
      setSpeakerImage(file);
      toast({
        title: "Speaker image uploaded",
        description: `File "${file.name}" has been uploaded and is ready to use.`,
      });
      return true;
    }
    return false;
  };

  const handleAudioUpload = async (file: File, category: ImageCategory) => {
    console.log('Audio upload handler called with file:', file.name);
    if (file) {
      setAudioFile(file);
      setAudioUrl('https://example.com/audio/' + file.name); // Placeholder URL
      toast({
        title: "Audio uploaded",
        description: `File "${file.name}" has been uploaded and is ready to use.`,
      });
      return true;
    }
    return false;
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
    isSubmitting,
    isUploading,
    uploadProgress,
    series,
    setSeries,
    speakerImage,
    setSpeakerImage,
    handleSubmit,
    handleSpeakerImageUpload,
    handleAudioUpload
  };
};
