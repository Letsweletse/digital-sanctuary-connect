
import React from 'react';
import { Button } from "@/components/ui/button";

type LoginPromptProps = {
  show: boolean;
  onToggle: () => void;
}

const LoginPrompt: React.FC<LoginPromptProps> = ({ show, onToggle }) => {
  return (
    <div className="flex flex-col items-end">
      <Button 
        variant="ghost" 
        className="text-sm text-church-blue"
        onClick={onToggle}
      >
        Registered before? Log in
      </Button>

      {show && (
        <div className="mt-6 p-4 bg-church-blue-light/10 rounded-md text-sm w-full">
          Log in to use your saved payment details.
          <Button variant="link" className="text-church-blue p-0 h-auto text-sm ml-1">
            Login now
          </Button>
        </div>
      )}
    </div>
  );
};

export default LoginPrompt;
