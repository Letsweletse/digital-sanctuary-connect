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
        
        // Keep original filename and add timestamp to avoid duplication
        const timestamp = Date.now();
        const fileName = file.name;
        const fileExt = fileName.split('.').pop() || '';
        const uniqueName = `${fileName.split('.')[0]}_${timestamp}.${fileExt}`;
        
        // Store image directly, preserving the original name format
        const { data: storageData, error: storageError } = await supabase.storage
          .from('images')
          .upload(uniqueName, file);
        
        if (storageError) {
          console.error('Storage upload error:', storageError);
          
          // Fallback to base64 storage but with preserved filename
          try {
            const imageUrl = e.target.result as string;
            
            // Validate the category
            const safeCategory: ImageCategory = isValidImageCategory(uploadCategory) ? uploadCategory : 'general';
            
            const { data, error } = await supabase
              .from('images')
              .insert([
                { 
                  name: fileName,
                  url: imageUrl,
                  category: safeCategory,
                  uploaded_at: new Date().toISOString()
                }
              ]);
              
            if (error) throw error;
            
            const addedImage: ImageFile = {
              name: fileName,
              url: imageUrl,
              category: safeCategory,
              uploadedAt: new Date()
            };
            
            sendImageUploadEmail(fileName, safeCategory);
            
            resolve({ success: true, image: addedImage });
          } catch (err) {
            console.error('Fallback upload failed:', err);
            reject(err);
          }
        } else {
          // If storage upload successful, get the public URL
          const publicUrl = supabase.storage
            .from('images')
            .getPublicUrl(storageData.path).data.publicUrl;
            
          // Store the reference in the images table
          const safeCategory: ImageCategory = isValidImageCategory(uploadCategory) ? uploadCategory : 'general';
          
          const { data, error } = await supabase
            .from('images')
            .insert([
              { 
                name: fileName,
                url: publicUrl,
                category: safeCategory,
                uploaded_at: new Date().toISOString()
              }
            ]);
            
          if (error) {
            console.error('Database reference error:', error);
            reject(error);
            return;
          }
          
          const addedImage: ImageFile = {
            name: fileName,
            url: publicUrl,
            category: safeCategory,
            uploadedAt: new Date()
          };
          
          sendImageUploadEmail(fileName, safeCategory);
          
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
