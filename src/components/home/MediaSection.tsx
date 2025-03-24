
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MediaUploader from '../media/MediaUploader';
import YouTubeEmbed from '../media/YouTubeEmbed';
import AudioSermonPlayer from '../media/AudioSermonPlayer';

const MediaSection = () => {
  const [selectedTab, setSelectedTab] = useState("youtube");
  
  const handleFileUpload = (file: File) => {
    console.log('File uploaded:', file);
    // In a real application, you would handle the file upload here
    // For example, uploading to a storage service like Firebase, AWS S3, etc.
  };
  
  return (
    <section className="py-16 md:py-24 bg-church-neutral-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block bg-church-blue-light px-3 py-1 rounded-full text-sm font-medium text-church-neutral-700 mb-4">
            Media Resources
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-church-neutral-900 mb-6">
            Sermons & Media Content
          </h2>
          <p className="max-w-2xl mx-auto text-church-neutral-700">
            Watch our YouTube videos, listen to sermon recordings, or browse our image gallery.
          </p>
        </div>
        
        <Tabs defaultValue="youtube" className="w-full max-w-5xl mx-auto" value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="youtube">YouTube</TabsTrigger>
            <TabsTrigger value="audio">Audio Sermons</TabsTrigger>
            <TabsTrigger value="images">Image Gallery</TabsTrigger>
          </TabsList>
          
          <TabsContent value="youtube" className="space-y-6">
            <div className="glass-panel p-6 bg-white">
              <YouTubeEmbed channelId="gategaboronebotswana2702" />
            </div>
            
            <div className="glass-panel p-6 bg-white">
              <h3 className="text-xl font-bold text-church-neutral-900 mb-4">About Our YouTube Channel</h3>
              <p className="text-church-neutral-700 mb-4">
                Subscribe to our YouTube channel to stay updated with the latest sermons, events, and testimonies from Gate Gaborone Ministries.
              </p>
              
              <div className="bg-church-blue-light/30 border border-church-blue-light rounded-lg p-4 mt-4">
                <h4 className="font-medium text-church-neutral-800 mb-2">How to Share Our Videos</h4>
                <ol className="list-decimal list-inside space-y-2 text-church-neutral-700">
                  <li>Visit our channel at <a href="https://www.youtube.com/@gategaboronebotswana2702" target="_blank" rel="noopener noreferrer" className="text-church-blue underline">YouTube.com/@gategaboronebotswana2702</a></li>
                  <li>Find the video you want to share</li>
                  <li>Click the "Share" button below the video</li>
                  <li>Choose your preferred sharing method (social media, email, etc.)</li>
                </ol>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="audio" className="space-y-6">
            <div className="glass-panel p-6 bg-white">
              <h3 className="text-xl font-bold text-church-neutral-900 mb-4">Recent Audio Sermons</h3>
              <p className="text-church-neutral-700 mb-6">
                Listen to our latest sermon recordings directly on our website. You can also download them for offline listening.
              </p>
              
              <AudioSermonPlayer />
            </div>
            
            <div className="glass-panel p-6 bg-white">
              <h3 className="text-xl font-bold text-church-neutral-900 mb-4">Upload Sermon Audio</h3>
              <p className="text-church-neutral-700 mb-6">
                Upload MP3 files of sermons to share with the community. Once uploaded, they will be processed and made available in our audio library.
              </p>
              
              <MediaUploader
                title="Upload Sermon MP3"
                description="Drag and drop or click to select an MP3 file"
                acceptedFileTypes="audio/mpeg,audio/mp3"
                maxFileSizeMB={50}
                onUpload={handleFileUpload}
              />
              
              <div className="bg-church-blue-light/30 border border-church-blue-light rounded-lg p-4 mt-8">
                <h4 className="font-medium text-church-neutral-800 mb-2">Recommended Audio Settings</h4>
                <ul className="list-disc list-inside space-y-1 text-church-neutral-700">
                  <li>Format: MP3</li>
                  <li>Bitrate: 128kbps minimum</li>
                  <li>Sample Rate: 44.1kHz</li>
                  <li>Include metadata such as sermon title, speaker, and date</li>
                </ul>
              </div>
            </div>
            
            <div className="glass-panel p-6 bg-white">
              <h3 className="text-xl font-bold text-church-neutral-900 mb-4">MP3 Hosting Services</h3>
              <p className="text-church-neutral-700 mb-4">
                For hosting sermon MP3s, we recommend the following services that integrate well with websites:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <a href="https://soundcloud.com" target="_blank" rel="noopener noreferrer" className="p-4 border border-church-neutral-200 rounded-lg hover:border-church-blue transition-colors">
                  <h4 className="font-medium text-church-neutral-800 mb-2">SoundCloud</h4>
                  <p className="text-church-neutral-600 text-sm">Great for audio sharing with easy embedding and a customizable player.</p>
                </a>
                
                <a href="https://www.buzzsprout.com" target="_blank" rel="noopener noreferrer" className="p-4 border border-church-neutral-200 rounded-lg hover:border-church-blue transition-colors">
                  <h4 className="font-medium text-church-neutral-800 mb-2">Buzzsprout</h4>
                  <p className="text-church-neutral-600 text-sm">Podcast hosting that works well for sermon series and regular content.</p>
                </a>
                
                <a href="https://www.sermonaudio.com" target="_blank" rel="noopener noreferrer" className="p-4 border border-church-neutral-200 rounded-lg hover:border-church-blue transition-colors">
                  <h4 className="font-medium text-church-neutral-800 mb-2">SermonAudio</h4>
                  <p className="text-church-neutral-600 text-sm">Specialized platform for church sermons with many features.</p>
                </a>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="images" className="space-y-6">
            <div className="glass-panel p-6 bg-white">
              <h3 className="text-xl font-bold text-church-neutral-900 mb-4">Upload Images</h3>
              <p className="text-church-neutral-700 mb-6">
                Upload photos from church events, services, or other activities to share with the community.
              </p>
              
              <MediaUploader
                title="Upload Images"
                description="Drag and drop or click to select image files (JPG, PNG, WebP)"
                acceptedFileTypes="image/jpeg,image/png,image/webp"
                maxFileSizeMB={10}
                onUpload={handleFileUpload}
              />
            </div>
            
            <div className="glass-panel p-6 bg-white">
              <h3 className="text-xl font-bold text-church-neutral-900 mb-4">Image Hosting Solutions</h3>
              <p className="text-church-neutral-700 mb-4">
                For managing your church's image library, we recommend these services:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <a href="https://www.flickr.com" target="_blank" rel="noopener noreferrer" className="p-4 border border-church-neutral-200 rounded-lg hover:border-church-blue transition-colors">
                  <h4 className="font-medium text-church-neutral-800 mb-2">Flickr</h4>
                  <p className="text-church-neutral-600 text-sm">Excellent for organizing photos into albums with easy sharing options.</p>
                </a>
                
                <a href="https://www.smugmug.com" target="_blank" rel="noopener noreferrer" className="p-4 border border-church-neutral-200 rounded-lg hover:border-church-blue transition-colors">
                  <h4 className="font-medium text-church-neutral-800 mb-2">SmugMug</h4>
                  <p className="text-church-neutral-600 text-sm">Professional photo hosting with beautiful galleries and privacy controls.</p>
                </a>
                
                <a href="https://cloudinary.com" target="_blank" rel="noopener noreferrer" className="p-4 border border-church-neutral-200 rounded-lg hover:border-church-blue transition-colors">
                  <h4 className="font-medium text-church-neutral-800 mb-2">Cloudinary</h4>
                  <p className="text-church-neutral-600 text-sm">Cloud-based image management with easy integration into websites.</p>
                </a>
              </div>
              
              <div className="bg-church-blue-light/30 border border-church-blue-light rounded-lg p-4 mt-8">
                <h4 className="font-medium text-church-neutral-800 mb-2">Netlify Deployment Tips</h4>
                <p className="text-church-neutral-700 mb-2">
                  Since you'll be deploying to Netlify, here are some recommendations:
                </p>
                <ul className="list-disc list-inside space-y-1 text-church-neutral-700">
                  <li>Use Netlify Large Media for version-controlled image storage</li>
                  <li>Consider Netlify CMS for easy content management</li>
                  <li>Set up Netlify Forms to collect user submissions</li>
                  <li>For dynamic content, use Netlify Functions to connect to external services</li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default MediaSection;
