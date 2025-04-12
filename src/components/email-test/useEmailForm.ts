
import { useState, useCallback } from 'react';
import { EmailTestFormData, defaultFormData } from './types';

export function useEmailForm() {
  const [formData, setFormData] = useState<EmailTestFormData>(defaultFormData);
  const [edgeFunction, setEdgeFunction] = useState<string>('send-email');
  const [testEmail, setTestEmail] = useState<string>('');
  const [testPhone, setTestPhone] = useState<string>('+267');

  // Handle form input changes
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      setFormData(prev => ({
        ...prev,
        [name]: target.checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  }, []);

  // Reset the form to default values
  const resetForm = useCallback(() => {
    setFormData(defaultFormData);
  }, []);

  return {
    formData,
    edgeFunction,
    setEdgeFunction,
    handleInputChange,
    resetForm,
    testEmail,
    setTestEmail,
    testPhone,
    setTestPhone
  };
}
