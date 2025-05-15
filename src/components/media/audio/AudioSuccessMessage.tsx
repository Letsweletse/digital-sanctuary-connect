
import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, Loader2 } from 'lucide-react';
import { testAudioPlayback, handleDownload } from './AudioValidationHelper';

interface AudioSuccessMessageProps {
  audioUrl: string | null;
  audioFile: File | null;
  audioError: string | null;
  isTestingAudio: boolean;
  setIsTestingAudio: React.Dispatch<React.SetStateAction<boolean>>;
}

const AudioSuccessMessage: React.FC<AudioSuccessMessageProps> = ({
  audioUrl,
  audioFile,
  audioError,
  isTestingAudio,
  setIsTestingAudio,
}) => {
  if (!audioUrl || audioError) return null;

  const handleTestAudio = async () => {
    if (!audioUrl) return;
    setIsTestingAudio(true);
    await testAudioPlayback(audioUrl);
    setIsTestingAudio(false);
  };

  return (
    <div className="mt-4 p-4 rounded-md bg-green-50 border border-green-100">
      <div className="flex items-center gap-2 mb-2 text-green-700">
        <CheckCircle className="h-5 w-5" />
        <span className="font-medium">Audio file uploaded successfully</span>
      </div>
      
      <div className="text-sm text-green-700">
        <p>
          Your sermon audio is ready to be saved with this form. Make sure to fill out all the required fields and click "Save" to finalize.
        </p>
        
        <div className="flex gap-2 mt-3">
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            disabled={isTestingAudio}
            onClick={handleTestAudio}
            className="bg-white"
          >
            {isTestingAudio ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Testing...
              </>
            ) : (
              'Test Audio'
            )}
          </Button>
          
          {audioUrl && (
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              onClick={() => handleDownload(audioUrl, audioFile)}
              className="flex items-center gap-1 bg-white"
            >
              <Download className="h-4 w-4" />
              Download
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AudioSuccessMessage;
