
import React from 'react';
import { toast } from '@/hooks/use-toast';

interface AudioValidationHelperProps {
  audioUrl: string | null;
}

export const validateAudioUrl = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (err) {
    console.error('Error validating audio URL:', err);
    return false;
  }
};

export const testAudioPlayback = async (url: string): Promise<boolean> => {
  try {
    const audio = new Audio();
    audio.src = url;
    
    await new Promise<void>((resolve, reject) => {
      audio.oncanplaythrough = () => resolve();
      audio.onerror = () => reject(new Error('Audio cannot be played'));
      setTimeout(() => reject(new Error('Audio load timeout')), 10000);
    });
    
    toast({
      title: "Audio Test Successful",
      description: "The audio file can be played successfully.",
    });
    return true;
  } catch (err) {
    console.error('Audio test failed:', err);
    toast({
      title: "Audio Test Failed",
      description: "There was an issue playing this audio file. Please try uploading again.",
      variant: "destructive",
    });
    return false;
  }
};

export const getFileDisplayName = (audioFile: File | null, audioUrl: string | null): string => {
  if (audioFile) {
    return audioFile.name;
  }
  if (audioUrl) {
    const urlParts = audioUrl.split('/');
    const fileName = urlParts[urlParts.length - 1];
    return decodeURIComponent(fileName).replace(/%20/g, ' ');
  }
  return 'Unknown file';
};

export const handleDownload = (audioUrl: string | null, audioFile: File | null) => {
  if (!audioUrl) return;
  
  const link = document.createElement('a');
  link.href = audioUrl;
  link.download = audioFile?.name || 'sermon-audio.mp3';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  toast({
    title: "Download Started",
    description: "Your sermon audio file is being downloaded.",
  });
};
