
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
    // Force refresh sermon data when changing tabs
    if (value === "audio") {
      // Add a small delay to ensure DOM is ready
      setTimeout(() => {
        console.log('Refreshing sermon data on tab change');
        window.dispatchEvent(new Event('sermon-refresh'));
      }, isMobile ? 300 : 100); // Longer delay for mobile devices
    }
    
    // For images tab, force refresh images
    if (value === "images") {
      setTimeout(() => {
        console.log('Refreshing images on tab change');
        window.dispatchEvent(new CustomEvent('image-refresh'));
      }, isMobile ? 300 : 100);
    }
  };
  
  const handleFileUpload = (file: File) => {
    console.log('File uploaded:', file);
    // Show toast notification for upload success
    toast({
      title: "Upload successful",
      description: `${file.name} has been uploaded successfully.`,
    });
  };
  
  // Handler for DragDropUploader compatibility
  const handleCategorizedUpload = async (file: File, category: ImageCategory): Promise<boolean> => {
    console.log('File uploaded:', file, 'Category:', category);
    
    // Show upload notification for mobile users with a longer duration
    if (isMobile) {
      toast({
        title: "Mobile upload complete",
        description: `${file.name} has been uploaded to ${category} category.`,
        duration: 4000, // Longer for mobile to ensure users see it
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
      if (!document.hidden) {
        console.log('Page became visible, refreshing content');
        
        // For audio tab, refresh sermon data
        if (selectedTab === "audio") {
          console.log('Refreshing sermon data on visibility change');
          window.dispatchEvent(new Event('sermon-refresh'));
        }
        
        // For images tab, force rerender of images
        if (selectedTab === "images") {
          console.log('Forcing image refresh on visibility change');
          // Trigger a refresh via a custom event
          window.dispatchEvent(new CustomEvent('image-refresh'));
        }
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Additional mobile-specific setup
    if (isMobile) {
      // Force initial load for mobile devices with a longer timeout
      const timer = setTimeout(() => {
        console.log('Initial mobile content refresh');
        window.dispatchEvent(new Event('sermon-refresh'));
        window.dispatchEvent(new CustomEvent('image-refresh'));
      }, 1000); // Increased timeout for mobile
      
      return () => {
        clearTimeout(timer);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
    }
    
    // Listen for device changes
    const handleDeviceChange = () => {
      console.log('Device type changed, refreshing media section');
      // Force refresh of all media components
      window.dispatchEvent(new Event('sermon-refresh'));
      window.dispatchEvent(new CustomEvent('image-refresh'));
    };
    
    window.addEventListener('device-changed', handleDeviceChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('device-changed', handleDeviceChange);
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
