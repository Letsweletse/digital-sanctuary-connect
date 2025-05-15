
import React from 'react';
import { Check, Download, FileAudio } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface AudioSuccessMessageProps {
  audioUrl: string | null;
  filename: string;
}

export const AudioSuccessMessage = ({ audioUrl, filename }: AudioSuccessMessageProps) => {
  const { toast } = useToast();
  
  const handleDownload = () => {
    if (!audioUrl) {
      toast({
        title: "Download Error",
        description: "Audio file URL is not available.",
        variant: "destructive",
      });
      return;
    }
    
    // Create an invisible anchor and trigger download
    const a = document.createElement('a');
    a.href = audioUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast({
      title: "Download Started",
      description: `Downloading ${filename}`,
    });
  };
  
  return (
    <div className="bg-green-50 border border-green-200 rounded-md p-4 mt-4">
      <div className="flex items-start gap-3">
        <div className="bg-green-100 p-1 rounded-full">
          <Check className="h-4 w-4 text-green-600" />
        </div>
        
        <div className="flex-1">
          <h4 className="text-green-700 font-medium text-sm">
            Audio file uploaded successfully
          </h4>
          
          <div className="mt-2 flex items-center gap-2">
            <FileAudio className="h-4 w-4 text-green-600" />
            <span className="text-xs text-green-700 font-medium truncate max-w-[200px]">
              {filename}
            </span>
          </div>
          
          {audioUrl && (
            <Button 
              variant="outline" 
              size="sm"
              className="text-xs h-8 px-3 mt-3 bg-white text-green-700 border-green-200 hover:bg-green-50 hover:text-green-800"
              onClick={handleDownload}
            >
              <Download className="h-3.5 w-3.5 mr-1.5" />
              Download Copy
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
