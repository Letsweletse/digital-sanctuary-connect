
import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface SermonDescriptionProps {
  description: string;
  setDescription: (description: string) => void;
  tags: string;
  setTags: (tags: string) => void;
}

const SermonDescription = ({
  description,
  setDescription,
  tags,
  setTags
}: SermonDescriptionProps) => {
  return (
    <>
      <div>
        <Label htmlFor="description">Sermon Description</Label>
        <Textarea 
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter a brief description of the sermon"
          className="w-full mt-1"
          rows={4}
        />
      </div>
      
      <div>
        <Label htmlFor="tags">Tags (comma-separated)</Label>
        <Input 
          id="tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="e.g., Faith, Prayer, Holy Spirit"
          className="w-full mt-1"
        />
      </div>
    </>
  );
};

export default SermonDescription;
