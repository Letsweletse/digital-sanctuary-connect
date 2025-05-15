
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageCategory } from '@/types/imageTypes';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSermons } from '@/hooks/useSermons';
import MediaSectionHeader from '../media/MediaSectionHeader';
import YouTubeTabContent from '../media/tabs/YouTubeTabContent';
import AudioTabContent from '../media/tabs/AudioTabContent';
import ImagesTabContent from '../media/tabs/ImagesTabContent';
import { useToast } from '@/components/ui/use-toast';

const MediaSection = () => {
  const [selectedTab, setSelectedTab] = useState("youtube");
  const isMobile = useIsMobile();
  const { sermons } = useSermons();
  const { toast } = useToast();
  
  // Handle tab change
  const handleTabChange = (value: string) => {
    setSelectedTab(value);
    // Force refresh sermon data when changing tabs, especially important on mobile
    if (value === "audio" && isMobile) {
      // Add a small delay to ensure DOM is ready
      setTimeout(() => {
        console.log('Refreshing sermon data on mobile tab change');
        window.dispatchEvent(new Event('sermon-refresh'));
      }, 200); // Increased delay for mobile devices
    }
  };
  
  const handleFileUpload = (file: File) => {
    console.log('File uploaded:', file);
    // Show toast notification for upload success
    toast({
      title: "Upload successful",
      description: `${file.name} has been uploaded successfully.`,
    });
    
    // In a real application, you would handle the file upload here
    // For example, uploading to a storage service like Firebase, AWS S3, etc.
  };
  
  // Handler for DragDropUploader compatibility
  const handleCategorizedUpload = async (file: File, category: ImageCategory): Promise<boolean> => {
    console.log('File uploaded:', file, 'Category:', category);
    
    // Show upload notification for mobile users
    if (isMobile) {
      toast({
        title: "Mobile upload complete",
        description: `${file.name} has been uploaded to ${category} category.`,
      });
    }
    
    return true; // Return success
  };
  
  // Ensure sermon data is properly loaded when the component mounts
  useEffect(() => {
    console.log('MediaSection mounted, available sermons:', sermons?.length || 0);
    
    // Dispatch an event to notify AudioSermonPlayer that it should refresh data
    window.dispatchEvent(new Event('sermon-refresh'));
    
    // Force refresh when switching back to this tab on mobile
    const handleVisibilityChange = () => {
      if (!document.hidden && isMobile) {
        console.log('Page became visible on mobile, refreshing content');
        
        // For audio tab, refresh sermon data
        if (selectedTab === "audio") {
          console.log('Refreshing sermon data on mobile visibility change');
          window.dispatchEvent(new Event('sermon-refresh'));
        }
        
        // For images tab, force rerender of images
        if (selectedTab === "images") {
          console.log('Forcing image refresh on mobile visibility change');
          // Trigger a refresh via a custom event
          window.dispatchEvent(new CustomEvent('image-refresh'));
        }
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Additional mobile-specific setup
    if (isMobile) {
      // Force initial load for mobile devices
      const timer = setTimeout(() => {
        console.log('Initial mobile content refresh');
        window.dispatchEvent(new Event('sermon-refresh'));
        window.dispatchEvent(new CustomEvent('image-refresh'));
      }, 800);
      
      return () => {
        clearTimeout(timer);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
    }
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [selectedTab, sermons?.length, isMobile]);
  
  return (
    <section className="py-12 md:py-24 bg-church-neutral-50">
      <div className="container mx-auto px-4">
        <MediaSectionHeader />
        
        <Tabs 
          defaultValue="youtube" 
          className="w-full max-w-5xl mx-auto" 
          value={selectedTab} 
          onValueChange={handleTabChange}
        >
          <TabsList className="grid grid-cols-3 mb-6 md:mb-8 overflow-x-auto">
            <TabsTrigger value="youtube" className="text-sm md:text-base">YouTube</TabsTrigger>
            <TabsTrigger value="audio" className="text-sm md:text-base">Audio Sermons</TabsTrigger>
            <TabsTrigger value="images" className="text-sm md:text-base">Image Gallery</TabsTrigger>
          </TabsList>
          
          <TabsContent value="youtube" className="min-h-[300px]">
            <YouTubeTabContent />
          </TabsContent>
          
          <TabsContent value="audio" className="min-h-[300px]">
            <AudioTabContent 
              sermons={sermons} 
              handleFileUpload={handleFileUpload}
              isMobile={isMobile} 
            />
          </TabsContent>
          
          <TabsContent value="images" className="min-h-[300px]">
            <ImagesTabContent 
              handleFileUpload={handleFileUpload}
              isMobile={isMobile}
            />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default MediaSection;
