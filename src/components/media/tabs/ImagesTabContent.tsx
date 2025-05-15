
import React from 'react';
import MediaUploader from '../../media/MediaUploader';
import { ImageCategory } from '@/types/imageTypes';

interface ImagesTabContentProps {
  handleFileUpload: (file: File) => void;
}

const ImagesTabContent = ({ handleFileUpload }: ImagesTabContentProps) => {
  return (
    <div className="space-y-6">
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
    </div>
  );
};

export default ImagesTabContent;
