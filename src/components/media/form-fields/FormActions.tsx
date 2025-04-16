
import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, X } from 'lucide-react';

interface FormActionsProps {
  onCancel: () => void;
  isEditing?: boolean;
  isSubmitting?: boolean;
}

const FormActions = ({ onCancel, isEditing = false, isSubmitting = false }: FormActionsProps) => {
  return (
    <div className="flex items-center justify-end space-x-4 mt-8">
      <Button 
        type="button" 
        variant="outline" 
        onClick={onCancel}
        disabled={isSubmitting}
      >
        <X className="mr-1 h-4 w-4" />
        Cancel
      </Button>
      
      <Button 
        type="submit"
        disabled={isSubmitting}
        className="bg-[#e6c98f] hover:bg-[#d4b87e] text-[#24324b]"
      >
        <CheckCircle className="mr-1 h-4 w-4" />
        {isSubmitting ? 'Saving...' : isEditing ? 'Update Sermon' : 'Save Sermon'}
      </Button>
    </div>
  );
};

export default FormActions;
