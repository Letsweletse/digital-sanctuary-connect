
import React from 'react';
import { Button } from '@/components/ui/button';

interface FormActionsProps {
  onCancel: () => void;
  isEditing: boolean;
}

const FormActions = ({ onCancel, isEditing }: FormActionsProps) => {
  return (
    <div className="flex justify-end space-x-3 pt-4">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
      >
        Cancel
      </Button>
      <Button type="submit">
        {isEditing ? 'Update Sermon' : 'Add Sermon'}
      </Button>
    </div>
  );
};

export default FormActions;
