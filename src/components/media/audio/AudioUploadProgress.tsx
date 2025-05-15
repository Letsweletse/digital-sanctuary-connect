
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface AudioUploadProgressProps {
  isUploading: boolean;
  uploadProgress: number;
  fileName: string | undefined;
}

const AudioUploadProgress: React.FC<AudioUploadProgressProps> = ({
  isUploading,
  uploadProgress,
  fileName,
}) => {
  if (!isUploading) {
    return null;
  }
  
  return (
    <div className="mb-6 p-4 bg-church-neutral-50 rounded-md border border-church-neutral-200">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium text-sm">Uploading {fileName}</h4>
        <span className="text-sm text-church-blue">{uploadProgress}%</span>
      </div>
      <Progress value={uploadProgress} className="h-2" />
      <p className="text-xs text-church-neutral-500 mt-2">
        Please wait while your audio file is being uploaded to the server...
      </p>
    </div>
  );
};

export default AudioUploadProgress;
