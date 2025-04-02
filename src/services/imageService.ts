
import { supabase } from '@/integrations/supabase/client';
import { ImageCategory, ImageFile, isValidImageCategory } from '@/types/imageTypes';
import { fetchImagesFromSupabase, getMockImages, validateImageUrl } from '@/utils/imageUtils';
import { sendImageUploadEmail } from '@/lib/emailService';

export async function fetchImages(category: ImageCategory): Promise<ImageFile[]> {
  try {
    return await fetchImagesFromSupabase(category);
  } catch (err) {
    console.error('Error fetching images, using mock data', err);
    return getMockImages(category);
  }
}

export async function uploadImage(file: File, uploadCategory: ImageCategory): Promise<{ success: boolean, image?: ImageFile }> {
  try {
    return new Promise<{ success: boolean, image?: ImageFile }>((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        if (!e.target?.result) {
          reject(new Error("Failed to read file"));
          return;
        }
        
        const imageUrl = e.target.result as string;
        
        const isValid = await validateImageUrl(imageUrl);
        if (!isValid) {
          console.warn("The image may not be accessible, but we'll upload it anyway.");
        }
        
        // Validate the category
        const safeCategory: ImageCategory = isValidImageCategory(uploadCategory) ? uploadCategory : 'general';
        
        try {
          const timestamp = new Date().toISOString();
          const { data, error } = await supabase
            .from('images')
            .insert([
              { 
                name: file.name,
                url: imageUrl,
                category: safeCategory,
                uploaded_at: timestamp
              }
            ]);
            
          if (error) throw error;
          
          const addedImage: ImageFile = {
            name: file.name,
            url: imageUrl,
            category: safeCategory,
            uploadedAt: new Date()
          };
          
          sendImageUploadEmail(file.name, safeCategory);
          
          resolve({ success: true, image: addedImage });
        } catch (err) {
          console.error('Supabase upload failed, falling back to mock data', err);
          
          const addedImage: ImageFile = {
            name: file.name,
            url: imageUrl,
            category: safeCategory,
            uploadedAt: new Date()
          };
          
          sendImageUploadEmail(file.name, safeCategory);
          
          resolve({ success: true, image: addedImage });
        }
      };
      
      reader.onerror = () => {
        reject(new Error("Failed to read file"));
      };
      
      reader.readAsDataURL(file);
    });
  } catch (err) {
    console.error('Error uploading image', err);
    return { success: false };
  }
}

export async function deleteImage(image: ImageFile): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('images')
      .delete()
      .eq('url', image.url);
      
    if (error) throw error;
    
    return true;
  } catch (err) {
    console.error('Error deleting image or Supabase not available, removing from UI only', err);
    // In case of error, we still return true to allow UI to remove the image
    return true;
  }
}
