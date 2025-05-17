
import { supabase } from '@/integrations/supabase/client';
import { ensureBucketExists, generateUniqueFileName, testBucketAccess } from '@/utils/supabaseStorageUtils';

type UploadProgressCallback = (progress: number) => void;

/**
 * Upload audio file to Supabase
 * @param file File to upload
 * @param category Category for the file (folder path)
 * @param onProgress Optional callback for upload progress
 * @returns Promise with upload result
 */
export const uploadAudioToSupabase = async (
  file: File, 
  category: string = 'sermons',
  onProgress?: UploadProgressCallback
): Promise<{ success: boolean, url: string | null, path?: string, error?: string }> => {
  console.log(`Starting audio upload to Supabase: ${file.name} (${(file.size / (1024 * 1024)).toFixed(2)} MB)`);
  
  try {
    // Bucket name
    const bucketName = 'sermon_audio';
    
    // First ensure the sermon_audio bucket exists
    const bucketExists = await ensureBucketExists(bucketName, true, 500 * 1024 * 1024);
    
    if (!bucketExists) {
      const errorMsg = "Failed to create or access the storage bucket";
      console.error(errorMsg);
      if (onProgress) onProgress(0);
      return { success: false, url: null, error: errorMsg };
    }
    
    // Test bucket access
    const canAccess = await testBucketAccess(bucketName);
    if (!canAccess) {
      const errorMsg = "Storage bucket exists but cannot be accessed";
      console.error(errorMsg);
      if (onProgress) onProgress(0);
      return { success: false, url: null, error: errorMsg };
    }
    
    // Generate unique filename based on original name
    const fileName = generateUniqueFileName(file.name);
    const filePath = category ? `${category}/${fileName}` : fileName;
    
    console.log('Uploading audio to path:', filePath);
    
    // Set up progress tracking
    let progressInterval: ReturnType<typeof setInterval> | undefined;
    if (onProgress) {
      // Real progress isn't available from Supabase, so simulate it
      let lastProgress = 0;
      progressInterval = setInterval(() => {
        // Only increment progress up to 85% to avoid the 90% issue
        lastProgress = Math.min(85, lastProgress + Math.random() * 3);
        onProgress(lastProgress);
      }, 1000);
    }
    
    try {
      // Upload the file to Supabase Storage with improved options
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true, // Allow overwriting existing files
          contentType: file.type || 'audio/mpeg', // Set correct content type
        });
        
      // Clear progress interval  
      if (progressInterval) {
        clearInterval(progressInterval);
      }
      
      if (error) {
        console.error('Error uploading file to Supabase:', error);
        if (onProgress) onProgress(0);
        return { success: false, url: null, error: error.message };
      }
      
      console.log('File uploaded successfully:', data?.path);
      
      if (onProgress) {
        // Jump directly to 100% to avoid the 90% issue
        onProgress(100);
      }
      
      // Give the system a moment to process the upload
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Get the public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(data.path);
      
      console.log('File public URL:', publicUrl);
      
      return { success: true, url: publicUrl, path: data.path };
    } catch (uploadError: any) {
      console.error('Upload error:', uploadError);
      if (progressInterval) clearInterval(progressInterval);
      if (onProgress) onProgress(0);
      return { 
        success: false, 
        url: null, 
        error: uploadError.message || 'Unknown upload error' 
      };
    }
  } catch (err: any) {
    console.error('Unexpected error during upload:', err);
    if (onProgress) onProgress(0);
    return { 
      success: false, 
      url: null, 
      error: err.message || 'Unexpected error during upload' 
    };
  }
};
