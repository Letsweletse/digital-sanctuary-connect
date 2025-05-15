
/**
 * Check if URL is a valid audio URL
 */
export const isValidAudioUrl = (url: string | null | undefined): boolean => {
  if (!url) return false;
  
  // Check if it's a Supabase URL or a blob URL or other common audio hosting URLs
  return (
    (url.startsWith('https://') && 
      (url.includes('storage.googleapis.com') || 
       url.includes('lojchdvtwypjqupsjynf.supabase.co/storage/') || 
       url.includes('cdn.devdojo.com') ||
       url.includes('sermonaudio.com') ||
       url.includes('buzzsprout.com') ||
       url.includes('soundcloud.com'))) || 
    url.startsWith('blob:') || 
    url.endsWith('.mp3') ||
    url.endsWith('.wav') ||
    url.endsWith('.ogg') ||
    url.endsWith('.m4a')
  );
};

/**
 * Get default sermon image based on sermon or speaker name
 */
export const getDefaultSermonImage = (sermon?: { title?: string, speaker?: string, series?: string }): string => {
  // Default church logo
  const churchLogoUrl = "/lovable-uploads/8c65fe13-b78a-486c-b18b-796c1ca1e52b.png";
  
  if (!sermon) return churchLogoUrl;
  
  // Check if it's a special series
  if (sermon.series === 'Perspectives on the Apostolic') {
    return "https://lojchdvtwypjqupsjynf.supabase.co/storage/v1/object/public/images/leadership/POA_1743681812478.jpg";
  }
  
  // Return church logo as default fallback
  return churchLogoUrl;
};
