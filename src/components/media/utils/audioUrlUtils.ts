
/**
 * Utility for verifying audio URLs
 */

/**
 * Check if a URL is a valid audio file URL
 * 
 * @param url URL to check
 * @returns boolean indicating if URL is a valid audio URL
 */
export const isValidAudioUrl = (url: string): boolean => {
  if (!url) return false;
  
  // Check if it's a Supabase URL, blob URL or other common audio hosting URLs
  return (
    (url.startsWith('https://') && 
      (url.includes('.supabase.co/storage/') || 
       url.includes('cdn.devdojo.com') ||
       url.includes('sermonaudio.com') ||
       url.includes('soundcloud.com'))) || 
    url.startsWith('blob:') || 
    url.endsWith('.mp3') ||
    url.endsWith('.wav') ||
    url.endsWith('.ogg') ||
    url.endsWith('.m4a')
  );
};

/**
 * Test if an audio URL is accessible
 * 
 * @param url Audio URL to test
 * @returns Promise resolving to boolean indicating if URL is accessible
 */
export const testAudioUrl = async (url: string): Promise<boolean> => {
  if (!isValidAudioUrl(url)) return false;
  
  try {
    const response = await fetch(url, { 
      method: 'HEAD',
      mode: 'no-cors' // Use no-cors to avoid CORS issues with external resources
    });
    return true; // If we get here, the URL is at least accessible
  } catch (err) {
    console.error('Error testing audio URL:', err);
    return false;
  }
};
