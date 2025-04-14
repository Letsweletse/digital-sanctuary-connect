
import { useRegistrationForm } from './registration/useRegistrationForm';
import { useRegistrationDialog } from './registration/useRegistrationDialog';
import { useRegistrationSubmit } from './registration/useRegistrationSubmit';

export const useEventRegistration = () => {
  // Use the registration dialog hook
  const {
    isRegistrationOpen,
    currentEvent,
    whatsappLink,
    setWhatsappLink,
    handleOpenRegistration,
    handleCloseRegistration
  } = useRegistrationDialog();
  
  // Use the registration form hook
  const {
    formData,
    resetFormData,
    handleInputChange
  } = useRegistrationForm();
  
  // Create a wrapper for handleCloseRegistration that also resets the form
  const handleCompleteClose = () => {
    handleCloseRegistration();
    resetFormData();
  };
  
  // Use the registration submit hook
  const {
    isSubmitting,
    handleSubmitRegistration
  } = useRegistrationSubmit(
    formData,
    currentEvent,
    setWhatsappLink,
    handleCompleteClose
  );
  
  return {
    isRegistrationOpen,
    currentEvent,
    formData,
    isSubmitting,
    whatsappLink,
    handleOpenRegistration,
    handleCloseRegistration: handleCompleteClose,
    handleInputChange,
    handleSubmitRegistration
  };
};
