
/**
 * Utility functions for audio URL validation and handling
 */

/**
 * Checks if a URL is likely to be a valid audio file
 * @param url - The URL to check
 * @returns Boolean indicating if the URL is likely a valid audio URL
 */
export const isValidAudioUrl = (url: string | undefined | null): boolean => {
  if (!url) return false;
  
  // Check if it's a Supabase URL, blob URL, or other common audio hosting URLs
  return (
    url.startsWith('https://') || 
    url.startsWith('http://') || 
    url.startsWith('blob:') || 
    url.startsWith('data:audio/')
  );
};

/**
 * Extracts the filename from an audio URL
 * @param url - The audio URL
 * @returns The extracted filename or a fallback string
 */
export const extractFilenameFromUrl = (url: string | undefined | null): string => {
  if (!url) return 'Unknown Audio';
  
  try {
    // Try to extract the filename from the URL
    const segments = url.split('/');
    const lastSegment = segments[segments.length - 1];
    
    // If there's a query string, remove it
    const filenameWithoutQuery = lastSegment.split('?')[0];
    
    // Decode URI components to handle special characters
    return decodeURIComponent(filenameWithoutQuery);
  } catch (error) {
    console.error('Error extracting filename from URL', error);
    return 'Audio File';
  }
};

/**
 * Checks if audio should be able to play based on URL and browser support
 * @param url - The audio URL to check
 * @returns Object containing validation result and any error message
 */
export const validateAudioPlayability = (url: string | undefined | null): { 
  valid: boolean; 
  error?: string;
} => {
  if (!url) {
    return { valid: false, error: 'No audio URL provided' };
  }
  
  if (!isValidAudioUrl(url)) {
    return { valid: false, error: 'Invalid audio URL format' };
  }
  
  // All checks passed
  return { valid: true };
};
