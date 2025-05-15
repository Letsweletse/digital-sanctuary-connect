
import { useToast } from '@/hooks/use-toast';

export const useAudioValidation = () => {
  const { toast } = useToast();
  
  // Check if URL is a valid audio URL
  const isValidAudioUrl = (url: string): boolean => {
    // Check if it's a Supabase URL or a blob URL
    return (
      (url.startsWith('https://') && url.includes('storage.googleapis.com')) || 
      url.startsWith('blob:') || 
      url.startsWith('https://lojchdvtwypjqupsjynf.supabase.co/storage/')
    );
  };
  
  // Validate audio URL and show toast if invalid
  const validateAudioUrl = (url: string | null | undefined): boolean => {
    if (!url) {
      return false;
    }
    
    if (!isValidAudioUrl(url)) {
      console.error('Invalid audio URL:', url);
      toast({
        title: "Invalid Audio URL",
        description: "The audio file for this sermon cannot be played. Please check the URL.",
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };
  
  return {
    isValidAudioUrl,
    validateAudioUrl
  };
};
