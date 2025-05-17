
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Upload } from 'lucide-react';

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
  
  // Determine the appropriate background color based on progress
  const getProgressColor = () => {
    if (uploadProgress >= 100) return "bg-green-500";
    if (uploadProgress >= 90) return "bg-yellow-500";
    return "bg-church-blue";
  };
  
  return (
    <div className="mb-6 p-4 bg-church-blue-light/5 rounded-md border border-church-blue-light/20">
      <div className="flex items-center gap-2 mb-3">
        <div className="bg-church-blue-light/20 p-1.5 rounded-full">
          <Upload className={`h-4 w-4 ${uploadProgress < 100 ? "text-church-blue animate-pulse" : "text-green-600"}`} />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm text-church-neutral-800 truncate">
            {uploadProgress < 100 ? `Uploading ${fileName}` : `Uploaded ${fileName}`}
          </h4>
          <span className={`text-xs ${uploadProgress < 100 ? "text-church-blue" : "text-green-600"}`}>
            {uploadProgress}% {uploadProgress < 100 ? "complete" : "uploaded successfully"}
          </span>
        </div>
      </div>
      
      <div className="relative w-full">
        <Progress 
          value={uploadProgress} 
          className="h-2 bg-church-neutral-100" 
        />
        {/* Apply the colored indicator as an absolute element */}
        <div 
          className={`absolute top-0 left-0 h-2 rounded-full transition-all ${getProgressColor()}`}
          style={{ width: `${uploadProgress}%` }}
        ></div>
      </div>
      
      <p className="text-xs text-church-neutral-500 mt-2">
        {uploadProgress < 100 
          ? "Please wait while your audio file is being processed..."
          : "Upload complete! Your audio file is now ready to use."}
      </p>
    </div>
  );
};

export default AudioUploadProgress;
