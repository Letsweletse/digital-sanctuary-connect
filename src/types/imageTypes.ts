
export type ImageCategory = 'hero' | 'sermons' | 'events' | 'leadership' | 'general' | 'logo';

export interface ImageFile {
  id: string;
  name: string;
  url: string;
  category: ImageCategory;
  uploadedAt: Date;
}

export function isValidImageCategory(cat: string): cat is ImageCategory {
  return ['hero', 'sermons', 'events', 'leadership', 'general', 'logo'].includes(cat);
}
