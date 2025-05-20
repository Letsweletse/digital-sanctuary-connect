
/**
 * Check if a URL is a valid audio URL
 * 
 * @param url The URL to check
 * @returns True if the URL is a valid audio URL
 */
export function isValidAudioUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  
  // Check for direct Supabase URLs (public bucket access)
  if (url.includes('supabase.co/storage/v1/object/public/sermon_audio')) {
    return true;
  }
  
  // Check for common audio file extensions
  const audioExtensions = ['.mp3', '.wav', '.ogg', '.m4a', '.flac'];
  if (audioExtensions.some(ext => url.toLowerCase().endsWith(ext))) {
    return true;
  }
  
  // Check for known audio hosting services
  const knownAudioHosts = [
    'cdn.devdojo.com',
    'storage.googleapis.com',
    'sermonaudio.com',
    'buzzsprout.com',
    'soundcloud.com',
    'lojchdvtwypjqupsjynf.supabase.co'
  ];
  
  return knownAudioHosts.some(host => url.includes(host));
}
