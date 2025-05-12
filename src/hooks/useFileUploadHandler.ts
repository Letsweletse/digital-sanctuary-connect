
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ImageCategory } from '@/types/imageTypes';
import { sendImageUploadEmail } from '@/lib/emailService';

interface UseFileUploadHandlerProps {
  onFileAccepted: (file: File, category: ImageCategory) => Promise<boolean>;
  category: ImageCategory;
}

export const useFileUploadHandler = ({ onFileAccepted, category }: UseFileUploadHandlerProps) => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState<boolean | null>(null);
  const [uploadPercent, setUploadPercent] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFile = useCallback(async (file: File) => {
    setIsProcessing(true);
    setUploadSuccess(null);
    setErrorMessage(null);
    
    // Log the file being uploaded
    console.log(`Uploading file: ${file.name}, size: ${(file.size / 1024).toFixed(1)}KB, type: ${file.type}`);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadPercent(prev => {
        const newValue = prev + 15;
        return newValue > 95 ? 95 : newValue;
      });
    }, 200);
    
    try {
      const result = await onFileAccepted(file, category);
      setUploadSuccess(result);
      setUploadPercent(100);
      
      if (result) {
        console.log(`Upload successful for ${file.name} to category ${category}`);
        toast({
          title: "Upload Complete",
          description: "Your file has been uploaded successfully.",
        });
        
        // Send email notification to admins
        try {
          sendImageUploadEmail(file.name, category);
        } catch (emailError) {
          console.warn('Email notification failed, but upload succeeded:', emailError);
        }
      } else {
        console.error(`Upload failed for ${file.name}`);
        setErrorMessage("Upload failed. Please try again.");
        toast({
          title: "Upload Failed",
          description: "There was a problem uploading your file.",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Error in onFileAccepted:", err);
      setUploadSuccess(false);
      setErrorMessage(err instanceof Error ? err.message : "Unknown error");
      toast({
        title: "Upload Failed",
        description: "Could not process file. Please try again.",
        variant: "destructive",
      });
    } finally {
      clearInterval(interval);
      setTimeout(() => {
        if (uploadSuccess) {
          // Reset form only if upload was successful
          setIsProcessing(false);
          setUploadPercent(0);
        }
      }, 1500);
    }
  }, [onFileAccepted, category, toast]);

  const handleRetry = useCallback(() => {
    setIsProcessing(false);
    setUploadSuccess(null);
    setUploadPercent(0);
    setErrorMessage(null);
  }, []);

  return {
    isProcessing,
    uploadSuccess,
    uploadPercent,
    errorMessage,
    handleFile,
    handleRetry
  };
};

export default useFileUploadHandler;
