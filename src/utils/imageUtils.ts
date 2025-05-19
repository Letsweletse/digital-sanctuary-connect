
import { supabase } from '@/integrations/supabase/client';
import { ImageCategory, ImageFile, isValidImageCategory } from '@/types/imageTypes';

export async function fetchImagesFromSupabase(category: ImageCategory): Promise<ImageFile[]> {
  try {
    console.log('Fetching images from Supabase for category:', category);
    
    let query = supabase.from('images').select('*');
    
    // Apply filter only if not fetching all images
    if (category !== 'general') {
      query = query.eq('category', category);
    }
    
    // Order by upload date, newest first
    query = query.order('uploaded_at', { ascending: false });
    
    let { data: images, error } = await query;
    
    if (error) {
      console.error('Supabase query error:', error);
      throw error;
    }
    
    console.log(`Found ${images?.length || 0} images in Supabase`);
    
    if (images && images.length > 0) {
      return images.map((img: any) => {
        const imgCategory = img.category || 'general';
        const validCategory: ImageCategory = isValidImageCategory(imgCategory) ? imgCategory : 'general';
        
        return {
          id: img.id || `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: img.name || 'Untitled',
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
      id: 'hero-1',
      name: 'hero-image.jpg',
      url: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3',
      category: 'hero',
      uploadedAt: new Date(2023, 5, 15)
    },
    {
      id: 'sermon-1',
      name: 'sermon-cover.jpg',
      url: 'https://images.unsplash.com/photo-1508963493744-76fce69379c0',
      category: 'sermons',
      uploadedAt: new Date(2023, 6, 22)
    },
    {
      id: 'event-1',
      name: 'event-banner.jpg',
      url: 'https://images.unsplash.com/photo-1523580494863-6f31031224c94',
      category: 'events',
      uploadedAt: new Date(2023, 7, 10)
    },
    {
      id: 'pastor-1',
      name: 'pastor-john.jpg',
      url: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81',
      category: 'leadership',
      uploadedAt: new Date(2023, 8, 5)
    },
    {
      id: 'elders-1',
      name: 'elder-board.jpg',
      url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c',
      category: 'leadership',
      uploadedAt: new Date(2023, 9, 15)
    }
  ];
  
  return mockImages.filter(img => category === 'general' || img.category === category);
}

export async function validateImageUrl(url: string): Promise<boolean> {
  // This is an improved validator function that checks if the URL is accessible
  if (!url) return false;
  
  // If it's a Supabase URL, assume it's valid (to avoid CORS issues with HEAD requests)
  if (url.includes('supabase.co/storage')) {
    return true;
  }
  
  try {
    const response = await fetch(url, { method: 'HEAD', mode: 'no-cors' });
    return true; // If no error is thrown, assume the URL is valid
  } catch (err) {
    console.error('URL validation failed:', err);
    return false;
  }
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
}
