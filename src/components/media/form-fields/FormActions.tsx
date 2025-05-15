
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export interface FormActionsProps {
  onCancel: () => void;
  isEditing: boolean;
  isSubmitting: boolean;
  disableSubmit?: boolean;
}

const FormActions = ({ 
  onCancel, 
  isEditing, 
  isSubmitting,
  disableSubmit = false
}: FormActionsProps) => {
  return (
    <div className="flex justify-end space-x-4 pt-4">
      <Button 
        type="button" 
        variant="outline" 
        onClick={onCancel}
        disabled={isSubmitting}
      >
        Cancel
      </Button>
      <Button 
        type="submit" 
        className="bg-church-blue hover:bg-church-blue-dark"
        disabled={isSubmitting || disableSubmit}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {isEditing ? 'Saving...' : 'Adding...'}
          </> 
        ) : (
          isEditing ? 'Save Changes' : 'Add Sermon'
        )}
      </Button>
    </div>
  );
};

export default FormActions;
