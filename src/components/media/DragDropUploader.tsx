import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { UploadIcon, XIcon, CheckIcon, AlertCircle } from 'lucide-react';
import { ImageCategory } from '@/types/imageTypes';
import { sendImageUploadEmail } from '@/lib/emailService';

interface DragDropUploaderProps {
  onFileAccepted: (file: File, category: ImageCategory) => Promise<boolean>;
  category: ImageCategory;
  acceptedFileTypes?: string[];
  maxSize?: number;
  // Compatible with MediaUploader props structure
  onUpload?: (file: File, uploadCategory: ImageCategory) => Promise<boolean>;
  isUploaded?: boolean;
  isUploading?: boolean;
  maxFileSizeMB?: number;
}

const DragDropUploader = ({
  onFileAccepted,
  category,
  acceptedFileTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  maxSize = 5242880, // 5MB
  onUpload,
  isUploaded,
  isUploading,
  maxFileSizeMB
}: DragDropUploaderProps) => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(isUploading || false);
  const [uploadSuccess, setUploadSuccess] = useState<boolean | null>(isUploaded === true ? true : null);
  const [uploadPercent, setUploadPercent] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Use the appropriate handler function
  const handleFile = onUpload || onFileAccepted;
  
  // Convert maxFileSizeMB to bytes if provided
  const fileSizeLimit = maxFileSizeMB ? maxFileSizeMB * 1024 * 1024 : maxSize;

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    const file = acceptedFiles[0]; // Just handle the first file
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
      const result = await handleFile(file, category);
      setUploadSuccess(result);
      setUploadPercent(100);
      
      if (result) {
        console.log(`Upload successful for ${file.name} to category ${category}`);
        toast({
          title: "Upload Complete",
          description: "Your image has been uploaded successfully.",
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
          description: "There was a problem uploading your image.",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Error in onFileAccepted:", err);
      setUploadSuccess(false);
      setErrorMessage(err instanceof Error ? err.message : "Unknown error");
      toast({
        title: "Upload Failed",
        description: "Could not process image. Please try again.",
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
  }, [handleFile, category, toast]);

  // Handle paste from clipboard
  const handlePaste = async (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    
    for (const item of Array.from(items)) {
      // Check if the pasted item is an image
      if (item.type.indexOf('image') === 0) {
        console.log(`Pasted image of type: ${item.type}`);
        const file = item.getAsFile();
        if (file) {
          await onDrop([file]);
          break;
        }
      }
    }
  };
  
  // Handle the accept prop for useDropzone - updated to handle 'audio/*'
  const getAcceptProp = () => {
    // Check if we're accepting all audio files
    if (acceptedFileTypes.includes('audio/*')) {
      return {
        'audio/*': []
      };
    }
    
    // Otherwise process as normal
    return acceptedFileTypes.reduce((obj: any, type) => {
      obj[type] = [];
      return obj;
    }, {});
  };
  
  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
    onDrop,
    accept: getAcceptProp(),
    maxSize: fileSizeLimit,
    multiple: false
  });
  
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  // Retry upload button handler
  const handleRetry = () => {
    setIsProcessing(false);
    setUploadSuccess(null);
    setUploadPercent(0);
    setErrorMessage(null);
  };

  return (
    <div 
      className="w-full" 
      onPaste={handlePaste}
      tabIndex={0} // Make div focusable to receive paste events
    >
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer transition-colors duration-200 ${
          isDragActive ? 'bg-primary/5 border-primary' : 'hover:bg-secondary/10'
        } ${isDragAccept ? 'border-green-500' : ''} ${isDragReject ? 'border-red-500' : ''}`}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center justify-center gap-3 p-4">
          {isProcessing ? (
            <div className="w-full">
              <div className="flex justify-between mb-1 text-xs">
                <span>{uploadSuccess === null ? 'Uploading...' : (uploadSuccess ? 'Complete' : 'Failed')}</span>
                <span>{uploadPercent}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-1.5 mb-3">
                <div 
                  className={`h-1.5 rounded-full ${uploadSuccess === false ? 'bg-red-500' : 'bg-blue-600'}`}
                  style={{ width: `${uploadPercent}%` }}
                ></div>
              </div>
              {uploadSuccess !== null && (
                <div className="flex flex-col items-center justify-center mt-2">
                  {uploadSuccess ? (
                    <div className="flex items-center text-green-600">
                      <CheckIcon className="w-4 h-4 mr-1" />
                      <span className="text-sm">Upload complete</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-red-600">
                      <div className="flex items-center">
                        <XIcon className="w-4 h-4 mr-1" />
                        <span className="text-sm">Upload failed</span>
                      </div>
                      {errorMessage && <span className="text-xs mt-1">{errorMessage}</span>}
                      <Button onClick={handleRetry} variant="outline" size="sm" className="mt-2">
                        Try Again
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <>
              <UploadIcon className="h-10 w-10 text-muted-foreground" />
              <div className="space-y-2">
                <p className="text-base font-medium">Drag & drop image here</p>
                <p className="text-sm text-muted-foreground">
                  Or click to browse files
                </p>
                <Badge variant="outline" className="mt-2">
                  Max size: {formatFileSize(fileSizeLimit)}
                </Badge>
                <div className="flex justify-center">
                  <Button variant="secondary" size="sm" className="mt-2">
                    Select Image
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  You can also paste an image from your clipboard
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DragDropUploader;
