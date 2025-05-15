
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageCategory } from '@/types/imageTypes';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSermons } from '@/hooks/useSermons';
import MediaSectionHeader from '../media/MediaSectionHeader';
import YouTubeTabContent from '../media/tabs/YouTubeTabContent';
import AudioTabContent from '../media/tabs/AudioTabContent';
import ImagesTabContent from '../media/tabs/ImagesTabContent';

const MediaSection = () => {
  const [selectedTab, setSelectedTab] = useState("youtube");
  const isMobile = useIsMobile();
  const { sermons } = useSermons();
  
  // Handle tab change
  const handleTabChange = (value: string) => {
    setSelectedTab(value);
    // Force refresh sermon data when changing tabs, especially important on mobile
    if (value === "audio" && isMobile) {
      // Add a small delay to ensure DOM is ready
      setTimeout(() => {
        console.log('Refreshing sermon data on mobile tab change');
        window.dispatchEvent(new Event('sermon-refresh'));
      }, 100);
    }
  };
  
  const handleFileUpload = (file: File) => {
    console.log('File uploaded:', file);
    // In a real application, you would handle the file upload here
    // For example, uploading to a storage service like Firebase, AWS S3, etc.
  };
  
  // Handler for DragDropUploader compatibility
  const handleCategorizedUpload = async (file: File, category: ImageCategory): Promise<boolean> => {
    console.log('File uploaded:', file, 'Category:', category);
    // In a real application, handle the file upload with category
    return true; // Return success
  };
  
  // Ensure sermon data is properly loaded when the component mounts
  useEffect(() => {
    console.log('MediaSection mounted, available sermons:', sermons?.length || 0);
    
    // Dispatch an event to notify AudioSermonPlayer that it should refresh data
    window.dispatchEvent(new Event('sermon-refresh'));
    
    // Force refresh when switching back to this tab on mobile
    const handleVisibilityChange = () => {
      if (!document.hidden && isMobile && selectedTab === "audio") {
        console.log('Page became visible on mobile, refreshing sermon data');
        window.dispatchEvent(new Event('sermon-refresh'));
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [selectedTab, sermons?.length, isMobile]);
  
  return (
    <section className="py-16 md:py-24 bg-church-neutral-50">
      <div className="container mx-auto px-4">
        <MediaSectionHeader />
        
        <Tabs defaultValue="youtube" className="w-full max-w-5xl mx-auto" value={selectedTab} onValueChange={handleTabChange}>
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="youtube">YouTube</TabsTrigger>
            <TabsTrigger value="audio">Audio Sermons</TabsTrigger>
            <TabsTrigger value="images">Image Gallery</TabsTrigger>
          </TabsList>
          
          <TabsContent value="youtube">
            <YouTubeTabContent />
          </TabsContent>
          
          <TabsContent value="audio">
            <AudioTabContent sermons={sermons} handleFileUpload={handleFileUpload} />
          </TabsContent>
          
          <TabsContent value="images">
            <ImagesTabContent handleFileUpload={handleFileUpload} />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default MediaSection;
