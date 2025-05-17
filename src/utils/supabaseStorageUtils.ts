
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
        allowedMimeTypes: ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/*', 'audio/mp4', 'audio/m4a']
      });
      
      if (createError) {
        console.error(`Error creating ${bucketName} bucket:`, createError);
        return false;
      }
      
      console.log(`${bucketName} bucket created successfully`);

      // Add public access policy to the bucket if needed
      if (isPublic) {
        try {
          await setupPublicAccessPolicy(bucketName);
        } catch (policyError) {
          console.error(`Error setting up policies for ${bucketName}:`, policyError);
          // Even if policy setup fails, the bucket exists
          return true;
        }
      }
      
      // Give Supabase a moment to fully set up the bucket
      await new Promise(resolve => setTimeout(resolve, 1500));
    } else {
      console.log(`${bucketName} bucket already exists`);
    }
    
    return true;
  } catch (err) {
    console.error(`Error ensuring ${bucketName} bucket exists:`, err);
    return false;
  }
};

/**
 * Sets up a public access policy for the bucket
 * @param bucketName Name of the bucket to set policy for
 */
export const setupPublicAccessPolicy = async (bucketName: string): Promise<void> => {
  try {
    // Update the bucket to make it public
    const { error: updateError } = await supabase.storage.updateBucket(bucketName, {
      public: true
    });
    
    if (updateError) {
      console.error(`Error setting bucket to public:`, updateError);
      throw updateError;
    }
    
    console.log(`Public access policy set for ${bucketName}`);
  } catch (err) {
    console.error(`Error setting up bucket policies:`, err);
    throw err;
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
  const cleanFileName = originalName
    .replace(/\.[^/.]+$/, "") // Remove extension
    .replace(/[^a-zA-Z0-9]/g, '_') // Replace non-alphanumeric with underscore
    .substring(0, 20); // Limit length
    
  return `${cleanFileName}_${timestamp}.${fileExt}`;
};

/**
 * Tests access to a storage bucket
 * @param bucketName Name of the bucket to test
 * @returns Promise<boolean> indicating if bucket is accessible
 */
export const testBucketAccess = async (bucketName: string): Promise<boolean> => {
  try {
    // Try to list files in the bucket
    const { data, error } = await supabase.storage
      .from(bucketName)
      .list();
    
    if (error) {
      console.error(`Error accessing ${bucketName} bucket:`, error);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error(`Error testing access to ${bucketName} bucket:`, err);
    return false;
  }
};
