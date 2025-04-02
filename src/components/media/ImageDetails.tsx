import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Image } from 'lucide-react';
import { ImageFile } from '@/types/imageTypes';

interface ImageDetailsProps {
  selectedImage: ImageFile | null;
  onCopyUrl: () => void;
  onDelete: (image: ImageFile) => void;
  formatDate: (date: Date) => string;
}

const ImageDetails: React.FC<ImageDetailsProps> = ({
  selectedImage,
  onCopyUrl,
  onDelete,
  formatDate
}) => {
  if (!selectedImage) {
    return (
      <div className="border border-church-neutral-200 rounded-lg p-8 flex flex-col items-center justify-center text-center h-64">
        <Image size={40} className="text-church-neutral-300 mb-4" />
        <p className="text-church-neutral-600">Select an image to view details</p>
      </div>
    );
  }

  return (
    <div className="border border-church-neutral-200 rounded-lg p-4 space-y-4">
      <div className="aspect-video rounded-md overflow-hidden bg-church-neutral-100">
        <img 
          src={selectedImage.url}
          alt={selectedImage.name}
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-church-neutral-900 truncate">{selectedImage.name}</h3>
          <span className="text-xs bg-church-blue-light text-church-blue px-2 py-1 rounded-full">
            {selectedImage.category}
          </span>
        </div>
        
        <p className="text-sm text-church-neutral-500">
          Uploaded: {formatDate(selectedImage.uploadedAt)}
        </p>
        
        <div className="flex items-center space-x-2 pt-2">
          <Input 
            value={selectedImage.url} 
            readOnly
            className="text-sm"
          />
          <Button onClick={onCopyUrl} variant="outline" size="sm" className="shrink-0">
            Copy
          </Button>
        </div>
        
        <div className="pt-2">
          <Button 
            onClick={() => onDelete(selectedImage)} 
            variant="destructive" 
            size="sm"
            className="w-full"
          >
            Delete Image
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ImageDetails;
