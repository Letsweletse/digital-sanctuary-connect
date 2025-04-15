
/**
 * Hook for phone number validation logic
 */
export const usePhoneValidation = () => {
  const validatePhone = (phone: string, countryCode: string): { isValid: boolean; cleanedPhone: string; message?: string } => {
    let rawPhone = phone;
    
    if (countryCode && !rawPhone.startsWith(countryCode)) {
      rawPhone = `${countryCode}${rawPhone}`;
    }
    
    const cleanedPhone = rawPhone.replace(/[\s\-()]/g, '');
    
    // Basic international phone number validation
    const phoneRegex = /^\+\d{10,15}$/;
    const isValid = phoneRegex.test(cleanedPhone);
    
    return {
      isValid,
      cleanedPhone,
      message: isValid ? undefined : "Invalid phone number format. Please check your number."
    };
  };

  return {
    validatePhone
  };
};
