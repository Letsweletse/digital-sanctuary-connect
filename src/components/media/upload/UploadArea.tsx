
import React from 'react';
import { UploadIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatFileSize } from '../utils/uploadUtils';

interface UploadAreaProps {
  isDragActive: boolean;
  isDragAccept: boolean;
  isDragReject: boolean;
  getRootProps: any;
  getInputProps: any;
  maxSize: number;
}

const UploadArea = ({
  isDragActive,
  isDragAccept,
  isDragReject,
  getRootProps,
  getInputProps,
  maxSize
}: UploadAreaProps) => {
  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer transition-colors duration-200 ${
        isDragActive ? 'bg-primary/5 border-primary' : 'hover:bg-secondary/10'
      } ${isDragAccept ? 'border-green-500' : ''} ${isDragReject ? 'border-red-500' : ''}`}
    >
      <input {...getInputProps()} />
      
      <div className="flex flex-col items-center justify-center gap-3 p-4">
        <UploadIcon className="h-10 w-10 text-muted-foreground" />
        <div className="space-y-2">
          <p className="text-base font-medium">Drag & drop image here</p>
          <p className="text-sm text-muted-foreground">
            Or click to browse files
          </p>
          <Badge variant="outline" className="mt-2">
            Max size: {formatFileSize(maxSize)}
          </Badge>
          <div className="flex justify-center">
            <Button variant="secondary" size="sm" className="mt-2">
              Select Image
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            You can also paste an image from your clipboard
          </p>
        </div>
      </div>
    </div>
  );
};

export default UploadArea;
