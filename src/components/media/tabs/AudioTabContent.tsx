
import React from 'react';
import AudioSermonPlayer from '../../media/AudioSermonPlayer';
import MediaUploader from '../../media/MediaUploader';
import { Sermon } from '@/types/sermonTypes';

interface AudioTabContentProps {
  sermons?: Sermon[];
  handleFileUpload: (file: File) => void;
  isMobile?: boolean;
}

const AudioTabContent = ({ sermons, handleFileUpload, isMobile }: AudioTabContentProps) => {
  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 bg-white">
        <h3 className="text-xl font-bold text-church-neutral-900 mb-4">Recent Audio Sermons</h3>
        <p className="text-church-neutral-700 mb-6">
          Listen to our latest sermon recordings directly on our website. You can also download them for offline listening.
        </p>
        
        <AudioSermonPlayer customSermons={sermons} />
      </div>
      
      <div className="glass-panel p-6 bg-white">
        <h3 className="text-xl font-bold text-church-neutral-900 mb-4">Upload Sermon Audio</h3>
        <p className="text-church-neutral-700 mb-6">
          Upload audio files of sermons to share with the community. Once uploaded, they will be processed and made available in our audio library.
        </p>
        
        <MediaUploader
          title="Upload Sermon Audio"
          description="Drag and drop or click to select an audio file"
          acceptedFileTypes="audio/*"
          maxFileSizeMB={60}
          onUpload={handleFileUpload}
        />
        
        <div className="bg-church-blue-light/30 border border-church-blue-light rounded-lg p-4 mt-8">
          <h4 className="font-medium text-church-neutral-800 mb-2">Supported Audio Formats</h4>
          <ul className="list-disc list-inside space-y-1 text-church-neutral-700">
            <li>MP3 (recommended)</li>
            <li>WAV</li>
            <li>AAC</li>
            <li>OGG</li>
            <li>FLAC</li>
            <li>And other common audio formats</li>
          </ul>
        </div>
      </div>
      
      <div className="glass-panel p-6 bg-white">
        <h3 className="text-xl font-bold text-church-neutral-900 mb-4">MP3 Hosting Services</h3>
        <p className="text-church-neutral-700 mb-4">
          For hosting sermon MP3s, we recommend the following services that integrate well with websites:
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <a href="https://soundcloud.com" target="_blank" rel="noopener noreferrer" className="p-4 border border-church-neutral-200 rounded-lg hover:border-church-blue transition-colors">
            <h4 className="font-medium text-church-neutral-800 mb-2">SoundCloud</h4>
            <p className="text-church-neutral-600 text-sm">Great for audio sharing with easy embedding and a customizable player.</p>
          </a>
          
          <a href="https://www.buzzsprout.com" target="_blank" rel="noopener noreferrer" className="p-4 border border-church-neutral-200 rounded-lg hover:border-church-blue transition-colors">
            <h4 className="font-medium text-church-neutral-800 mb-2">Buzzsprout</h4>
            <p className="text-church-neutral-600 text-sm">Podcast hosting that works well for sermon series and regular content.</p>
          </a>
          
          <a href="https://www.sermonaudio.com" target="_blank" rel="noopener noreferrer" className="p-4 border border-church-neutral-200 rounded-lg hover:border-church-blue transition-colors">
            <h4 className="font-medium text-church-neutral-800 mb-2">SermonAudio</h4>
            <p className="text-church-neutral-600 text-sm">Specialized platform for church sermons with many features.</p>
          </a>
        </div>
      </div>
    </div>
  );
};

export default AudioTabContent;
