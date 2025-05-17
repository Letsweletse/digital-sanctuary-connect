import { supabase } from '@/integrations/supabase/client';

/**
 * Creates a Supabase storage bucket if it doesn't exist
 * @param bucketName Name of the bucket to ensure exists
 * @param isPublic Whether the bucket should be public 
 * @param fileSizeLimit Maximum file size limit in bytes
 * @param allowedMimeTypes Array of allowed MIME types (optional)
 * @returns Promise<boolean> indicating if bucket is ready
 */
export const ensureBucketExists = async (
  bucketName: string, 
  isPublic: boolean = true, 
  fileSizeLimit: number = 500 * 1024 * 1024,
  allowedMimeTypes?: string[]
): Promise<boolean> => {
  try {
    // Default mime types if none provided
    const defaultMimeTypes = allowedMimeTypes || [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/*', 'audio/mp4', 'audio/m4a'
    ];
    
    console.log(`Checking if ${bucketName} bucket exists...`);
    
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
        allowedMimeTypes: defaultMimeTypes
      });
      
      if (createError) {
        console.error(`Error creating ${bucketName} bucket:`, createError);
        // Try again with minimal options if the detailed config failed
        const { error: simpleCreateError } = await supabase.storage.createBucket(bucketName, {
          public: isPublic
        });
        
        if (simpleCreateError) {
          console.error(`Failed with minimal options:`, simpleCreateError);
          return false;
        }
      }
      
      console.log(`${bucketName} bucket created successfully`);

      // Wait a moment to allow bucket creation to fully process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Add public access policy to the bucket if needed
      if (isPublic) {
        try {
          await setupPublicAccessPolicy(bucketName);
        } catch (policyError) {
          console.error(`Error setting up policies for ${bucketName}:`, policyError);
          // Even if policy setup fails, the bucket exists
        }
      }
      
      // Give Supabase a moment to fully set up the bucket
      await new Promise(resolve => setTimeout(resolve, 2500));
    } else {
      console.log(`${bucketName} bucket already exists`);
      
      // Update bucket to ensure it's public with correct settings
      if (isPublic) {
        const { error: updateError } = await supabase.storage.updateBucket(bucketName, {
          public: true,
          fileSizeLimit: fileSizeLimit,
          allowedMimeTypes: defaultMimeTypes
        });
        
        if (updateError) {
          console.error(`Error updating ${bucketName} bucket:`, updateError);
          // Try with minimal options
          const { error: simpleUpdateError } = await supabase.storage.updateBucket(bucketName, {
            public: true
          });
          
          if (simpleUpdateError) {
            console.error(`Failed with minimal options:`, simpleUpdateError);
          }
        }
      }
    }
    
    // Final check to verify bucket is accessible
    const canAccess = await testBucketAccess(bucketName);
    if (!canAccess) {
      console.error(`Created bucket but cannot access it: ${bucketName}`);
      return false;
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
  const fileExt = originalName.split('.').pop() || '';
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

/**
 * Get direct URL for a file with temporary access
 * This is useful for files in private buckets
 * @param bucketName Name of the bucket
 * @param filePath Path to the file
 * @param expiresIn Expiration time in seconds (default 60 minutes)
 * @returns URL with temporary access
 */
export const getTemporaryFileUrl = async (
  bucketName: string, 
  filePath: string, 
  expiresIn: number = 3600
): Promise<string | null> => {
  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .createSignedUrl(filePath, expiresIn);
      
    if (error) {
      console.error(`Error creating signed URL:`, error);
      return null;
    }
    
    return data.signedUrl;
  } catch (err) {
    console.error(`Error getting temporary URL:`, err);
    return null;
  }
};

/**
 * Upload file to Supabase storage
 * @param file File to upload
 * @param bucketName Name of the bucket
 * @param filePath Path within the bucket
 * @param onProgress Optional progress callback
 * @returns Result object with success status and URL or error
 */
export const uploadFileToStorage = async (
  file: File,
  bucketName: string,
  filePath: string,
  onProgress?: (progress: number) => void
): Promise<{ success: boolean; url: string | null; path?: string; error?: string }> => {
  console.log(`Starting file upload to Supabase bucket ${bucketName}: ${file.name} (${(file.size / (1024 * 1024)).toFixed(2)} MB)`);
  
  try {
    // First ensure the bucket exists
    const bucketExists = await ensureBucketExists(bucketName, true, 500 * 1024 * 1024);
    
    if (!bucketExists) {
      const errorMsg = `Failed to create or access the storage bucket ${bucketName}`;
      console.error(errorMsg);
      if (onProgress) onProgress(0);
      return { success: false, url: null, error: errorMsg };
    }
    
    // Test bucket access
    const canAccess = await testBucketAccess(bucketName);
    if (!canAccess) {
      const errorMsg = `Storage bucket ${bucketName} exists but cannot be accessed`;
      console.error(errorMsg);
      if (onProgress) onProgress(0);
      return { success: false, url: null, error: errorMsg };
    }
    
    console.log('Uploading file to path:', filePath);
    
    // Set up progress tracking
    let progressInterval: ReturnType<typeof setInterval> | undefined;
    if (onProgress) {
      // Real progress isn't available from Supabase, so simulate it
      let lastProgress = 0;
      progressInterval = setInterval(() => {
        // Only increment progress up to 85% to avoid the 90% issue
        lastProgress = Math.min(85, lastProgress + Math.random() * 3);
        onProgress(lastProgress);
      }, 800);
    }
    
    try {
      // Upload the file to Supabase Storage with improved options
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true, // Allow overwriting existing files
          contentType: file.type || 'application/octet-stream', // Set correct content type
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
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get the public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(data.path);
      
      console.log('File public URL:', publicUrl);
      
      // Test the URL is accessible
      try {
        const response = await fetch(publicUrl, { method: 'HEAD' });
        if (!response.ok) {
          console.warn('Generated URL may not be accessible:', response.status);
        }
      } catch (urlTestError) {
        console.warn('URL verification failed, but upload succeeded:', urlTestError);
      }
      
      return { success: true, url: publicUrl, path: data.path };
    } catch (uploadError: any) {
      console.error('Upload error:', uploadError);
      if (progressInterval) clearInterval(progressInterval);
      if (onProgress) onProgress(0);
      
      // Try a simpler upload approach as fallback
      try {
        console.log('Attempting fallback upload method...');
        const { data, error } = await supabase.storage
          .from(bucketName)
          .upload(filePath, file);
          
        if (error) {
          console.error('Fallback upload failed:', error);
          return { 
            success: false, 
            url: null, 
            error: error.message || 'Upload failed even with fallback method' 
          };
        }
        
        if (onProgress) onProgress(100);
        const { data: { publicUrl } } = supabase.storage
          .from(bucketName)
          .getPublicUrl(data.path);
          
        return { success: true, url: publicUrl, path: data.path };
      } catch (fallbackError: any) {
        return { 
          success: false, 
          url: null, 
          error: uploadError.message || 'Unknown upload error' 
        };
      }
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
