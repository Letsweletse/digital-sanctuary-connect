
import React from 'react';
import { Sermon } from '@/types/sermonTypes';
import SermonBasicInfo from './form-fields/SermonBasicInfo';
import SermonDescription from './form-fields/SermonDescription';
import SpeakerImageUpload from './form-fields/SpeakerImageUpload';
import SermonAudioUpload from './form-fields/SermonAudioUpload';
import FormActions from './form-fields/FormActions';
import SermonSeries from './form-fields/SermonSeries';
import { useSermonForm } from '@/hooks/useSermonForm';

interface SermonFormProps {
  sermon?: Sermon;
  onSubmit: (sermon: Omit<Sermon, 'id'>) => void;
  onCancel: () => void;
  isEditing: boolean;
}

const SermonForm = ({ sermon, onSubmit, onCancel, isEditing }: SermonFormProps) => {
  const {
    title,
    setTitle,
    speaker,
    setSpeaker,
    date,
    setDate,
    description,
    setDescription,
    youtubeId,
    setYoutubeId,
    tags,
    setTags,
    audioFile,
    setAudioFile,
    audioUrl,
    setAudioUrl,
    isSubmitting,
    isUploading,
    series,
    setSeries,
    speakerImage,
    setSpeakerImage,
    handleSubmit,
    handleSpeakerImageUpload,
    handleAudioUpload
  } = useSermonForm(sermon, onSubmit);

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
        
        <SermonSeries series={series} setSeries={setSeries} />
        
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
            audioUrl={audioUrl}
            setAudioUrl={setAudioUrl}
            isUploading={isUploading}
          />
        </div>
        
        <FormActions 
          onCancel={onCancel} 
          isEditing={isEditing} 
          isSubmitting={isSubmitting || isUploading}
        />
      </form>
    </div>
  );
};

export default SermonForm;
