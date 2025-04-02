import { useState, useEffect } from 'react';
import { findMany, insertOne } from '@/lib/mongodb';
import { useToast } from '@/hooks/use-toast';

export type ImageCategory = 'hero' | 'sermons' | 'events' | 'leadership' | 'general';

export interface ImageFile {
  name: string;
  url: string;
  category: ImageCategory;
  uploadedAt: Date;
}

export function useImageLibrary(initialCategory: ImageCategory = 'leadership') {
  const { toast } = useToast();
  const [uploadedImages, setUploadedImages] = useState<ImageFile[]>([]);
  const [selectedImage, setSelectedImage] = useState<ImageFile | null>(null);
  const [category, setCategory] = useState<ImageCategory>(initialCategory);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  const isValidCategory = (cat: string): cat is ImageCategory => {
    return ['hero', 'sermons', 'events', 'leadership', 'general'].includes(cat);
  };

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const images = await findMany('images', { category: category === 'general' ? {} : { category } });
        
        // Convert the _id to id for consistency and ensure category is valid
        const formattedImages = images.map((img: any) => {
          // Ensure category is valid, default to 'general' if not
          const imgCategory = img.category || 'general';
          const validCategory: ImageCategory = isValidCategory(imgCategory) ? imgCategory : 'general';
          
          return {
            name: img.name,
            url: img.url,
            category: validCategory,
            uploadedAt: new Date(img.uploadedAt || Date.now())
          } as ImageFile;
        });
        
        setUploadedImages(formattedImages);
      } catch (err) {
        console.error('Error fetching images', err);
        // Define mockImages directly as ImageFile[] with proper types
        const mockImages: ImageFile[] = [
          {
            name: 'hero-image.jpg',
            url: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3',
            category: 'hero',
            uploadedAt: new Date(2023, 5, 15)
          },
          {
            name: 'sermon-cover.jpg',
            url: 'https://images.unsplash.com/photo-1508963493744-76fce69379c0',
            category: 'sermons',
            uploadedAt: new Date(2023, 6, 22)
          },
          {
            name: 'event-banner.jpg',
            url: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94',
            category: 'events',
            uploadedAt: new Date(2023, 7, 10)
          },
          {
            name: 'pastor-john.jpg',
            url: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81',
            category: 'leadership',
            uploadedAt: new Date(2023, 8, 5)
          },
          {
            name: 'elder-board.jpg',
            url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c',
            category: 'leadership',
            uploadedAt: new Date(2023, 9, 15)
          }
        ].filter(img => category === 'general' || img.category === category);
        
        setUploadedImages(mockImages);
      }
    };
    
    fetchImages();
  }, [category, refreshTrigger]);

  const handleUpload = async (file: File, uploadCategory: ImageCategory) => {
    try {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        if (!e.target?.result) {
          throw new Error("Failed to read file");
        }
        
        const imageUrl = e.target.result as string;
        
        const newImage = {
          name: file.name,
          url: imageUrl,
          category: uploadCategory as ImageCategory,
          uploadedAt: new Date().toISOString()
        };
        
        await insertOne('images', newImage);
        
        const addedImage: ImageFile = {
          name: file.name,
          url: imageUrl,
          category: uploadCategory,
          uploadedAt: new Date()
        };
        
        setUploadedImages(prev => [addedImage, ...prev]);
        
        toast({
          title: "Image Uploaded",
          description: `${file.name} has been uploaded successfully.`,
        });
        
        // Refresh images list
        setRefreshTrigger(prev => prev + 1);
      };
      
      reader.onerror = () => {
        throw new Error("Failed to read file");
      };
      
      reader.readAsDataURL(file);
      return true;
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
      await insertOne('deleted_images', {
        name: image.name,
        url: image.url,
        category: image.category,
        deletedAt: new Date().toISOString()
      });
      
      setUploadedImages(prev => prev.filter(img => img.url !== image.url));
      
      if (selectedImage && selectedImage.url === image.url) {
        setSelectedImage(null);
      }
      
      toast({
        title: "Image Deleted",
        description: `${image.name} has been deleted.`,
      });
      
      // Refresh images list
      setRefreshTrigger(prev => prev + 1);
    } catch (err) {
      console.error('Error deleting image', err);
      toast({
        title: "Delete Failed",
        description: "There was an error deleting the image.",
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
  
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
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
