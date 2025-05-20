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
import { format } from 'date-fns';

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
    <div className="glass-panel bg-white p-6 rounded-xl shadow-md max-w-5xl mx-auto">
      <h3 className="text-xl font-bold text-church-neutral-900 mb-6">
        {isEditing ? 'Edit Sermon' : 'Add New Sermon'}
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <section>
          <h4 className="text-lg font-medium text-church-blue flex items-center gap-2 mb-4">
            <span className="flex items-center justify-center bg-church-blue-light/20 w-8 h-8 rounded-full text-church-blue font-bold">
              1
            </span> 
            Enter Sermon Information
          </h4>
          <div className="bg-white rounded-md shadow-sm border border-church-neutral-200 p-5">
            <SermonBasicInfo
              title={title}
              setTitle={setTitle}
              speaker={speaker}
              setSpeaker={setSpeaker}
              date={date instanceof Date ? date : new Date(date || '')}
              setDate={setDate}
              youtubeId={youtubeId}
              setYoutubeId={setYoutubeId}
            />
          </div>
        </section>
        
        <Separator />
        
        <section>
          <h4 className="text-lg font-medium text-church-blue flex items-center gap-2 mb-4">
            <span className="flex items-center justify-center bg-church-blue-light/20 w-8 h-8 rounded-full text-church-blue font-bold">
              2
            </span> 
            Choose Sermon Series (Optional)
          </h4>
          <div className="bg-white rounded-md shadow-sm border border-church-neutral-200 p-5">
            <SermonSeries series={series} setSeries={setSeries} />
          </div>
        </section>
        
        <Separator />
        
        <section>
          <h4 className="text-lg font-medium text-church-blue flex items-center gap-2 mb-4">
            <span className="flex items-center justify-center bg-church-blue-light/20 w-8 h-8 rounded-full text-church-blue font-bold">
              3
            </span> 
            Add Description & Tags
          </h4>
          <div className="bg-white rounded-md shadow-sm border border-church-neutral-200 p-5">
            <SermonDescription
              description={description}
              setDescription={setDescription}
              tags={tags}
              setTags={(newTags: string[]) => setTags(newTags)}
            />
          </div>
        </section>
        
        <Separator />
        
        <section>
          <h4 className="text-lg font-medium text-church-blue flex items-center gap-2 mb-4">
            <span className="flex items-center justify-center bg-church-blue-light/20 w-8 h-8 rounded-full text-church-blue font-bold">
              4
            </span> 
            Upload Media
          </h4>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-md shadow-sm border border-church-neutral-200 p-5">
              <h5 className="font-medium text-church-neutral-700 mb-4">Speaker Image</h5>
              <SpeakerImageUpload
                speaker={speaker}
                speakerImage={speakerImage}
                setSpeakerImage={(url: string) => setSpeakerImage(url)}
                handleSpeakerImageUpload={handleSpeakerImageUpload}
              />
            </div>
            
            <div className="bg-white rounded-md shadow-sm border border-church-neutral-200 p-5">
              <h5 className="font-medium text-church-neutral-700 mb-4">Sermon Audio File</h5>
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
