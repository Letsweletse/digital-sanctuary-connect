
import React from 'react';
import { Check } from 'lucide-react';
import { Button } from "@/components/ui/button";

type ThankYouMessageProps = {
  onNewDonation: () => void;
}

const ThankYouMessage: React.FC<ThankYouMessageProps> = ({ onNewDonation }) => {
  return (
    <div className="text-center py-12 space-y-4">
      <div className="h-16 w-16 bg-church-gold/20 rounded-full flex items-center justify-center mx-auto">
        <Check className="h-8 w-8 text-church-gold-dark" />
      </div>
      <h3 className="text-2xl font-semibold text-church-blue-dark">Thank You For Your Gift!</h3>
      <p className="text-church-neutral-600">
        Your generous contribution will help us continue God's work in our community.
        A receipt has been sent to your email.
      </p>
      <Button 
        onClick={onNewDonation}
        className="mt-4 bg-church-blue text-white"
      >
        Make Another Donation
      </Button>
    </div>
  );
};

export default ThankYouMessage;
