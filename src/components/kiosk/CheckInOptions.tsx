
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Mail, QrCode } from 'lucide-react';

interface CheckInOptionsProps {
  onSelectMethod: (method: 'manual' | 'qr') => void;
}

const CheckInOptions: React.FC<CheckInOptionsProps> = ({ onSelectMethod }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="text-center space-y-8"
    >
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-4xl font-bold text-white mb-12"
      >
        How would you like to check in?
      </motion.h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            onClick={() => onSelectMethod('manual')}
            className="w-full h-40 bg-white text-church-blue hover:bg-white/90 text-2xl font-semibold rounded-2xl shadow-2xl"
          >
            <div className="flex flex-col items-center space-y-4">
              <Mail className="h-12 w-12" />
              <span>Enter Email or Phone</span>
            </div>
          </Button>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            onClick={() => onSelectMethod('qr')}
            className="w-full h-40 bg-white text-church-blue hover:bg-white/90 text-2xl font-semibold rounded-2xl shadow-2xl"
          >
            <div className="flex flex-col items-center space-y-4">
              <QrCode className="h-12 w-12" />
              <span>Scan QR Code</span>
            </div>
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CheckInOptions;
