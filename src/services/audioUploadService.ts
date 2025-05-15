
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
    // Ensure the bucket exists
    const bucketReady = await ensureBucketExists('sermons', true);
    if (!bucketReady) {
      console.error('Could not prepare storage for uploads');
      return { success: false, url: null };
    }
    
    // Generate unique filename and path
    const fileName = generateUniqueFileName(file.name);
    const filePath = `${category}/${fileName}`;
    
    console.log('Uploading audio to path:', filePath);
    
    // Set up progress tracking
    if (onProgress) {
      // Use manual progress simulation since Supabase doesn't provide real progress events
      const progressInterval = setInterval(() => {
        onProgress(Math.min(90, Math.random() * 5 + (onProgress as any).lastProgress || 0));
        (onProgress as any).lastProgress = (onProgress as any).lastProgress ? 
          Math.min(90, (onProgress as any).lastProgress + Math.random() * 5) : 10;
      }, 800);
      
      // Clean up interval when done
      setTimeout(() => clearInterval(progressInterval), 30000); // Safety timeout
    }
    
    // Upload the file to Supabase Storage
    const { data, error } = await supabase.storage
      .from('sermons')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true, // Allow overwriting existing files
        contentType: file.type, // Set correct content type
      });
      
    // Clear any intervals if using progress
    if (onProgress && (onProgress as any).interval) {
      clearInterval((onProgress as any).interval);
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
      .getPublicUrl(filePath);
    
    console.log('File uploaded successfully, public URL:', publicUrl);
    
    // Verify the URL using a HEAD request
    try {
      const response = await fetch(publicUrl, { method: 'HEAD' });
      if (!response.ok) {
        console.warn('Audio URL may not be publicly accessible:', publicUrl, response.status);
      } else {
        console.log('Audio URL is publicly accessible:', publicUrl);
      }
    } catch (testErr) {
      console.warn('Error testing audio URL:', testErr);
    }
    
    // Set a small delay before returning to allow the storage to process the file
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return { success: true, url: publicUrl, path: data?.path };
  } catch (err) {
    console.error('Unexpected error during upload:', err);
    return { success: false, url: null };
  }
};
