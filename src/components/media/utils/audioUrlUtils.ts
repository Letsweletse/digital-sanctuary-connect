
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
  
  // Check for Spotify URLs and episode IDs
  if (url.includes('open.spotify.com/episode/') || url.includes('spotify.com/embed/episode/')) {
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

/**
 * Extract Spotify episode ID from a Spotify URL
 * 
 * @param url Spotify URL
 * @returns The Spotify episode ID or null if not found
 */
export function extractSpotifyEpisodeId(url: string | null | undefined): string | null {
  if (!url) return null;
  
  // Match episode ID from Spotify URLs like:
  // https://open.spotify.com/episode/7makk4oTQel546B0PZlDM5
  const spotifyEpisodeMatch = url.match(/spotify\.com\/episode\/([a-zA-Z0-9]+)/);
  if (spotifyEpisodeMatch && spotifyEpisodeMatch[1]) {
    return spotifyEpisodeMatch[1];
  }
  
  // Check if it's already just an episode ID
  if (/^[a-zA-Z0-9]{22}$/.test(url)) {
    return url;
  }
  
  return null;
}
