
/**
 * Utility functions for handling speaker images
 */

// Image paths for all speakers
export const SPEAKER_IMAGES = {
  'Pastor Kobus Bezuidenhout': '/lovable-uploads/20736aa1-df4f-4d5b-b226-d41cb293bbe0.png',
  'Pastor Oteng Leepile': '/lovable-uploads/bb2cad8b-0655-4b9e-acde-059a018eba68.png',
  'Pastor Cynthia Harman': '/lovable-uploads/cfcf20f7-6921-4a44-b7ca-47809450d18c.png',
  'Peter Taylor': '/lovable-uploads/a90674e8-ab9d-4607-97c5-e9553e6d0075.png',
  'Thamo Naidoo': '/lovable-uploads/ea1ede4c-7cee-49ec-9868-2ddbcdac5818.png',
};

export const DEFAULT_LOGO = '/lovable-uploads/8c65fe13-b78a-486c-b18b-796c1ca1e52b.png';

/**
 * Gets the appropriate image for a speaker
 * @param speaker - The speaker's name
 * @param fallbackImage - Optional fallback image URL
 * @returns The speaker's image URL or fallback/default image
 */
export const getSpeakerImage = (speaker: string, fallbackImage?: string): string => {
  if (speaker in SPEAKER_IMAGES) {
    return SPEAKER_IMAGES[speaker as keyof typeof SPEAKER_IMAGES];
  }
  return fallbackImage || DEFAULT_LOGO;
};
