
import React, { useState } from 'react';
import { useImageLibrary } from '@/hooks/useImageLibrary';
import { ImageCategory } from '@/types/imageTypes';
import DragDropUploader from './DragDropUploader';
import ImageDetails from './ImageDetails';
import ImageLibrary from './ImageLibrary';

const ImageUploader = () => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);
  const maxFileSizeMB = 5;
  
  const {
    uploadedImages,
    selectedImage,
    category,
    handleUpload,
    handleCopyUrl,
    handleDelete,
    handleRefreshImages,
    handleCategoryChange,
    handleImageClick,
    formatDate
  } = useImageLibrary();
  
  const handleFileUpload = async (file: File, uploadCategory: ImageCategory) => {
    setIsUploading(true);
    
    const success = await handleUpload(file, uploadCategory);
    
    setIsUploading(false);
    if (success) {
      setIsUploaded(true);
      
      setTimeout(() => {
        setFile(null);
        setIsUploaded(false);
      }, 3000);
    }
    
    return success;
  };
  
  return (
    <div className="w-full space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-church-neutral-900">Upload New Image</h2>
          
          <DragDropUploader 
            onFileAccepted={handleFileUpload}
            category={category}
            isUploaded={isUploaded}
            isUploading={isUploading}
            maxFileSizeMB={maxFileSizeMB}
          />
        </div>
        
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-church-neutral-900">Image Details</h2>
          
          <ImageDetails
            selectedImage={selectedImage}
            onCopyUrl={handleCopyUrl}
            onDelete={handleDelete}
            formatDate={formatDate}
          />
        </div>
      </div>
      
      <ImageLibrary
        images={uploadedImages}
        category={category === 'general' ? 'all' : category}
        selectedImage={selectedImage}
        onImageClick={handleImageClick}
        onRefresh={handleRefreshImages}
        onCategoryChange={handleCategoryChange}
      />
    </div>
  );
};

export default ImageUploader;
