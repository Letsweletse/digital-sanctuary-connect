
import { supabase } from '@/integrations/supabase/client';
import { generateUniqueFileName, uploadFileToStorage, createBucketIfNotExists } from '@/utils/supabaseStorageUtils';

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
    // First, ensure the sermon_audio bucket exists with proper permissions
    const bucketExists = await createBucketIfNotExists('sermon_audio', true, 500 * 1024 * 1024, [
      'audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/*', 'audio/mp4', 'audio/m4a'
    ]);
    
    if (!bucketExists) {
      console.error('Failed to create or access the sermon_audio bucket');
      if (onProgress) onProgress(0);
      return { 
        success: false, 
        url: null, 
        error: 'Failed to create or access storage bucket' 
      };
    }
    
    // Generate unique filename based on original name
    const fileName = generateUniqueFileName(file.name);
    const filePath = category ? `${category}/${fileName}` : fileName;
    
    console.log(`Uploading to sermon_audio bucket with path: ${filePath}`);
    
    // Use the common file upload function
    const result = await uploadFileToStorage(file, 'sermon_audio', filePath, onProgress);
    
    if (!result.success) {
      console.error('Failed to upload file:', result.error);
    } else {
      console.log('Audio upload completed successfully:', result.url);
    }
    
    return result;
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
