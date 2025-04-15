
import { useRegistrationForm } from './useRegistrationForm';
import { useRegistrationDialog } from './useRegistrationDialog';
import { useRegistrationSubmission } from './useRegistrationSubmission';

export const useEventRegistration = () => {
  const { 
    formData,
    handleInputChange,
    resetFormData
  } = useRegistrationForm();
  
  const {
    isRegistrationOpen,
    currentEvent,
    handleOpenRegistration,
    handleCloseRegistration: originalCloseRegistration
  } = useRegistrationDialog();
  
  const {
    isSubmitting,
    handleSubmitRegistration
  } = useRegistrationSubmission();
  
  // Combine handleCloseRegistration with resetFormData
  const handleCloseRegistration = () => {
    originalCloseRegistration();
    resetFormData();
  };
  
  // Create a wrapper for handleSubmitRegistration to include all needed params
  const submitRegistration = (e: React.FormEvent) => {
    handleSubmitRegistration(e, formData, currentEvent, handleCloseRegistration);
  };
  
  return {
    isRegistrationOpen,
    currentEvent,
    formData,
    isSubmitting,
    handleOpenRegistration,
    handleCloseRegistration,
    handleInputChange,
    handleSubmitRegistration: submitRegistration
  };
};
