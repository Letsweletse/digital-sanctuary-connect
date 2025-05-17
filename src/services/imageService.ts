
import { supabase } from '@/integrations/supabase/client';
import { ImageCategory, ImageFile, isValidImageCategory } from '@/types/imageTypes';
import { fetchImagesFromSupabase, getMockImages, validateImageUrl } from '@/utils/imageUtils';
import { sendImageUploadEmail } from '@/lib/emailService';
import { uploadFileToStorage, generateUniqueFileName } from '@/utils/supabaseStorageUtils';

export async function fetchImages(category: ImageCategory): Promise<ImageFile[]> {
  try {
    console.log('Fetching images from Supabase for category:', category);
    
    // First attempt to get images from Supabase
    const supabaseImages = await fetchImagesFromSupabase(category);
    
    // If we have images from Supabase, return them
    if (supabaseImages && supabaseImages.length > 0) {
      console.log(`Found ${supabaseImages.length} images in Supabase`);
      return supabaseImages;
    }
    
    // Fallback to mock images only if Supabase returned empty results
    console.log('No images found in Supabase for category:', category, 'using mock data');
    return getMockImages(category);
  } catch (err) {
    console.error('Error fetching images, using mock data', err);
    return getMockImages(category);
  }
}

export async function uploadImage(file: File, uploadCategory: ImageCategory): Promise<{ success: boolean, image?: ImageFile }> {
  try {
    console.log(`Starting image upload: ${file.name} (${(file.size / 1024).toFixed(1)}KB) to category: ${uploadCategory}`);
    
    // Generate unique filename based on original name
    const uniqueName = generateUniqueFileName(file.name);
    
    // Create a path based on category for better organization
    const filePath = `${uploadCategory}/${uniqueName}`;
    
    // Upload the file using our common upload function
    const result = await uploadFileToStorage(file, 'images', filePath, (progress) => {
      console.log(`Upload progress: ${progress}%`);
    });
    
    if (!result.success || !result.url) {
      console.error('Image upload failed:', result.error);
      return { success: false };
    }
    
    const publicUrl = result.url;
    
    // Validate the category
    const safeCategory: ImageCategory = isValidImageCategory(uploadCategory) ? uploadCategory : 'general';
    
    // Store the reference in the images table
    const { data, error } = await supabase
      .from('images')
      .insert([
        { 
          name: file.name,
          url: publicUrl,
          category: safeCategory,
          uploaded_at: new Date().toISOString()
        }
      ]);
      
    if (error) {
      console.error('Database reference error:', error);
      // Continue even if database insert fails, we still have the URL
    }
    
    const addedImage: ImageFile = {
      name: file.name,
      url: publicUrl,
      category: safeCategory,
      uploadedAt: new Date()
    };
    
    try {
      sendImageUploadEmail(file.name, safeCategory);
    } catch (emailError) {
      console.log('Email notification failed, but upload succeeded:', emailError);
    }
    
    console.log('Image uploaded successfully:', addedImage.url);
    return { success: true, image: addedImage };
  } catch (err) {
    console.error('Error uploading image', err);
    return { success: false };
  }
}

export async function deleteImage(image: ImageFile): Promise<boolean> {
  try {
    // Extract the file path from the URL
    const urlParts = image.url.split('/');
    const fileName = urlParts[urlParts.length - 1];
    const category = image.category || 'general';
    
    // Delete from storage first
    try {
      const { error: storageError } = await supabase.storage
        .from('images')
        .remove([`${category}/${fileName}`]);
      
      if (storageError) {
        console.warn('Storage deletion error:', storageError);
        // Continue anyway to remove from database
      }
    } catch (storageErr) {
      console.warn('Storage deletion failed, continuing with database deletion:', storageErr);
    }
    
    // Delete from database
    const { error } = await supabase
      .from('images')
      .delete()
      .eq('url', image.url);
      
    if (error) {
      console.error('Database deletion error:', error);
      // Still return true to allow UI to remove the image
    }
    
    return true;
  } catch (err) {
    console.error('Error deleting image or Supabase not available, removing from UI only', err);
    // In case of error, we still return true to allow UI to remove the image
    return true;
  }
}
