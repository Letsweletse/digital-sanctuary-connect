
import { supabase } from '@/integrations/supabase/client';
import { ensureBucketExists, generateUniqueFileName } from '@/utils/supabaseStorageUtils';

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
): Promise<{ success: boolean, url: string | null, path?: string }> => {
  console.log(`Starting audio upload to Supabase: ${file.name} (${(file.size / (1024 * 1024)).toFixed(2)} MB)`);
  
  try {
    // First ensure the sermon_audio bucket exists
    await ensureBucketExists('sermon_audio', true, 100 * 1024 * 1024);
    
    // Generate unique filename based on original name
    const fileName = generateUniqueFileName(file.name);
    const filePath = fileName;
    
    console.log('Uploading audio to path:', filePath);
    
    // Set up progress tracking
    let progressInterval: ReturnType<typeof setInterval> | undefined;
    if (onProgress) {
      // Real progress isn't available from Supabase, so simulate it
      let lastProgress = 0;
      progressInterval = setInterval(() => {
        lastProgress = Math.min(90, lastProgress + Math.random() * 5);
        onProgress(lastProgress);
      }, 800);
    }
    
    try {
      // Upload the file to Supabase Storage
      const { data, error } = await supabase.storage
        .from('sermon_audio')
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
        return { success: false, url: null };
      }
      
      console.log('File uploaded successfully:', data?.path);
      
      if (onProgress) {
        onProgress(100);
      }
      
      // Get the public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from('sermon_audio')
        .getPublicUrl(data.path);
      
      console.log('File public URL:', publicUrl);
      
      return { success: true, url: publicUrl, path: data.path };
    } catch (uploadError) {
      console.error('Upload error:', uploadError);
      if (progressInterval) clearInterval(progressInterval);
      if (onProgress) onProgress(0);
      return { success: false, url: null };
    }
  } catch (err) {
    console.error('Unexpected error during upload:', err);
    if (onProgress) onProgress(0);
    return { success: false, url: null };
  }
};
