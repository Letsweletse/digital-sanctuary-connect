
import React from 'react';
import { DescriptionField } from '@/components/media/form-fields/description/DescriptionField';
import { TagsField } from '@/components/media/form-fields/description/TagsField';

interface SermonDescriptionProps {
  description: string;
  setDescription: (description: string) => void;
  tags: string[];
  setTags: (tags: string[]) => void;
}

const SermonDescription = ({
  description,
  setDescription,
  tags,
  setTags
}: SermonDescriptionProps) => {
  return (
    <>
      <DescriptionField 
        description={description}
        setDescription={setDescription}
      />
      
      <TagsField 
        tags={tags}
        setTags={setTags}
      />
    </>
  );
};

export default SermonDescription;
