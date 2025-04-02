
import { supabase } from '@/integrations/supabase/client';
import { ImageCategory, ImageFile, isValidImageCategory } from '@/types/imageTypes';
import { createEqualsFilter } from '@/utils/supabaseUtils';

export async function fetchImagesFromSupabase(category: ImageCategory): Promise<ImageFile[]> {
  try {
    let query = supabase.from('images').select('*');
    
    // Apply filter only if not fetching all images
    if (category !== 'general') {
      query = query.eq('category', category);
    }
    
    let { data: images, error } = await query;
    
    if (error) throw error;
    
    if (images && images.length > 0) {
      return images.map((img: any) => {
        const imgCategory = img.category || 'general';
        const validCategory: ImageCategory = isValidImageCategory(imgCategory) ? imgCategory : 'general';
        
        return {
          name: img.name,
          url: img.url,
          category: validCategory,
          uploadedAt: new Date(img.uploaded_at || Date.now())
        };
      });
    }
    return [];
  } catch (err) {
    console.error('Error fetching images from Supabase', err);
    throw err;
  }
}

export function getMockImages(category: ImageCategory): ImageFile[] {
  const mockImages: ImageFile[] = [
    {
      name: 'hero-image.jpg',
      url: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3',
      category: 'hero',
      uploadedAt: new Date(2023, 5, 15)
    },
    {
      name: 'sermon-cover.jpg',
      url: 'https://images.unsplash.com/photo-1508963493744-76fce69379c0',
      category: 'sermons',
      uploadedAt: new Date(2023, 6, 22)
    },
    {
      name: 'event-banner.jpg',
      url: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94',
      category: 'events',
      uploadedAt: new Date(2023, 7, 10)
    },
    {
      name: 'pastor-john.jpg',
      url: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81',
      category: 'leadership',
      uploadedAt: new Date(2023, 8, 5)
    },
    {
      name: 'elder-board.jpg',
      url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c',
      category: 'leadership',
      uploadedAt: new Date(2023, 9, 15)
    }
  ];
  
  return mockImages.filter(img => category === 'general' || img.category === category);
}

export async function validateImageUrl(url: string): Promise<boolean> {
  // This is a stub function, in a real app you'd validate the image URL
  return true;
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
}
