
/**
 * Extracts metadata from an audio file
 * @param file Audio file to analyze
 * @returns Promise with duration and size metadata
 */
export const extractAudioMetadata = async (file: File): Promise<{
  duration?: number;
  size?: number;
}> => {
  return new Promise((resolve) => {
    // Create an audio element to get duration
    const audio = new Audio();
    audio.src = URL.createObjectURL(file);
    
    // Wait for audio metadata to load to get duration
    audio.onloadedmetadata = () => {
      // Store duration and size as metadata
      resolve({
        duration: audio.duration,
        size: file.size
      });
      
      console.log('Audio metadata loaded:',
        'Duration:', audio.duration,
        'Size:', (file.size / (1024 * 1024)).toFixed(2), 'MB');
    };
    
    // Fallback if metadata can't be loaded
    audio.onerror = () => {
      console.warn('Could not load audio metadata');
      resolve({ size: file.size });
    };
    
    // Timeout after 5 seconds if metadata loading hangs
    setTimeout(() => resolve({ size: file.size }), 5000);
  });
};

/**
 * Format duration as mm:ss or hh:mm:ss
 * @param duration Duration in seconds
 * @returns Formatted duration string
 */
export const formatAudioDuration = (duration?: number): string => {
  if (!duration) return "00:00";
  
  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor((duration % 3600) / 60);
  const seconds = Math.floor(duration % 60);
  
  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

/**
 * Format file size in MB
 * @param sizeInBytes File size in bytes
 * @returns Formatted file size string
 */
export const formatFileSize = (sizeInBytes?: number): string => {
  if (!sizeInBytes) return "Unknown size";
  
  const sizeInMB = sizeInBytes / (1024 * 1024);
  return `${sizeInMB.toFixed(2)} MB`;
};
