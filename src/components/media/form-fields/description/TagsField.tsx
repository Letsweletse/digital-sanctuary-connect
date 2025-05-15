
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface TagsFieldProps {
  tags: string[];
  setTags: (tags: string[]) => void;
}

export const TagsField = ({ tags, setTags }: TagsFieldProps) => {
  const { toast } = useToast();
  const [tagsInput, setTagsInput] = useState(tags.join(', '));

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTagsInput(value);
    
    // Convert comma-separated string to array
    const newTags = value
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag !== '');
    
    setTags(newTags);
    
    // Provide feedback for many tags
    if (newTags.length > 8) {
      toast({
        title: "Many tags",
        description: "Consider using fewer tags for better search relevance.",
      });
    }
  };

  return (
    <div>
      <Label htmlFor="tags">Tags (comma-separated)</Label>
      <Input 
        id="tags"
        value={tagsInput}
        onChange={handleTagsChange}
        placeholder="e.g., Faith, Prayer, Holy Spirit"
        className="w-full mt-1"
      />
    </div>
  );
};
