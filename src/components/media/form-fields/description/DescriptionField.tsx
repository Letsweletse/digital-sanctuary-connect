
import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface DescriptionFieldProps {
  description: string;
  setDescription: (description: string) => void;
}

export const DescriptionField = ({ description, setDescription }: DescriptionFieldProps) => {
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setDescription(value);

    // Provide toast feedback for longer descriptions
    if (value.length > 500 && description.length <= 500) {
      toast({
        title: "Long description detected",
        description: "Your sermon description is quite detailed. Consider keeping it concise for better readability.",
      });
    }
  };

  return (
    <div>
      <Label htmlFor="description">Sermon Description</Label>
      <Textarea 
        id="description"
        value={description}
        onChange={handleChange}
        placeholder="Enter a brief description of the sermon"
        className="w-full mt-1"
        rows={4}
      />
    </div>
  );
};
