
import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Folder } from 'lucide-react';
import { ImageFile, ImageCategory } from '@/types/imageTypes';

interface ImageLibraryProps {
  images: ImageFile[];
  category: ImageCategory | 'all';
  selectedImage: ImageFile | null;
  onImageClick: (image: ImageFile) => void;
  onRefresh: () => void;
  onCategoryChange: (category: ImageCategory | 'all') => void;
}

const ImageLibrary: React.FC<ImageLibraryProps> = ({
  images,
  category,
  selectedImage,
  onImageClick,
  onRefresh,
  onCategoryChange
}) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-church-neutral-900">Image Library</h2>
        <div className="flex items-center space-x-2">
          <Button 
            onClick={onRefresh} 
            variant="outline" 
            size="sm" 
            className="flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </Button>
          <select
            value={category}
            onChange={(e) => {
              const value = e.target.value;
              onCategoryChange(value as ImageCategory | 'all');
            }}
            className="px-3 py-2 border border-church-neutral-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-church-blue"
          >
            <option value="all">All Categories</option>
            <option value="hero">Hero Images</option>
            <option value="sermons">Sermons</option>
            <option value="events">Events</option>
            <option value="leadership">Leadership</option>
            <option value="general">General</option>
          </select>
        </div>
      </div>
      
      <ScrollArea className="h-80 border border-church-neutral-200 rounded-lg p-4">
        {images.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div 
                key={index} 
                className={`cursor-pointer rounded-md overflow-hidden border-2 transition-all ${
                  selectedImage && selectedImage.url === image.url
                    ? 'border-church-blue scale-105 shadow-md'
                    : 'border-transparent hover:border-church-neutral-300'
                }`}
                onClick={() => onImageClick(image)}
              >
                <div className="aspect-square bg-church-neutral-100">
                  <img 
                    src={image.url}
                    alt={image.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-2 bg-white">
                  <p className="text-xs font-medium truncate">{image.name}</p>
                  <p className="text-xs text-church-neutral-500">{image.category}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Folder size={40} className="text-church-neutral-300 mb-4" />
            <p className="text-church-neutral-600">No images found</p>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default ImageLibrary;
