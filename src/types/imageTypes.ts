
// Image related types

export type ImageCategory = 
  | 'hero' 
  | 'events' 
  | 'sermons'
  | 'leadership'
  | 'general';

export function isValidImageCategory(category: string): category is ImageCategory {
  return [
    'hero',
    'events',
    'sermons',
    'leadership',
    'general'
  ].includes(category);
}

export interface ImageFile {
  name: string;
  url: string;
  category: ImageCategory;
  uploadedAt: Date;
  contentType: string; // Changed from optional to required
  size?: number; // Added size for better file info
}

export interface ImageUploadResult {
  success: boolean;
  url?: string;
  error?: string;
  image?: ImageFile;
}
