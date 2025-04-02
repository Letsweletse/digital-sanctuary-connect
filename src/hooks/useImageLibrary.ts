
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ImageCategory, ImageFile } from '@/types/imageTypes';
import { fetchImages, uploadImage, deleteImage } from '@/services/imageService';
import { formatDate } from '@/utils/imageUtils';

export { ImageCategory, ImageFile } from '@/types/imageTypes';

export function useImageLibrary(initialCategory: ImageCategory = 'leadership') {
  const { toast } = useToast();
  const [uploadedImages, setUploadedImages] = useState<ImageFile[]>([]);
  const [selectedImage, setSelectedImage] = useState<ImageFile | null>(null);
  const [category, setCategory] = useState<ImageCategory>(initialCategory);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  useEffect(() => {
    const loadImages = async () => {
      try {
        const images = await fetchImages(category);
        setUploadedImages(images);
      } catch (err) {
        console.error('Error loading images', err);
        toast({
          title: "Error",
          description: "Failed to load images. Please try again later.",
          variant: "destructive",
        });
      }
    };
    
    loadImages();
  }, [category, refreshTrigger, toast]);

  const handleUpload = async (file: File, uploadCategory: ImageCategory) => {
    try {
      const result = await uploadImage(file, uploadCategory);
      
      if (result.success && result.image) {
        setUploadedImages(prev => [result.image!, ...prev]);
        
        toast({
          title: "Image Uploaded",
          description: `${file.name} has been uploaded successfully.`,
        });
        
        setRefreshTrigger(prev => prev + 1);
        return true;
      } else {
        toast({
          title: "Upload Failed",
          description: "There was an error uploading your image.",
          variant: "destructive",
        });
        return false;
      }
    } catch (err) {
      console.error('Error uploading image', err);
      toast({
        title: "Upload Failed",
        description: "There was an error uploading your image.",
        variant: "destructive",
      });
      return false;
    }
  };
  
  const handleCopyUrl = () => {
    if (selectedImage) {
      navigator.clipboard.writeText(selectedImage.url);
      toast({
        title: "URL Copied",
        description: "Image URL has been copied to clipboard.",
      });
    }
  };
  
  const handleDelete = async (image: ImageFile) => {
    try {
      const success = await deleteImage(image);
      
      if (success) {
        setUploadedImages(prev => prev.filter(img => img.url !== image.url));
        
        if (selectedImage && selectedImage.url === image.url) {
          setSelectedImage(null);
        }
        
        toast({
          title: "Image Deleted",
          description: `${image.name} has been deleted.`,
        });
        
        setRefreshTrigger(prev => prev + 1);
      } else {
        throw new Error("Failed to delete image");
      }
    } catch (err) {
      console.error('Error deleting image', err);
      toast({
        title: "Delete Failed",
        description: "There was an error deleting your image.",
        variant: "destructive",
      });
    }
  };
  
  const handleRefreshImages = () => {
    setRefreshTrigger(prev => prev + 1);
    toast({
      title: "Refreshed",
      description: "Image library has been refreshed.",
    });
  };

  const handleCategoryChange = (newCategory: ImageCategory | 'all') => {
    setCategory(newCategory === 'all' ? 'general' : newCategory);
  };

  const handleImageClick = (image: ImageFile) => {
    setSelectedImage(image);
  };

  return {
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
  };
}
