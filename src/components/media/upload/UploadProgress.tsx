
import React from 'react';
import { Button } from '@/components/ui/button';
import { XIcon, CheckIcon } from 'lucide-react';

interface UploadProgressProps {
  uploadPercent: number;
  uploadSuccess: boolean | null;
  errorMessage: string | null;
  isProcessing: boolean;
  onRetry: () => void;
}

const UploadProgress = ({
  uploadPercent,
  uploadSuccess,
  errorMessage,
  isProcessing,
  onRetry
}: UploadProgressProps) => {
  if (!isProcessing) return null;
  
  return (
    <div className="w-full">
      <div className="flex justify-between mb-1 text-xs">
        <span>{uploadSuccess === null ? 'Uploading...' : (uploadSuccess ? 'Complete' : 'Failed')}</span>
        <span>{uploadPercent}%</span>
      </div>
      <div className="w-full bg-muted rounded-full h-1.5 mb-3">
        <div 
          className={`h-1.5 rounded-full ${uploadSuccess === false ? 'bg-red-500' : 'bg-blue-600'}`}
          style={{ width: `${uploadPercent}%` }}
        ></div>
      </div>
      
      {uploadSuccess !== null && (
        <div className="flex flex-col items-center justify-center mt-2">
          {uploadSuccess ? (
            <div className="flex items-center text-green-600">
              <CheckIcon className="w-4 h-4 mr-1" />
              <span className="text-sm">Upload complete</span>
            </div>
          ) : (
            <div className="flex flex-col items-center text-red-600">
              <div className="flex items-center">
                <XIcon className="w-4 h-4 mr-1" />
                <span className="text-sm">Upload failed</span>
              </div>
              {errorMessage && <span className="text-xs mt-1">{errorMessage}</span>}
              <Button onClick={onRetry} variant="outline" size="sm" className="mt-2">
                Try Again
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UploadProgress;
