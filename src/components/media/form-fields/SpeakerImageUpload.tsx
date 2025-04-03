
import React from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import DragDropUploader from '../DragDropUploader';
import { ImageCategory } from '@/types/imageTypes';

interface SpeakerImageUploadProps {
  speaker: string;
  speakerImage: string;
  setSpeakerImage: (url: string) => void;
  handleSpeakerImageUpload: (file: File, category: ImageCategory) => Promise<boolean>;
}

const SpeakerImageUpload = ({
  speaker,
  speakerImage,
  setSpeakerImage,
  handleSpeakerImageUpload
}: SpeakerImageUploadProps) => {
  return (
    <div>
      <Label className="block mb-2">Speaker Image</Label>
      {speakerImage && (
        <div className="mb-4 flex items-center space-x-4">
          <Avatar className="h-16 w-16 border">
            <AvatarImage src={speakerImage} alt={speaker} />
            <AvatarFallback>{speaker?.charAt(0) || 'S'}</AvatarFallback>
          </Avatar>
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            onClick={() => setSpeakerImage('')}
          >
            Remove
          </Button>
        </div>
      )}
      <DragDropUploader 
        onFileAccepted={handleSpeakerImageUpload}
        category="leadership"
        acceptedFileTypes={['image/jpeg', 'image/png', 'image/webp']}
      />
    </div>
  );
};

export default SpeakerImageUpload;
