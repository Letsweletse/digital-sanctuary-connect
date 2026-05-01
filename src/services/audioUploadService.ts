
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
    // Bucket already exists with public RLS policies — skip admin-level checks
    // (createBucket / updateBucket / listBuckets require service role and will
    // fail for anon users, blocking uploads even though INSERT is permitted).

    // Generate unique filename based on original name
    const fileName = generateUniqueFileName(file.name);
    const filePath = category ? `${category}/${fileName}` : fileName;

    console.log(`Uploading to sermon_audio bucket with path: ${filePath}`);

    // Upload directly using the storage client (RLS allows public INSERT)
    let lastProgress = 0;
    const progressInterval = onProgress
      ? setInterval(() => {
          lastProgress = Math.min(85, lastProgress + Math.random() * 5);
          onProgress(lastProgress);
        }, 600)
      : null;

    const { data, error } = await supabase.storage
      .from('sermon_audio')
      .upload(filePath, file, { upsert: true, contentType: file.type || 'audio/mpeg' });

    if (progressInterval) clearInterval(progressInterval);

    if (error) {
      if (onProgress) onProgress(0);
      console.error('Failed to upload file:', error);
      return { success: false, url: null, error: error.message };
    }

    if (onProgress) onProgress(100);

    const { data: { publicUrl } } = supabase.storage
      .from('sermon_audio')
      .getPublicUrl(data.path);

    const result = { success: true, url: publicUrl, path: data.path };
    
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
