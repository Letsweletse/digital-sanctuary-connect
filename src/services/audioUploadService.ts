
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
    // Check if storage bucket exists, create if it doesn't
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === 'sermons');
    
    if (!bucketExists) {
      console.log('Creating sermons bucket...');
      const { error: createError } = await supabase.storage
        .createBucket('sermons', {
          public: true,
          fileSizeLimit: 500 * 1024 * 1024, // 500MB limit
          allowedMimeTypes: ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg']
        });
      
      if (createError) {
        console.error('Error creating bucket:', createError);
        return { success: false, url: null };
      }
    }
    
    // Generate unique filename and path
    const fileName = generateUniqueFileName(file.name);
    const filePath = `${category}/${fileName}`;
    
    console.log('Uploading audio to path:', filePath);
    
    // Set up progress tracking
    let progressInterval: ReturnType<typeof setInterval> | undefined;
    if (onProgress) {
      // Real progress isn't available from Supabase, so simulate it
      progressInterval = setInterval(() => {
        onProgress(Math.min(90, Math.random() * 5 + ((onProgress as any).lastProgress || 0)));
        (onProgress as any).lastProgress = (onProgress as any).lastProgress ? 
          Math.min(90, (onProgress as any).lastProgress + Math.random() * 5) : 10;
      }, 800);
    }
    
    // Upload the file to Supabase Storage
    const { data, error } = await supabase.storage
      .from('sermons')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true, // Allow overwriting existing files
        contentType: file.type, // Set correct content type
      });
      
    // Clear progress interval  
    if (progressInterval) {
      clearInterval(progressInterval);
    }
    
    if (error) {
      console.error('Error uploading file to Supabase:', error);
      return { success: false, url: null };
    }
    
    console.log('File uploaded successfully:', data?.path);
    
    if (onProgress) {
      onProgress(100);
    }
    
    // Get the public URL for the uploaded file
    const { data: { publicUrl } } = supabase.storage
      .from('sermons')
      .getPublicUrl(data.path);
    
    console.log('File public URL:', publicUrl);
    
    return { success: true, url: publicUrl, path: data.path };
  } catch (err) {
    console.error('Unexpected error during upload:', err);
    return { success: false, url: null };
  }
};
