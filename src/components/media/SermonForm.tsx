
import React, { useState } from 'react';
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
  
  const handleSubmit = (e: React.FormEvent) => {
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
    
    const formattedTags = tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
    
    const formData = {
      title,
      speaker,
      speakerImage: speakerImage || '/placeholder.svg',
      date,
      audioUrl: audioFile ? URL.createObjectURL(audioFile) : sermon?.audioUrl || '',
      youtubeId,
      description,
      tags: formattedTags,
    };
    
    onSubmit(formData);
  };
  
  // Handle speaker image upload
  const handleSpeakerImageUpload = async (file: File, category: ImageCategory) => {
    if (file) {
      // In a real app, upload the file to a server and get the URL
      setSpeakerImage(URL.createObjectURL(file));
      setSpeakerImageFile(file);
      
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
        
        <FormActions onCancel={onCancel} isEditing={isEditing} />
      </form>
    </div>
  );
};

export default SermonForm;
