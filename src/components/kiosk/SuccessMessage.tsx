
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CheckCircle, ThumbsUp } from 'lucide-react';

interface SuccessMessageProps {
  attendeeName: string;
  onDone: () => void;
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({ attendeeName, onDone }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDone();
    }, 5000); // Auto-advance after 5 seconds

    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5 }}
      className="text-center space-y-8"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="w-32 h-32 bg-green-500 rounded-full flex items-center justify-center mx-auto"
      >
        <CheckCircle className="h-16 w-16 text-white" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="space-y-4"
      >
        <h2 className="text-5xl font-bold text-white">
          Welcome!
        </h2>
        <p className="text-3xl text-white/90">
          {attendeeName}
        </p>
        <p className="text-2xl text-white/80">
          You have been successfully checked in
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="space-y-6"
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex justify-center"
        >
          <ThumbsUp className="h-16 w-16 text-church-gold" />
        </motion.div>

        <Button
          onClick={onDone}
          className="bg-white text-church-blue hover:bg-white/90 text-2xl font-semibold px-12 py-6 rounded-2xl h-auto"
        >
          Continue
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default SuccessMessage;
