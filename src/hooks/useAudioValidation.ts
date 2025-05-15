
import { useToast } from '@/hooks/use-toast';

export const useAudioValidation = () => {
  const { toast } = useToast();
  
  // Check if URL is a valid audio URL
  const isValidAudioUrl = (url: string): boolean => {
    if (!url) return false;
    
    // Check if it's a Supabase URL or a blob URL or other common audio hosting URLs
    return (
      (url.startsWith('https://') && 
        (url.includes('storage.googleapis.com') || 
         url.includes('lojchdvtwypjqupsjynf.supabase.co/storage/') || 
         url.includes('cdn.devdojo.com') ||
         url.includes('sermonaudio.com') ||
         url.includes('buzzsprout.com') ||
         url.includes('soundcloud.com'))) || 
      url.startsWith('blob:') || 
      url.endsWith('.mp3') ||
      url.endsWith('.wav') ||
      url.endsWith('.ogg') ||
      url.endsWith('.m4a')
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
