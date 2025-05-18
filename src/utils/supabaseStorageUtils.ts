
import { supabase } from '@/integrations/supabase/client';

/**
 * Upload a file to a specified bucket and path.
 */
export const uploadFileToBucket = async (
  bucketName: string,
  path: string,
  file: File,
  upsert: boolean = false,
  onProgress?: (progress: number) => void
): Promise<{ path: string; publicUrl: string }> => {
  // Set up progress tracking if a callback is provided
  let progressInterval: ReturnType<typeof setInterval> | undefined;
  if (onProgress) {
    let lastProgress = 0;
    progressInterval = setInterval(() => {
      // Simulate progress up to 85%
      lastProgress = Math.min(85, lastProgress + Math.random() * 3);
      onProgress(lastProgress);
    }, 800);
  }

  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(path, file, { upsert, contentType: file.type });

    // Clear progress interval
    if (progressInterval) {
      clearInterval(progressInterval);
    }

    if (error) {
      if (onProgress) onProgress(0);
      throw new Error(`Upload failed: ${error.message}`);
    }

    // Complete progress
    if (onProgress) onProgress(100);

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucketName)
      .getPublicUrl(data.path);

    return { path: data.path, publicUrl };
  } catch (err: any) {
    // Clean up interval on error
    if (progressInterval) clearInterval(progressInterval);
    if (onProgress) onProgress(0);
    throw err;
  }
};

/**
 * Create a new bucket if it does not exist.
 */
export const createBucketIfNotExists = async (
  bucketName: string,
  publicAccess: boolean = true,
  fileSizeLimit?: number,
  allowedMimeTypes?: string[]
): Promise<boolean> => {
  try {
    console.log(`Checking if bucket '${bucketName}' exists...`);
    const { data: list, error: listError } = await supabase.storage.listBuckets();

    if (listError) {
      console.error(`Failed to list buckets: ${listError.message}`);
      return false;
    }

    const bucketExists = list?.some((b) => b.name === bucketName);
    
    if (!bucketExists) {
      console.log(`Creating bucket '${bucketName}'...`);
      
      // Options object for creating the bucket
      const options: any = { public: publicAccess };
      
      // Add optional parameters if provided
      if (fileSizeLimit) options.fileSizeLimit = fileSizeLimit;
      if (allowedMimeTypes) options.allowedMimeTypes = allowedMimeTypes;
      
      const { error: createError } = await supabase.storage.createBucket(
        bucketName, 
        options
      );

      if (createError) {
        console.error(`Bucket creation failed: ${createError.message}`);
        
        // Try again with minimal options if needed
        if (fileSizeLimit || allowedMimeTypes) {
          console.log('Retrying with minimal options...');
          const { error: retryError } = await supabase.storage.createBucket(
            bucketName, 
            { public: publicAccess }
          );
          
          if (retryError) {
            console.error('Retry failed:', retryError.message);
            return false;
          }
        } else {
          return false;
        }
      }

      // Give the system time to create the bucket
      await new Promise(resolve => setTimeout(resolve, 2000));

      if (publicAccess) {
        await setupPublicAccessPolicy(bucketName);
      }
    } else {
      console.log(`Bucket '${bucketName}' already exists`);
      
      // Update bucket if it exists but we need to ensure it's public
      if (publicAccess) {
        try {
          await setupPublicAccessPolicy(bucketName);
        } catch (err) {
          console.warn(`Failed to update bucket policy, but bucket exists: ${err.message}`);
        }
      }
    }

    // Verify bucket is accessible
    const accessOk = await testBucketAccess(bucketName);
    if (!accessOk) {
      console.error(`Bucket exists but access test failed for: ${bucketName}`);
      return false;
    }
    
    return true;
  } catch (err: any) {
    console.error(`Error working with bucket ${bucketName}:`, err.message);
    return false;
  }
};

/**
 * Generates a unique filename based on the original name.
 */
export const generateUniqueFileName = (originalName: string): string => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  const extension = originalName.includes('.') 
    ? originalName.substring(originalName.lastIndexOf('.')) 
    : '';
  const baseName = originalName.includes('.')
    ? originalName.substring(0, originalName.lastIndexOf('.')).replace(/\s+/g, '-')
    : originalName.replace(/\s+/g, '-');

  return `${baseName}-${timestamp}-${randomString}${extension}`;
};

/**
 * Sets up public access policy for a bucket.
 */
export const setupPublicAccessPolicy = async (bucketName: string): Promise<void> => {
  try {
    const { error } = await supabase.storage.updateBucket(bucketName, {
      public: true
    });

    if (error) {
      throw new Error(`Failed to set public access for bucket "${bucketName}": ${error.message}`);
    }

    console.log(`Public access enabled for bucket: ${bucketName}`);
  } catch (err: any) {
    console.error('Error setting up bucket policy:', err.message);
    throw err;
  }
};

/**
 * Tests if a bucket is accessible by uploading/removing a dummy file.
 */
export const testBucketAccess = async (bucketName: string): Promise<boolean> => {
  const dummyPath = `access_test_${Date.now()}.txt`;
  const dummyContent = new Blob(['access test']);

  try {
    console.log(`Testing access to bucket '${bucketName}'...`);
    const uploadRes = await supabase.storage
      .from(bucketName)
      .upload(dummyPath, dummyContent, { upsert: true });

    if (uploadRes.error) {
      console.error(`Upload test failed:`, uploadRes.error);
      return false;
    }

    const removeRes = await supabase.storage
      .from(bucketName)
      .remove([dummyPath]);

    if (removeRes.error) {
      console.error(`Cleanup after access test failed:`, removeRes.error);
    }

    console.log(`Access test successful for bucket '${bucketName}'`);
    return true;
  } catch (err) {
    console.error(`Bucket access test failed:`, err);
    return false;
  }
};

/**
 * Upload file to Supabase storage with progress tracking.
 * Legacy wrapper for uploadFileToBucket for compatibility with existing code.
 */
export const uploadFileToStorage = async (
  file: File,
  bucketName: string,
  filePath: string,
  onProgress?: (progress: number) => void
): Promise<{ success: boolean; url: string | null; path?: string; error?: string }> => {
  console.log(`Starting file upload to bucket ${bucketName}: ${file.name} (${(file.size / (1024 * 1024)).toFixed(2)} MB)`);
  
  try {
    // Ensure bucket exists first
    const bucketExists = await createBucketIfNotExists(bucketName, true);
    
    if (!bucketExists) {
      if (onProgress) onProgress(0);
      return { 
        success: false, 
        url: null, 
        error: `Failed to create or access bucket: ${bucketName}` 
      };
    }
    
    // Upload file
    const result = await uploadFileToBucket(
      bucketName,
      filePath,
      file,
      true,  // upsert
      onProgress
    );
    
    return {
      success: true,
      url: result.publicUrl,
      path: result.path
    };
  } catch (error: any) {
    console.error('Error uploading file:', error);
    return { 
      success: false, 
      url: null, 
      error: error.message
    };
  }
};

/**
 * Simplified alias for createBucketIfNotExists for backward compatibility
 */
export const ensureBucketExists = (
  bucketName: string,
  isPublic: boolean = true,
  fileSizeLimit: number = 500 * 1024 * 1024,
  allowedMimeTypes?: string[]
): Promise<boolean> => {
  return createBucketIfNotExists(bucketName, isPublic, fileSizeLimit, allowedMimeTypes);
};
