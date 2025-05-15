
import React from 'react';
import { Check, Download } from 'lucide-react';
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
    <div className="bg-green-50 border border-green-200 rounded-md p-3 mt-2">
      <div className="flex items-center">
        <Check className="h-5 w-5 text-green-500 mr-2" />
        <span className="text-sm text-green-700 font-medium">
          Audio file uploaded successfully
        </span>
      </div>
      
      <p className="text-xs text-green-600 mt-1 mb-2">
        {filename}
      </p>
      
      {audioUrl && (
        <Button 
          variant="outline" 
          size="sm"
          className="text-xs h-7 px-2 mt-1"
          onClick={handleDownload}
        >
          <Download className="h-3 w-3 mr-1" />
          Download
        </Button>
      )}
    </div>
  );
};
