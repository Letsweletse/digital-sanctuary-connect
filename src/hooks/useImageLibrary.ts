
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ImageCategory, ImageFile } from '@/types/imageTypes';
import { fetchImages, uploadImage, deleteImage } from '@/services/imageService';
import { formatDate } from '@/utils/imageUtils';

export type { ImageCategory, ImageFile } from '@/types/imageTypes';

export function useImageLibrary(initialCategory: ImageCategory = 'leadership') {
  const { toast } = useToast();
  const [uploadedImages, setUploadedImages] = useState<ImageFile[]>([]);
  const [selectedImage, setSelectedImage] = useState<ImageFile | null>(null);
  const [category, setCategory] = useState<ImageCategory>(initialCategory);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  
  // Load images when category changes or refresh is triggered
  useEffect(() => {
    const loadImages = async () => {
      try {
        setIsLoading(true);
        console.log('Loading images for category:', category);
        const imagesData = await fetchImages(category);
        console.log('Images loaded:', imagesData?.length);
        
        // Convert the data to match ImageFile type
        const convertedImages: ImageFile[] = imagesData.map(img => ({
          id: img.id,
          name: img.name,
          url: img.url,
          category: img.category as ImageCategory,
          uploadedAt: new Date(img.uploaded_at)
        }));
        
        setUploadedImages(convertedImages);
      } catch (err) {
        console.error('Error loading images', err);
        toast({
          title: "Error",
          description: "Failed to load images. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadImages();
  }, [category, refreshTrigger, toast]);

  const handleUpload = async (file: File, uploadCategory: ImageCategory) => {
    try {
      console.log('Uploading file:', file.name, 'to category:', uploadCategory);
      const result = await uploadImage(file, uploadCategory);
      
      if (result.success && result.image) {
        console.log('Upload successful:', result.image);
        
        // Convert the returned image to match ImageFile type
        const newImage: ImageFile = {
          id: result.image.id,
          name: result.image.name,
          url: result.image.url,
          category: result.image.category,
          uploadedAt: new Date(result.image.uploaded_at)
        };
        
        // Add the new image to the state
        setUploadedImages(prev => [newImage, ...prev]);
        
        toast({
          title: "Image Uploaded",
          description: `${file.name} has been uploaded successfully.`,
        });
        
        // Force a refresh to ensure we get the latest images
        setRefreshTrigger(prev => prev + 1);
        return true;
      } else {
        console.error('Upload failed, no image returned');
        toast({
          title: "Upload Failed",
          description: result.error || "There was an error uploading your image.",
          variant: "destructive",
        });
        return false;
      }
    } catch (err: any) {
      console.error('Error uploading image', err);
      toast({
        title: "Upload Failed",
        description: err.message || "There was an error uploading your image.",
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
      console.log('Deleting image:', image.name);
      const result = await deleteImage(image.url, image.id);
      
      if (result.success) {
        // Remove from local state
        setUploadedImages(prev => prev.filter(img => img.id !== image.id));
        
        if (selectedImage && selectedImage.id === image.id) {
          setSelectedImage(null);
        }
        
        toast({
          title: "Image Deleted",
          description: `${image.name} has been deleted.`,
        });
        
        // Force a refresh to ensure we get the latest images
        setRefreshTrigger(prev => prev + 1);
        return true;
      } else {
        throw new Error(result.error || "Failed to delete image");
      }
    } catch (err: any) {
      console.error('Error deleting image', err);
      toast({
        title: "Delete Failed",
        description: err.message || "There was an error deleting your image.",
        variant: "destructive",
      });
      return false;
    }
  };
  
  const handleRefreshImages = () => {
    console.log('Manually refreshing images');
    setRefreshTrigger(prev => prev + 1);
    toast({
      title: "Refreshed",
      description: "Image library has been refreshed.",
    });
  };

  const handleCategoryChange = (newCategory: ImageCategory | 'all') => {
    console.log('Changing category to:', newCategory);
    setCategory(newCategory === 'all' ? 'general' : newCategory);
  };

  const handleImageClick = (image: ImageFile) => {
    console.log('Selected image:', image.name);
    setSelectedImage(image);
  };

  return {
    uploadedImages,
    selectedImage,
    category,
    isLoading,
    handleUpload,
    handleCopyUrl,
    handleDelete,
    handleRefreshImages,
    handleCategoryChange,
    handleImageClick,
    formatDate
  };
}
