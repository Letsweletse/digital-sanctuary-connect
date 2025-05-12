import { ImageCategory } from '@/types/imageTypes';

export const getAcceptProp = (acceptedFileTypes: string[]) => {
  // Check if we're accepting all audio files
  if (acceptedFileTypes.includes('audio/*')) {
    return {
      'audio/*': []
    };
  }
  
  // Otherwise process as normal
  return acceptedFileTypes.reduce((obj: any, type) => {
    obj[type] = [];
    return obj;
  }, {});
};

export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B';
  else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  else return (bytes / 1048576).toFixed(1) + ' MB';
};
