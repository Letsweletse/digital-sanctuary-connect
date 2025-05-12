
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { ImageCategory } from '@/types/imageTypes';
import useFileUploadHandler from '@/hooks/useFileUploadHandler';
import UploadArea from './upload/UploadArea';
import UploadProgress from './upload/UploadProgress';
import { getAcceptProp } from './utils/uploadUtils';

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
  // Use the appropriate handler function
  const handleFile = onUpload || onFileAccepted;
  
  // Convert maxFileSizeMB to bytes if provided
  const fileSizeLimit = maxFileSizeMB ? maxFileSizeMB * 1024 * 1024 : maxSize;
  
  const { 
    isProcessing, 
    uploadSuccess, 
    uploadPercent, 
    errorMessage, 
    handleFile: processFile, 
    handleRetry 
  } = useFileUploadHandler({
    onFileAccepted: handleFile,
    category
  });

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    const file = acceptedFiles[0]; // Just handle the first file
    await processFile(file);
  }, [processFile]);
  
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
          await processFile(file);
          break;
        }
      }
    }
  };
  
  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
    onDrop,
    accept: getAcceptProp(acceptedFileTypes),
    maxSize: fileSizeLimit,
    multiple: false
  });
  
  return (
    <div 
      className="w-full" 
      onPaste={handlePaste}
      tabIndex={0} // Make div focusable to receive paste events
    >
      {isProcessing ? (
        <UploadProgress
          uploadPercent={uploadPercent}
          uploadSuccess={uploadSuccess}
          errorMessage={errorMessage}
          isProcessing={isProcessing}
          onRetry={handleRetry}
        />
      ) : (
        <UploadArea
          isDragActive={isDragActive}
          isDragAccept={isDragAccept}
          isDragReject={isDragReject}
          getRootProps={getRootProps}
          getInputProps={getInputProps}
          maxSize={fileSizeLimit}
        />
      )}
    </div>
  );
};

export default DragDropUploader;
