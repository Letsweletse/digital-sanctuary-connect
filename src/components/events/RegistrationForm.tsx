
import React from 'react';
import { Button } from "@/components/ui/button";
import { RegistrationFormData } from '@/types/eventTypes';
import { useIsMobile } from '@/hooks/use-mobile';
import PersonalInfoFields from './form-fields/PersonalInfoFields';
import ContactFields from './form-fields/ContactFields';
import ChurchInfoFields from './form-fields/ChurchInfoFields';
import { DialogFooter } from "@/components/ui/dialog";

interface RegistrationFormProps {
  formData: RegistrationFormData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
  isSubmitting: boolean;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({
  formData,
  onInputChange,
  onSubmit,
  onClose,
  isSubmitting
}) => {
  const isMobile = useIsMobile();
  
  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid gap-4">
        {/* Personal Information Fields */}
        <PersonalInfoFields 
          title={formData.title}
          name={formData.name}
          onInputChange={onInputChange}
        />
        
        {/* Contact Fields */}
        <ContactFields 
          email={formData.email}
          countryCode={formData.countryCode}
          phone={formData.phone}
          onInputChange={onInputChange}
        />
        
        {/* Church Information Fields */}
        <ChurchInfoFields 
          role={formData.role}
          denomination={formData.denomination}
          numberOfAttendees={formData.numberOfAttendees}
          onInputChange={onInputChange}
        />
      </div>
      
      <DialogFooter className={isMobile ? "flex-col gap-3 mt-4" : "sm:justify-between gap-3 mt-4"}>
        <Button 
          type="button" 
          variant="outline" 
          onClick={onClose} 
          className="border-church-neutral-300 w-full md:w-auto text-base"
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="bg-church-blue hover:bg-church-blue-dark text-white w-full md:w-auto text-base py-6 md:py-2.5 transition-all duration-300 hover:shadow-lg"
        >
          {isSubmitting ? 
            <span className="flex items-center gap-2">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Submitting...
            </span> 
            : "Submit Registration"
          }
        </Button>
      </DialogFooter>
    </form>
  );
};

export default RegistrationForm;
