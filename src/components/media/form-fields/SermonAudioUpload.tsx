
import React from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Music, Trash2 } from 'lucide-react';
import DragDropUploader from '../DragDropUploader';
import { ImageCategory } from '@/types/imageTypes';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface SermonAudioUploadProps {
  audioFile: File | null;
  setAudioFile: (file: File | null) => void;
  handleAudioUpload: (file: File, category: ImageCategory) => Promise<boolean>;
  audioUrl: string | null;
  setAudioUrl: (url: string | null) => void;
}

const SermonAudioUpload = ({
  audioFile,
  setAudioFile,
  handleAudioUpload,
  audioUrl,
  setAudioUrl
}: SermonAudioUploadProps) => {
  const { toast } = useToast();
  
  // Handle file upload to Supabase storage
  const uploadToSupabase = async (file: File, category: string) => {
    try {
      // Generate a unique filename with timestamp
      const timestamp = new Date().getTime();
      const fileExt = file.name.split('.').pop();
      const fileName = `${timestamp}-${file.name.substring(0, 20).replace(/[^a-zA-Z0-9]/g, '_')}.${fileExt}`;
      const filePath = `${category}/${fileName}`;
      
      // Upload the file to Supabase Storage
      const { data, error } = await supabase.storage
        .from('sermons')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });
        
      if (error) {
        console.error('Error uploading file to Supabase:', error);
        toast({
          title: 'Upload Error',
          description: error.message || 'Failed to upload audio file',
          variant: 'destructive',
        });
        return { success: false, url: null };
      }
      
      // Get the public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from('sermons')
        .getPublicUrl(filePath);
      
      console.log('File uploaded successfully, public URL:', publicUrl);
      
      return { success: true, url: publicUrl };
    } catch (err) {
      console.error('Unexpected error during upload:', err);
      toast({
        title: 'Upload Error',
        description: 'An unexpected error occurred during upload',
        variant: 'destructive',
      });
      return { success: false, url: null };
    }
  };
  
  // Custom audio upload handler that updates the URL state
  const handleAudioUploadWithUrl = async (file: File, category: ImageCategory) => {
    const result = await uploadToSupabase(file, category.toString());
    
    if (result.success && result.url) {
      setAudioUrl(result.url);
      return true;
    }
    
    return false;
  };

  return (
    <div>
      <Label className="block mb-2">Sermon Audio File (All Audio Formats)</Label>
      {audioFile && (
        <div className="mb-4 p-3 bg-church-neutral-50 rounded-md flex items-center justify-between">
          <div className="flex items-center">
            <Music className="h-5 w-5 text-church-blue mr-2" />
            <span className="text-sm font-medium truncate max-w-[200px]">
              {audioFile.name}
            </span>
          </div>
          <Button 
            type="button" 
            variant="ghost" 
            size="sm"
            onClick={() => {
              setAudioFile(null);
              setAudioUrl(null);
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )}
      {audioUrl && !audioFile && (
        <div className="mb-4 p-3 bg-church-neutral-50 rounded-md flex items-center justify-between">
          <div className="flex items-center">
            <Music className="h-5 w-5 text-church-blue mr-2" />
            <span className="text-sm font-medium truncate max-w-[200px]">
              {audioUrl.split('/').pop()}
            </span>
          </div>
          <Button 
            type="button" 
            variant="ghost" 
            size="sm"
            onClick={() => setAudioUrl(null)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )}
      <DragDropUploader 
        onFileAccepted={handleAudioUploadWithUrl}
        category="sermons"
        acceptedFileTypes={['audio/*']} 
        maxSize={60 * 1024 * 1024} // 60MB limit
      />
    </div>
  );
};

export default SermonAudioUpload;
