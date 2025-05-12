
import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { ImageCategory } from '@/types/imageTypes';
import { Sermon } from '@/types/sermonTypes';
import SermonBasicInfo from './form-fields/SermonBasicInfo';
import SermonDescription from './form-fields/SermonDescription';
import SpeakerImageUpload from './form-fields/SpeakerImageUpload';
import SermonAudioUpload from './form-fields/SermonAudioUpload';
import FormActions from './form-fields/FormActions';

interface SermonFormProps {
  sermon?: Sermon;
  onSubmit: (sermon: Omit<Sermon, 'id'>) => void;
  onCancel: () => void;
  isEditing: boolean;
}

const SermonForm = ({ sermon, onSubmit, onCancel, isEditing }: SermonFormProps) => {
  const { toast } = useToast();
  
  // Form state
  const [title, setTitle] = useState(sermon?.title || '');
  const [speaker, setSpeaker] = useState(sermon?.speaker || '');
  const [date, setDate] = useState<Date>(sermon?.date ? new Date(sermon.date) : new Date());
  const [description, setDescription] = useState(sermon?.description || '');
  const [youtubeId, setYoutubeId] = useState(sermon?.youtubeId || '');
  const [tags, setTags] = useState(sermon?.tags?.join(', ') || '');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [speakerImage, setSpeakerImage] = useState(sermon?.speakerImage || '');
  const [speakerImageFile, setSpeakerImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [series, setSeries] = useState(sermon?.series || '');  // Added series field
  
  // Log for debugging
  useEffect(() => {
    if (sermon) {
      console.log('Editing sermon:', sermon);
    }
  }, [sermon]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!title || !speaker || !date) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const formattedTags = tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
      
      // In a real application, we would upload the files to a storage service
      // and get back URLs to use in the sermon data
      
      // For demo purposes, create object URLs
      let audioUrl = sermon?.audioUrl || '';
      if (audioFile) {
        audioUrl = URL.createObjectURL(audioFile);
        console.log('Created audio URL:', audioUrl);
      }
      
      const formData = {
        title,
        speaker,
        speakerImage: speakerImage || '/placeholder.svg',
        date,
        audioUrl,
        youtubeId,
        description,
        tags: formattedTags,
        series, // Add series to form data
        // Add default values for other fields
        thumbnailUrl: 'https://lovable.dev/projects/b4242310-0169-49ed-bc97-e6669ce1cf89',
        duration: '00:00', 
      };
      
      console.log('Submitting sermon data:', formData);
      onSubmit(formData);
      
      // Cleanup object URLs
      if (audioFile) {
        URL.revokeObjectURL(audioUrl);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Error",
        description: "An error occurred while saving the sermon. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle speaker image upload
  const handleSpeakerImageUpload = async (file: File, category: ImageCategory) => {
    if (file) {
      // In a real app, upload the file to a server and get the URL
      setSpeakerImage(URL.createObjectURL(file));
      setSpeakerImageFile(file);
      
      console.log('Speaker image uploaded:', file.name);
      
      toast({
        title: "Image uploaded",
        description: "Speaker image has been uploaded.",
      });
      
      return true;
    }
    return false;
  };
  
  // Handle audio file upload
  const handleAudioUpload = async (file: File, category: ImageCategory) => {
    if (file) {
      setAudioFile(file);
      
      console.log('Audio file uploaded:', file.name);
      
      toast({
        title: "Audio uploaded",
        description: `File "${file.name}" has been uploaded.`,
      });
      
      return true;
    }
    return false;
  };

  return (
    <div className="glass-panel bg-white p-6 rounded-xl shadow-md">
      <h3 className="text-xl font-bold text-church-neutral-900 mb-6">
        {isEditing ? 'Edit Sermon' : 'Add New Sermon'}
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <SermonBasicInfo
          title={title}
          setTitle={setTitle}
          speaker={speaker}
          setSpeaker={setSpeaker}
          date={date}
          setDate={setDate}
          youtubeId={youtubeId}
          setYoutubeId={setYoutubeId}
        />
        
        {/* Add Series field */}
        <div className="space-y-4">
          <div>
            <label htmlFor="series" className="block text-sm font-medium text-gray-700 mb-1">
              Sermon Series (Optional)
            </label>
            <input
              type="text"
              id="series"
              value={series}
              onChange={(e) => setSeries(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-church-blue"
              placeholder="e.g. Perspectives on the Apostolic"
            />
          </div>
        </div>
        
        <SermonDescription
          description={description}
          setDescription={setDescription}
          tags={tags}
          setTags={setTags}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SpeakerImageUpload
            speaker={speaker}
            speakerImage={speakerImage}
            setSpeakerImage={setSpeakerImage}
            handleSpeakerImageUpload={handleSpeakerImageUpload}
          />
          
          <SermonAudioUpload
            audioFile={audioFile}
            setAudioFile={setAudioFile}
            handleAudioUpload={handleAudioUpload}
          />
        </div>
        
        <FormActions onCancel={onCancel} isEditing={isEditing} isSubmitting={isSubmitting} />
      </form>
    </div>
  );
};

export default SermonForm;
