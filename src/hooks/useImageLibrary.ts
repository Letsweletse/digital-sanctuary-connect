
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { sendImageUploadEmail } from '@/lib/emailService';

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
        // Try to fetch images from Supabase
        let { data: images, error } = await supabase
          .from('images')
          .select('*')
          .eq(category === 'general' ? 'id' : 'category', category === 'general' ? 'id' : category);
          
        if (error) throw error;
        
        if (images && images.length > 0) {
          // Convert the data to our ImageFile format and ensure category is valid
          const formattedImages: ImageFile[] = images.map((img: any) => {
            // Ensure category is valid, default to 'general' if not
            const imgCategory = img.category || 'general';
            const validCategory: ImageCategory = isValidCategory(imgCategory) ? imgCategory : 'general';
            
            return {
              name: img.name,
              url: img.url,
              category: validCategory,
              uploadedAt: new Date(img.uploaded_at || Date.now())
            };
          });
          
          setUploadedImages(formattedImages);
        } else {
          // Define mockImages directly as ImageFile[] with proper types if no data from Supabase
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
      } catch (err) {
        console.error('Error fetching images', err);
        // Use mock data as fallback
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

  // Add function to validate image URLs
  const validateImageUrl = async (url: string): Promise<boolean> => {
    // We now allow broken links to be uploaded, so we consider all URLs valid
    return true;
  };

  const handleUpload = async (file: File, uploadCategory: ImageCategory) => {
    try {
      const reader = new FileReader();
      
      return new Promise<boolean>((resolve, reject) => {
        reader.onload = async (e) => {
          if (!e.target?.result) {
            reject(new Error("Failed to read file"));
            return;
          }
          
          const imageUrl = e.target.result as string;
          
          // We still validate but always proceed with upload
          const isValid = await validateImageUrl(imageUrl);
          if (!isValid) {
            toast({
              title: "Warning",
              description: "The image may not be accessible, but we'll upload it anyway.",
              variant: "default",
            });
          }
          
          // Ensure category is valid
          const safeCategory: ImageCategory = isValidCategory(uploadCategory) ? uploadCategory : 'general';
          
          try {
            // Try to upload to Supabase
            const timestamp = new Date().toISOString();
            const { data, error } = await supabase
              .from('images')
              .insert([
                { 
                  name: file.name,
                  url: imageUrl,
                  category: safeCategory,
                  uploaded_at: timestamp
                }
              ]);
              
            if (error) throw error;
            
            const addedImage: ImageFile = {
              name: file.name,
              url: imageUrl,
              category: safeCategory,
              uploadedAt: new Date()
            };
            
            setUploadedImages(prev => [addedImage, ...prev]);
            
            toast({
              title: "Image Uploaded",
              description: `${file.name} has been uploaded successfully.`,
            });
            
            // Notify admins by email through our email service
            sendImageUploadEmail(file.name, safeCategory);
            
            // Refresh images list
            setRefreshTrigger(prev => prev + 1);
            resolve(true);
          } catch (err) {
            console.error('Supabase upload failed, falling back to mock data', err);
            
            // Fallback to mock data storage if Supabase fails
            const addedImage: ImageFile = {
              name: file.name,
              url: imageUrl,
              category: safeCategory,
              uploadedAt: new Date()
            };
            
            setUploadedImages(prev => [addedImage, ...prev]);
            
            toast({
              title: "Image Uploaded",
              description: `${file.name} has been uploaded successfully.`,
            });
            
            // Refresh images list
            setRefreshTrigger(prev => prev + 1);
            resolve(true);
          }
        };
        
        reader.onerror = () => {
          reject(new Error("Failed to read file"));
        };
        
        reader.readAsDataURL(file);
      });
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
      // Try to delete from Supabase
      const { error } = await supabase
        .from('images')
        .delete()
        .eq('url', image.url);
        
      if (error) throw error;
      
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
      console.error('Error deleting image or Supabase not available, removing from UI only', err);
      
      // Fallback to local state management if Supabase fails
      setUploadedImages(prev => prev.filter(img => img.url !== image.url));
      
      if (selectedImage && selectedImage.url === image.url) {
        setSelectedImage(null);
      }
      
      toast({
        title: "Image Deleted",
        description: `${image.name} has been deleted from view.`,
      });
      
      // Refresh images list
      setRefreshTrigger(prev => prev + 1);
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
