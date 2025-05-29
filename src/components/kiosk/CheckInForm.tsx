
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, LogIn } from 'lucide-react';

interface CheckInFormProps {
  onCheckIn: (identifier: string, method: 'manual') => Promise<boolean>;
  onBack: () => void;
}

const CheckInForm: React.FC<CheckInFormProps> = ({ onCheckIn, onBack }) => {
  const [identifier, setIdentifier] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) return;

    setIsSubmitting(true);
    await onCheckIn(identifier.trim(), 'manual');
    setIsSubmitting(false);
    setIdentifier('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="w-full max-w-2xl mx-auto bg-white rounded-3xl p-12 shadow-2xl"
    >
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-church-blue mb-4">
          Enter Your Details
        </h2>
        <p className="text-xl text-church-neutral-600">
          Please enter your email address or phone number
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <Input
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="Email address or phone number"
            className="h-16 text-2xl px-6 rounded-xl border-2 border-church-neutral-200 focus:border-church-blue"
            disabled={isSubmitting}
            autoFocus
          />
        </div>

        <div className="flex gap-4">
          <Button
            type="button"
            onClick={onBack}
            variant="outline"
            className="flex-1 h-16 text-xl font-semibold rounded-xl border-2"
            disabled={isSubmitting}
          >
            <ArrowLeft className="mr-3 h-6 w-6" />
            Back
          </Button>
          
          <Button
            type="submit"
            disabled={!identifier.trim() || isSubmitting}
            className="flex-1 h-16 bg-church-blue hover:bg-church-blue-dark text-xl font-semibold rounded-xl"
          >
            {isSubmitting ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
              />
            ) : (
              <>
                <LogIn className="mr-3 h-6 w-6" />
                Check In
              </>
            )}
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default CheckInForm;
