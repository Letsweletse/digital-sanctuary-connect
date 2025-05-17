
import { supabase } from '@/integrations/supabase/client';
import { generateUniqueFileName, uploadFileToStorage } from '@/utils/supabaseStorageUtils';

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
    // Generate unique filename based on original name
    const fileName = generateUniqueFileName(file.name);
    const filePath = category ? `${category}/${fileName}` : fileName;
    
    // Use the common file upload function
    return await uploadFileToStorage(file, 'sermon_audio', filePath, onProgress);
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
