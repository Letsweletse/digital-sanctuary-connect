
import React from 'react';
import { Sermon } from '@/types/sermonTypes';
import SermonBasicInfo from './form-fields/SermonBasicInfo';
import SermonDescription from './form-fields/SermonDescription';
import SpeakerImageUpload from './form-fields/SpeakerImageUpload';
import SermonAudioUpload from './form-fields/SermonAudioUpload';
import FormActions from './form-fields/FormActions';
import SermonSeries from './form-fields/SermonSeries';
import { useSermonForm } from '@/hooks/useSermonForm';
import { Separator } from '@/components/ui/separator';

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
    uploadProgress,
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
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <section>
          <h4 className="text-lg font-medium text-church-neutral-800 mb-4">Step 1: Enter Sermon Information</h4>
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
        </section>
        
        <Separator />
        
        <section>
          <h4 className="text-lg font-medium text-church-neutral-800 mb-4">Step 2: Choose Sermon Series (Optional)</h4>
          <SermonSeries series={series} setSeries={setSeries} />
        </section>
        
        <Separator />
        
        <section>
          <h4 className="text-lg font-medium text-church-neutral-800 mb-4">Step 3: Add Description & Tags</h4>
          <SermonDescription
            description={description}
            setDescription={setDescription}
            tags={tags}
            setTags={(newTags: string[]) => setTags(newTags)}
          />
        </section>
        
        <Separator />
        
        <section>
          <h4 className="text-lg font-medium text-church-neutral-800 mb-4">Step 4: Upload Media</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-church-neutral-200 rounded-lg p-4">
              <h5 className="font-medium text-church-neutral-700 mb-3">Speaker Image</h5>
              <SpeakerImageUpload
                speaker={speaker}
                speakerImage={speakerImage}
                setSpeakerImage={(url: string) => setSpeakerImage(url)}
                handleSpeakerImageUpload={handleSpeakerImageUpload}
              />
            </div>
            
            <div className="border border-church-neutral-200 rounded-lg p-4">
              <h5 className="font-medium text-church-neutral-700 mb-3">Sermon Audio File</h5>
              <p className="text-sm text-church-neutral-600 mb-4">
                The audio file will be associated with the sermon details from Step 1:
                <span className="block mt-2 font-medium">Title: {title || '(Not set)'}</span>
                <span className="block font-medium">Speaker: {speaker || '(Not set)'}</span>
                <span className="block font-medium">Date: {date ? format(date, "PPP") : '(Not set)'}</span>
              </p>
              <SermonAudioUpload
                audioFile={audioFile}
                setAudioFile={setAudioFile}
                handleAudioUpload={handleAudioUpload}
                audioUrl={audioUrl}
                setAudioUrl={setAudioUrl}
                isUploading={isUploading}
                uploadProgress={uploadProgress}
                sermonTitle={title}
                speakerName={speaker}
              />
            </div>
          </div>
        </section>
        
        <Separator />
        
        <FormActions 
          onCancel={onCancel} 
          isEditing={isEditing} 
          isSubmitting={isSubmitting || isUploading}
          disableSubmit={isUploading || !title || !speaker || !date || (!audioUrl && !youtubeId)}
        />
      </form>
    </div>
  );
};

export default SermonForm;
