
import { supabase } from '@/integrations/supabase/client';

/**
 * Creates a Supabase storage bucket if it doesn't exist
 * @param bucketName Name of the bucket to ensure exists
 * @param isPublic Whether the bucket should be public 
 * @param fileSizeLimit Maximum file size limit in bytes
 * @returns Promise<boolean> indicating if bucket is ready
 */
export const ensureBucketExists = async (
  bucketName: string, 
  isPublic: boolean = true, 
  fileSizeLimit: number = 500 * 1024 * 1024
): Promise<boolean> => {
  try {
    // Check if the bucket exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error(`Error checking buckets:`, listError);
      return false;
    }
    
    const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
    
    if (!bucketExists) {
      console.log(`Creating ${bucketName} bucket...`);
      const { error: createError } = await supabase.storage.createBucket(bucketName, {
        public: isPublic,
        fileSizeLimit: fileSizeLimit,
      });
      
      if (createError) {
        console.error(`Error creating ${bucketName} bucket:`, createError);
        return false;
      }
      
      console.log(`${bucketName} bucket created successfully`);
    }
    
    return true;
  } catch (err) {
    console.error(`Error ensuring ${bucketName} bucket exists:`, err);
    return false;
  }
};

/**
 * Generates a unique filename with timestamp for uploads
 * @param originalName Original file name
 * @returns Sanitized unique filename
 */
export const generateUniqueFileName = (originalName: string): string => {
  const timestamp = new Date().getTime();
  const fileExt = originalName.split('.').pop();
  // Create a clean filename by removing special characters
  const cleanFileName = originalName.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 20);
  return `${timestamp}-${cleanFileName}.${fileExt}`;
};
