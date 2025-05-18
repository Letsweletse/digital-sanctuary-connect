
import { supabase } from '@/integrations/supabase/client';
import { createBucketIfNotExists, generateUniqueFileName, uploadFileToBucket } from '@/utils/supabaseStorageUtils';
import { ImageCategory } from '@/types/imageTypes';

/**
 * Upload image to Supabase storage
 * @param file Image file
 * @param category Image category (folder path)
 * @param onProgress Optional progress callback
 * @returns Object with success status, URL and error if any
 */
export const uploadImageToSupabase = async (
  file: File,
  category?: ImageCategory,
  onProgress?: (progress: number) => void
): Promise<{ success: boolean; url: string | null; error?: string }> => {
  try {
    const bucketName = 'images';
    
    // First, ensure the bucket exists
    const bucketExists = await createBucketIfNotExists(bucketName, true, 50 * 1024 * 1024, [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'image/*'
    ]);
    
    if (!bucketExists) {
      if (onProgress) onProgress(0);
      return { 
        success: false, 
        url: null, 
        error: 'Failed to create or access images bucket' 
      };
    }

    // Generate a unique filename to avoid conflicts
    const fileName = generateUniqueFileName(file.name);
    
    // Create path with category if provided
    const filePath = category ? `${category}/${fileName}` : fileName;
    
    try {
      const result = await uploadFileToBucket(
        bucketName, 
        filePath, 
        file, 
        true, // upsert
        onProgress
      );
      
      // Success
      return {
        success: true,
        url: result.publicUrl
      };
    } catch (error: any) {
      console.error('Upload error:', error);
      if (onProgress) onProgress(0);
      return { 
        success: false, 
        url: null, 
        error: error.message 
      };
    }
  } catch (err: any) {
    console.error('Unexpected error:', err);
    if (onProgress) onProgress(0);
    return { 
      success: false, 
      url: null, 
      error: err.message || 'Unexpected error' 
    };
  }
};

/**
 * Upload image and save to database
 * @param file Image file to upload
 * @param category Image category
 * @param onProgress Optional progress callback
 * @returns Result with success status and image data if successful
 */
export const uploadImage = async (
  file: File, 
  category: ImageCategory,
  onProgress?: (progress: number) => void
): Promise<{ success: boolean; image?: any; error?: string }> => {
  try {
    // First upload the file to storage
    const uploadResult = await uploadImageToSupabase(file, category, onProgress);
    
    if (!uploadResult.success || !uploadResult.url) {
      return { 
        success: false, 
        error: uploadResult.error || 'Upload failed' 
      };
    }
    
    // Then save the image record to the database
    const imageData = {
      name: file.name,
      url: uploadResult.url,
      category: category
    };
    
    await saveImageToDatabase(imageData);
    
    // Return success with the image data
    return {
      success: true,
      image: {
        ...imageData,
        id: Date.now().toString(), // Temporary ID until we get the real one back
        uploaded_at: new Date().toISOString()
      }
    };
  } catch (error: any) {
    console.error('Error in uploadImage:', error);
    return {
      success: false,
      error: error.message || 'Failed to upload and save image'
    };
  }
};

// Add image record to database
export const saveImageToDatabase = async (imageData: {
  name: string;
  url: string;
  category: ImageCategory;
}) => {
  const { error } = await supabase.from('images').insert([
    {
      name: imageData.name,
      url: imageData.url,
      category: imageData.category
    }
  ]);

  if (error) {
    console.error('Error saving image to database:', error);
    throw new Error(`Error saving image to database: ${error.message}`);
  }
};

// Fetch images from database
export const fetchImages = async (category?: ImageCategory) => {
  let query = supabase.from('images').select('*');
  
  if (category) {
    query = query.eq('category', category);
  }
  
  const { data, error } = await query.order('uploaded_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching images:', error);
    throw new Error(`Error fetching images: ${error.message}`);
  }
  
  return data;
};

// Delete image from storage and database
export const deleteImage = async (url: string, id: string) => {
  try {
    // Extract path from URL
    const urlObj = new URL(url);
    const pathWithBucket = urlObj.pathname;
    
    // Remove the /storage/v1/object/public/ prefix to get bucketName/path
    const fullPath = pathWithBucket.replace('/storage/v1/object/public/', '');
    
    // Split into bucket and path
    const [bucketName, ...pathParts] = fullPath.split('/');
    const path = pathParts.join('/');
    
    console.log(`Deleting file from storage: bucket=${bucketName}, path=${path}`);
    
    // Delete from storage
    const { error: storageError } = await supabase
      .storage
      .from(bucketName)
      .remove([path]);
      
    if (storageError) {
      console.error('Error deleting file from storage:', storageError);
      throw new Error(`Error deleting file from storage: ${storageError.message}`);
    }
    
    // Delete from database
    const { error: dbError } = await supabase
      .from('images')
      .delete()
      .eq('id', id);
      
    if (dbError) {
      console.error('Error deleting image from database:', dbError);
      throw new Error(`Error deleting image from database: ${dbError.message}`);
    }
    
    return { success: true };
  } catch (err: any) {
    console.error('Error in deleteImage:', err);
    return { success: false, error: err.message };
  }
};
